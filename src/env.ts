import { z } from "zod";

const Env = z.object({
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  JWT_SECRET: z.string(),
  SUPABASE_PROJECT_URL: z.string(),
  SUPABASE_STORAGE_URL: z.string(),
  SUPABASE_BUCKET_NAME: z.string(),
  SUPABASE_SERVICE_KEY: z.string(),
  GOOGLE_RECAPTCHA_SECRET_KEY: z.string(),
  RESEND_API_KEY: z.string(),
});

export const env = Env.parse(process.env);
