import { signupWithGoogleRequestBodySchema } from "@/services/auth";
import { generateGoogleOAuthUrl } from "@/services/google";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = signupWithGoogleRequestBodySchema.parse(await request.json());

  const googleOAuthUrl = generateGoogleOAuthUrl({
    redirect: body.redirect,
  });

  return NextResponse.json({ url: googleOAuthUrl });
};
