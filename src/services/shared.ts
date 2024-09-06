import { App } from "@/server";
import { hc } from "hono/client";
import ky from "ky";
import { z } from "zod";

const kyClient = ky.create();

export const { api } = hc<App>("/", {
  fetch: kyClient,
});

export enum ErrorCode {
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export class ApiError {
  code: ErrorCode;

  constructor(code: ErrorCode) {
    this.code = code;
  }
}

const apiErrorSchema = z.object({
  code: z.string(),
});

export const isApiError = (error: unknown): error is ApiError => {
  return apiErrorSchema.safeParse(error).success;
};

export const queryKey = {
  post: "post",
  comment: "comment",
  profile: "profile",
  recaptcha: "recaptcha",
  tag: "tag",
} as const;
