"use client";

import { authService } from "@/services/auth";

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  authService.useGetSession();

  return <>{children}</>;
};
