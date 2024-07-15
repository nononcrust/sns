import { hash } from "@/lib/hash";
import { prisma } from "@/lib/prisma";
import { signupWithCredentialsRequestBodySchema } from "@/services/auth";
import { ApiError, ERROR_CODE } from "@/services/shared";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export const POST = async (request: NextRequest) => {
  try {
    const body = signupWithCredentialsRequestBodySchema.parse(await request.json());

    const hashedPassword = await hash.create(body.password);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        credentials: {
          create: {
            password: hashedPassword,
          },
        },
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(error, { status: 400 });
    }

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(new ApiError(ERROR_CODE.EMAIL_ALREADY_EXISTS), { status: 400 });
      }
    }

    NextResponse.json(error, { status: 500 });
  }
};
