"use client";

import { authService } from "@/services/auth";

export const useSession = () => {
  const { data: session } = authService.useGetSession();

  return session;
};
