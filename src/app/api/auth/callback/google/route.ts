import { route } from "@/constants/route";
import { issueSessionToken } from "@/features/auth/token";
import { prisma } from "@/lib/prisma";
import { googleApi, googleOAuthRedirectUrlSearchParamSchema } from "@/services/google";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

const getSuccessRedirectUrl = (redirect: string | null) => {
  return redirect ?? route.home;
};

export const GET = async (request: NextRequest) => {
  const searchParams = googleOAuthRedirectUrlSearchParamSchema.parse(
    Object.fromEntries(request.nextUrl.searchParams.entries()),
  );

  try {
    const response = await googleApi.getAccessToken(searchParams.code);
    const userInfo = await googleApi.getUserInfo(response.access_token);

    const existingUser = await prisma.user.findFirst({
      where: {
        googleAccount: {
          googleId: userInfo.id,
        },
      },
    });

    if (existingUser) {
      issueSessionToken({
        userId: existingUser.id,
      });

      return NextResponse.redirect(
        new URL(getSuccessRedirectUrl(searchParams.state.redirect), request.url),
      );
    }

    const userWithSameEmail = await prisma.user.findFirst({
      where: {
        email: userInfo.email,
      },
    });

    if (userWithSameEmail) {
      return NextResponse.redirect(new URL(route.auth.sameEmail, request.url));
    }

    const newUser = await prisma.user.create({
      data: {
        email: userInfo.email,
        profileImage: userInfo.picture,
        googleAccount: {
          create: {
            googleId: userInfo.id,
          },
        },
      },
    });

    issueSessionToken({
      userId: newUser.id,
    });

    return NextResponse.redirect(
      new URL(getSuccessRedirectUrl(searchParams.state.redirect), request.url),
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(error, { status: 400 });
    }

    return NextResponse.json(error, { status: 500 });
  }
};
