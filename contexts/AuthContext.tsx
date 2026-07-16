"use client";

import React from "react";
import { SessionProvider, useSession } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export const useAuth = () => {
  const { data: session, status } = useSession();
  return {
    user: session?.user || null,
    session,
    isLoading: status === "loading",
  };
};
