"use client";

import { type ReactNode } from "react";
import { Toaster } from "sonner";

import { TRPCReactProvider } from "~/trpc/react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <TRPCReactProvider>
      {children}
      <Toaster
        richColors
        closeButton
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "font-sans",
          },
        }}
      />
    </TRPCReactProvider>
  );
}
