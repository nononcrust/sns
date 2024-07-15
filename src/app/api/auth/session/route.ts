import { clearSessionToken, SESSION_TOKEN_KEY, verifySessionToken } from "@/features/auth/token";
import { GetSessionResponse } from "@/services/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  const cookie = cookies();

  const token = cookie.get(SESSION_TOKEN_KEY);

  if (!token) {
    return NextResponse.json<GetSessionResponse>(null, { status: 200 });
  }

  const verifiedToken = await verifySessionToken(token.value);

  if (!verifiedToken) {
    clearSessionToken();

    return NextResponse.json<GetSessionResponse>(null, { status: 200 });
  }

  return NextResponse.json<GetSessionResponse>(verifiedToken, { status: 200 });
};
