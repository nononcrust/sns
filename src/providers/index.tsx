"use client";

import { SessionProvider } from "@/features/auth/session-provider";
import { GlobalDialogProvider } from "@/features/dialog/global-dialog";
import { ThemeProvider } from "@/features/theme/theme-provider";
import { Toaster } from "@/features/toast/toaster";
import { queryClientConfig } from "@/services/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <GlobalDialogProvider>
            {children}
            <Toaster />
          </GlobalDialogProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
