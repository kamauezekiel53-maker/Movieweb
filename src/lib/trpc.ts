import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/index";
import { QueryClient } from "@tanstack/react-query";
import React from "react";

export const trpc = createTRPCReact<AppRouter>();

export function createClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: "/api/trpc",
      }),
    ],
  });
}

export const queryClient = new QueryClient();

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const client = React.useMemo(() => createClient(), []);
  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  );
}