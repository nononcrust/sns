import { Context } from "hono";
import { sessionTokens } from "./token";

export const getServerSession = async (c: Context) => {
  const sessionToken = sessionTokens(c);

  const verifiedToken = await sessionToken.verify();

  if (!verifiedToken) {
    return null;
  }

  return verifiedToken;
};
