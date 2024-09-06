import { env } from "@/env";
import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { z } from "zod";
import { authConfig } from "./config";

const sessionTokenConfig = {
  expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
} as const;

export type SessionTokenPayload = z.infer<typeof SessionTokenPayload>;
const SessionTokenPayload = z.object({
  userId: z.string(),
});

const JWT_SECRET = env.JWT_SECRET;

const issueSessionToken = async (payload: SessionTokenPayload, c: Context) => {
  const jwtPayload = {
    ...payload,
    exp: sessionTokenConfig.expiresIn,
  };

  const sessionToken = await sign(jwtPayload, JWT_SECRET);

  setCookie(c, authConfig.sessionTokenKey, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return sessionToken;
};

const verifySessionToken = async (c: Context) => {
  const token = getCookie(c, authConfig.sessionTokenKey);

  if (!token) {
    return null;
  }

  try {
    return SessionTokenPayload.parse(await verify(token, JWT_SECRET));
  } catch {
    return null;
  }
};

const clearSessionToken = (c: Context) => {
  setCookie(c, authConfig.sessionTokenKey, "", { expires: new Date(0) });
};

export const sessionTokens = (c: Context) => {
  return {
    get: () => getCookie(c, authConfig.sessionTokenKey),
    issue: (payload: SessionTokenPayload) => issueSessionToken(payload, c),
    verify: () => verifySessionToken(c),
    clear: () => clearSessionToken(c),
  };
};
