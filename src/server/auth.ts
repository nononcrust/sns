import { EmailTemplate } from "@/components/email/email-template";
import { route } from "@/constants/route";
import { sessionTokens } from "@/features/auth/token";
import { hash } from "@/lib/hash";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { googleApi, GoogleOAuthRedirectUrlSearchParams, RedirectUrl } from "@/services/google";
import { VerifyRecaptchaRequestBody } from "@/services/recaptcha";
import { ErrorCode } from "@/services/shared";
import { zValidator } from "@hono/zod-validator";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

export type LoginWithCredentialsRequestBody = z.infer<typeof LoginWithCredentialsRequestBody>;
export const LoginWithCredentialsRequestBody = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginWithCredentialsRequest = {
  body: LoginWithCredentialsRequestBody;
};

type SignupWithCredentialsRequestBody = z.infer<typeof SignupWithCredentialsRequestBody>;
export const SignupWithCredentialsRequestBody = z.object({
  email: z.string().email(),
  nickname: z.string().min(2),
  password: z.string().min(8),
});

type LoginWithGoogleRequestBody = z.infer<typeof LoginWithGoogleRequestBody>;
export const LoginWithGoogleRequestBody = z.object({
  redirect: RedirectUrl,
});

export type LoginWithGoogleRequest = {
  body: LoginWithGoogleRequestBody;
};

export type SignupWithCredentialsRequest = {
  body: SignupWithCredentialsRequestBody;
};

type ResetPasswordRequestBody = z.infer<typeof ResetPasswordRequestBody>;
export const ResetPasswordRequestBody = z.object({
  email: z.string().email(),
});

export type ResetPasswordRequest = {
  body: ResetPasswordRequestBody;
};

type Session = {
  user: User;
};

export type GetSessionResponse = Session | null;

export const CheckEmailRequestBody = z.object({
  email: z.string(),
});

export type CheckEmailRequest = z.infer<typeof CheckEmailRequest>;
const CheckEmailRequest = z.object({
  body: CheckEmailRequestBody,
});

const getSuccessRedirectUrl = (redirect: string | null) => {
  return redirect ?? route.home;
};

export const auth = new Hono()
  .post("/signup", zValidator("json", SignupWithCredentialsRequestBody), async (c) => {
    try {
      const body = c.req.valid("json");

      const hashedPassword = await hash.create(body.password);

      const newUser = await prisma.user.create({
        data: {
          nickname: body.nickname,
          email: body.email,
          credentials: {
            create: {
              password: hashedPassword,
            },
          },
          settings: {
            create: true,
          },
        },
      });

      return c.json(newUser, 201);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new HTTPException(400, {
          message: ErrorCode.EMAIL_ALREADY_EXISTS,
        });
      }
    }
  })
  .get("/session", async (c) => {
    const sessionToken = sessionTokens(c);

    const verifiedToken = await sessionToken.verify();

    if (!verifiedToken) {
      sessionToken.clear();

      return c.json<GetSessionResponse>(null, 200);
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: verifiedToken.userId,
      },
    });

    return c.json<GetSessionResponse>({ user }, 200);
  })
  .post("/passwordReset", zValidator("json", ResetPasswordRequestBody), async (c) => {
    const body = c.req.valid("json");

    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!existingUser) {
      throw new HTTPException(400, { message: "이메일이 존재하지 않습니다." });
    }

    const { data, error } = await resend.emails.send({
      from: "NONON <dev.nonon@gmail.com>",
      to: body.email,
      subject: "비밀번호 재설정",
      react: EmailTemplate(),
    });

    if (error) {
      throw new HTTPException(500);
    }

    return c.json(data, 200);
  })
  .get("/callback/google", zValidator("query", GoogleOAuthRedirectUrlSearchParams), async (c) => {
    try {
      const searchParams = c.req.valid("query");

      const sessionToken = sessionTokens(c);

      const response = await googleApi.getAccessToken(searchParams.code);
      const googleUserInfo = await googleApi.getUserInfo(response.access_token);

      const existingUser = await prisma.user.findFirst({
        where: {
          googleAccount: {
            googleId: googleUserInfo.id,
          },
        },
      });

      if (existingUser) {
        await sessionToken.issue({
          userId: existingUser.id,
        });

        return c.redirect(getSuccessRedirectUrl(searchParams.state.redirect));
      }

      const userWithSameEmail = await prisma.user.findFirst({
        where: {
          email: googleUserInfo.email,
        },
      });

      if (userWithSameEmail) {
        return c.redirect(route.auth.sameEmail);
      }

      const newUser = await prisma.user.create({
        data: {
          nickname: googleUserInfo.name,
          email: googleUserInfo.email,
          profileImage: googleUserInfo.picture,
          googleAccount: {
            create: {
              googleId: googleUserInfo.id,
            },
          },
          settings: {
            create: true,
          },
        },
      });

      await sessionToken.issue({
        userId: newUser.id,
      });

      const successRedirectUrl = getSuccessRedirectUrl(searchParams.state.redirect);

      return c.redirect(successRedirectUrl);
    } catch (error) {
      const errorRedirectUrl = route.auth.signup;

      return c.redirect(errorRedirectUrl);
    }
  })
  .post("/logout", async (c) => {
    const sessionToken = sessionTokens(c);
    sessionToken.clear();

    return c.json(200);
  })
  .post("/login", zValidator("json", LoginWithCredentialsRequestBody), async (c) => {
    const body = c.req.valid("json");

    const sessionToken = sessionTokens(c);

    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        credentials: {
          isNot: null,
        },
      },
      include: {
        credentials: {
          select: {
            password: true,
          },
        },
      },
    });

    if (!user || !user.credentials) {
      throw new HTTPException(400, {
        message: "존재하지 않는 사용자입니다.",
        cause: ErrorCode.USER_NOT_FOUND,
      });
    }

    const isPasswordValid = await hash.verify(user.credentials.password, body.password);

    if (!isPasswordValid) {
      throw new HTTPException(400, {
        message: "이메일 또는 비밀번호가 일치하지 않습니다.",
        cause: ErrorCode.INVALID_CREDENTIALS,
      });
    }

    const accessToken = await sessionToken.issue({
      userId: user.id,
    });

    return c.json({ accessToken }, 200);
  })
  .post("/recaptcha", zValidator("json", VerifyRecaptchaRequestBody), async (c) => {
    const body = c.req.valid("json");

    const response = await googleApi.verifyRecaptcha({
      token: body.token,
      action: body.action,
    });

    if (!response.success) {
      throw new HTTPException(400, { message: "Invalid reCAPTCHA" });
    }

    return c.json("ok", 200);
  })
  .post("/checkEmail", zValidator("json", CheckEmailRequestBody), async (c) => {
    const body = c.req.valid("json");

    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    return c.json({ exists: !!user }, 200);
  })
  .post("/google", zValidator("json", LoginWithGoogleRequestBody), async (c) => {
    const body = c.req.valid("json");

    const googleOAuthUrl = googleApi.generateGoogleOAuthUrl({
      redirect: body.redirect,
    });

    return c.json({ url: googleOAuthUrl }, 200);
  });
