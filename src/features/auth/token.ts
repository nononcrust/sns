import { env } from "@/lib/env";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { z } from "zod";

const sessionTokenPayloadSchema = z.object({
  userId: z.string(),
});

export type SessionTokenPayload = z.infer<typeof sessionTokenPayloadSchema>;

export const SESSION_TOKEN_KEY = "auth.session-token";

const JWT_SECRET = env.JWT_SECRET;

export const issueSessionToken = async (payload: SessionTokenPayload) => {
  const cookie = cookies();

  const sessionToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

  cookie.set(SESSION_TOKEN_KEY, sessionToken);

  return sessionToken;
};

export const verifySessionToken = async (token: string) => {
  try {
    return sessionTokenPayloadSchema.parse(jwt.verify(token, JWT_SECRET));
  } catch {
    return null;
  }
};

export const clearSessionToken = async () => {
  const cookie = cookies();

  cookie.set(SESSION_TOKEN_KEY, "", { expires: new Date(0) });
};
