import { issueSessionToken } from "@/features/auth/token";
import { hash } from "@/lib/hash";
import { prisma } from "@/lib/prisma";
import { loginRequestBodySchema } from "@/services/auth";
import { ApiError, ERROR_CODE } from "@/services/shared";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const POST = async (request: Request) => {
  try {
    const body = loginRequestBodySchema.parse(await request.json());

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

    if (!user) {
      return NextResponse.json(new ApiError(ERROR_CODE.USER_NOT_FOUND), { status: 400 });
    }

    const isPasswordValid = await hash.verify(user.credentials!.password, body.password);

    if (!isPasswordValid) {
      return NextResponse.json(new ApiError(ERROR_CODE.INVALID_CREDENTIALS), { status: 400 });
    }

    const accessToken = issueSessionToken({
      userId: user.id,
    });

    return NextResponse.json(accessToken, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(error, { status: 400 });
    }

    return NextResponse.json(error, { status: 500 });
  }
};
