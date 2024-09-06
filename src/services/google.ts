import { env } from "@/env";
import ky from "ky";
import { z } from "zod";

export const RedirectUrl = z.string().nullable();

const googleApiUrl = {
  oAuth: "https://accounts.google.com/o/oauth2/v2/auth",
  accessToken: "https://oauth2.googleapis.com/token",
  userInfo: "https://www.googleapis.com/oauth2/v1/userinfo",
  recaptcha: "https://www.google.com/recaptcha/api/siteverify",
} as const;

export const googleOAuthConfig = {
  responseType: "code",
  scope: "email profile",
  grantType: "authorization_code",
} as const;

type GoogleOAuthUrlState = z.infer<typeof GoogleOAuthUrlState>;
export const GoogleOAuthUrlState = z.object({
  redirect: RedirectUrl,
});

export const GoogleOAuthRedirectUrlSearchParams = z.object({
  code: z.string(),
  state: z.string().transform((value) => GoogleOAuthUrlState.parse(JSON.parse(value))),
});

type GetAccessTokenResponse = z.infer<typeof GetAccessTokenResponse>;
const GetAccessTokenResponse = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  scope: z.string(),
  token_type: z.string(),
  id_token: z.string(),
});

type GetUserInfoResponse = z.infer<typeof GetUserInfoResponse>;
const GetUserInfoResponse = z.object({
  id: z.string(),
  email: z.string(),
  verified_email: z.boolean(),
  name: z.string(),
  given_name: z.string(),
  picture: z.string(),
});

type VerifyRecaptchaSuccessResponse = z.infer<typeof VerifyRecaptchaSuccessResponse>;
const VerifyRecaptchaSuccessResponse = z.object({
  success: z.literal(true),
  challenge_ts: z.string(),
  hostname: z.string(),
  score: z.number(),
});

type VerifyRecaptchaErrorResponse = z.infer<typeof VerifyRecaptchaErrorResponse>;
const VerifyRecaptchaErrorResponse = z.object({
  success: z.literal(false),
  "error-codes": z.array(z.string()),
});

const VerifyRecaptchaResponse = z.union([
  VerifyRecaptchaSuccessResponse,
  VerifyRecaptchaErrorResponse,
]);

class GoogleApi {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private recaptchaSecretKey: string;

  constructor(env: {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_REDIRECT_URI: string;
    GOOGLE_RECAPTCHA_SECRET_KEY: string;
  }) {
    this.clientId = env.GOOGLE_CLIENT_ID;
    this.clientSecret = env.GOOGLE_CLIENT_SECRET;
    this.redirectUri = env.GOOGLE_REDIRECT_URI;
    this.recaptchaSecretKey = env.GOOGLE_RECAPTCHA_SECRET_KEY;
  }

  generateGoogleOAuthUrl(state: GoogleOAuthUrlState) {
    const url = new URL(googleApiUrl.oAuth);

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: googleOAuthConfig.responseType,
      scope: googleOAuthConfig.scope,
      state: JSON.stringify(state),
    });

    url.search = params.toString();
    return url.toString();
  }

  async getAccessToken(code: string) {
    const data = await ky
      .post(googleApiUrl.accessToken, {
        json: {
          code: code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          grant_type: googleOAuthConfig.grantType,
        },
      })
      .json();

    return GetAccessTokenResponse.parse(data);
  }

  async getUserInfo(accessToken: string) {
    const data = await ky
      .get(googleApiUrl.userInfo, {
        searchParams: {
          access_token: accessToken,
        },
      })
      .json();

    return GetUserInfoResponse.parse(data);
  }

  async verifyRecaptcha({ token, action }: { token: string; action: string }) {
    const params = {
      secret: this.recaptchaSecretKey,
      response: token,
      action,
    };

    const data = await ky
      .post(googleApiUrl.recaptcha, {
        searchParams: params,
      })
      .json();

    return VerifyRecaptchaResponse.parse(data);
  }
}

export const googleApi = new GoogleApi({
  GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: env.GOOGLE_REDIRECT_URI,
  GOOGLE_RECAPTCHA_SECRET_KEY: env.GOOGLE_RECAPTCHA_SECRET_KEY,
});
