import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { sessionTokens } from "./token";

export const getServerSession = async (c: Context) => {
  const sessionToken = sessionTokens(c);

  const verifiedToken = await sessionToken.verify();

  if (!verifiedToken) {
    return null;
  }

  return verifiedToken;
};

export const getAuthenticatedServerSession = async (c: Context) => {
  const session = await getServerSession(c);

  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  return session;
};
