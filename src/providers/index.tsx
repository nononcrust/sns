"use client";

import { SessionProvider } from "@/features/auth/session-provider";
import { queryClientConfig } from "@/services/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
        <Toaster
          containerStyle={{ position: "sticky" }}
          toastOptions={{
            position: "bottom-center",
            style: {
              backgroundColor: "#333",
              color: "white",
              fontWeight: 600,
            },
          }}
        />
      </SessionProvider>
    </QueryClientProvider>
  );
};
