"use client";

import { authService } from "@/services/auth";

export const useSession = () => {
  const { data: session } = authService.useGetSession();

  return { session };
};

export const useAuthenticatedSession = () => {
  const { session } = useSession();

  if (!session) {
    throw new Error("useAuthenticatedSession은 로그인된 상태에서만 사용할 수 있습니다.");
  }

  return { session };
};
