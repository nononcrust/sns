import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "./shared";

export const authService = {
  useSignupWithCredentials: () => {
    return useMutation({
      mutationFn: api.auth.signup.$post,
    });
  },
  useLoginWithGoogle: () => {
    return useMutation({
      mutationFn: async (...args: Parameters<typeof api.auth.google.$post>) => {
        const response = await api.auth.google.$post(...args);
        return await response.json();
      },
    });
  },
  useLoginWithCredentials: () => {
    return useMutation({
      mutationFn: api.auth.login.$post,
    });
  },
  useGetSession: () => {
    return useQuery({
      queryKey: ["session"],
      queryFn: async () => {
        const response = await api.auth.session.$get();
        return await response.json();
      },
    });
  },
  useLogout: () => {
    return useMutation({
      mutationFn: async (...args: Parameters<typeof api.auth.logout.$post>) => {
        const response = await api.auth.logout.$post(...args);
        return await response.json();
      },
    });
  },
  useResetPassword: () => {
    return useMutation({
      mutationFn: api.auth.passwordReset.$post,
    });
  },
};
