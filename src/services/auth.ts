import { SessionTokenPayload } from "@/features/auth/token";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "./shared";

const ENDPOINT = "/auth";

export const authApi = {
  loginWithCredentials: async (request: LoginRequest) => {
    const response = await api.post(`${ENDPOINT}/login`, request.body);
    return response.data;
  },
  signupWithCredentials: async (request: SignupWithCredentialsRequest) => {
    const response = await api.post(`${ENDPOINT}/signup`, request.body);
    return response.data;
  },
  signupWithGoogle: async (request: SignupWithGoogleRequest) => {
    const response = await api.post<{ url: string }>(`${ENDPOINT}/google`, request.body);
    return response.data;
  },
  getSession: async () => {
    const response = await api.get<GetSessionResponse>(`${ENDPOINT}/session`);
    return response.data;
  },
};

// TODO: redirect URL 검증 로직 추가
export const redirectUrlSchema = z.string().nullable();

export const loginRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginRequest = {
  body: z.infer<typeof loginRequestBodySchema>;
};

export const signupWithCredentialsRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signupWithGoogleRequestBodySchema = z.object({
  redirect: redirectUrlSchema,
});

type SignupWithGoogleRequest = {
  body: z.infer<typeof signupWithGoogleRequestBodySchema>;
};

type SignupWithCredentialsRequest = {
  body: z.infer<typeof signupWithCredentialsRequestBodySchema>;
};

export type GetSessionResponse = SessionTokenPayload | null;

export const authService = {
  useSignupWithCredentials: () => {
    return useMutation({
      mutationFn: authApi.signupWithCredentials,
    });
  },
  useSignupWithGoogle: () => {
    return useMutation({
      mutationFn: authApi.signupWithGoogle,
    });
  },
  useGetSession: () => {
    return useQuery({
      queryKey: ["session"],
      queryFn: authApi.getSession,
    });
  },
};

export const SIGN_UP_ERROR_CODE = {
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
} as const;
