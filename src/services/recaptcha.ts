import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "./shared";

export const VerifyRecaptchaRequestBody = z.object({
  token: z.string(),
  action: z.string(),
});

type VerifyRecaptchaRequest = z.infer<typeof VerifyRecaptchaRequest>;
const VerifyRecaptchaRequest = z.object({
  body: VerifyRecaptchaRequestBody,
});

export const recaptchaService = {
  useVerifyRecaptcha: () => {
    return useMutation({
      mutationFn: api.auth.recaptcha.$post,
    });
  },
};
