import { env } from "@/lib/env";
import axios from "axios";
import { z } from "zod";
import { redirectUrlSchema } from "./auth";

const googleApiUrl = {
  oAuth: "https://accounts.google.com/o/oauth2/v2/auth",
  accessToken: "https://oauth2.googleapis.com/token",
  userInfo: "https://www.googleapis.com/oauth2/v1/userinfo",
};

export const googleOAuthUrlStateSchema = z.object({
  redirect: redirectUrlSchema,
});

export const googleOAuthRedirectUrlSearchParamSchema = z.object({
  code: z.string(),
  state: z.string().transform((value) => googleOAuthUrlStateSchema.parse(JSON.parse(value))),
});

type GoogleOAuthUrlState = z.infer<typeof googleOAuthUrlStateSchema>;

export const generateGoogleOAuthUrl = (state: GoogleOAuthUrlState) => {
  const url = new URL(googleApiUrl.oAuth);

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "email profile",
    state: JSON.stringify(state),
  });

  url.search = params.toString();

  return url.toString();
};

export const googleApi = {
  getAccessToken: async (code: string) => {
    const response = await axios.post<GetAccessTokenResponse>(googleApiUrl.accessToken, {
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    return response.data;
  },
  getUserInfo: async (accessToken: string) => {
    const response = await axios.get<GetUserInfoResponse>(googleApiUrl.userInfo, {
      params: {
        access_token: accessToken,
      },
    });

    return response.data;
  },
};

interface GetAccessTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
}

interface GetUserInfoResponse {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
}
