import axios from "axios";
import { z } from "zod";

export const api = axios.create({
  baseURL: "/api",
});

export const ERROR_CODE = {
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
} as const;

type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

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
