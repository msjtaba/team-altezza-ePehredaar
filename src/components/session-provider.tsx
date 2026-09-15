"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

// Thin client wrapper so any client component can call `useSession()` /
// `signOut()`. Server components should prefer `getServerSession(authOptions)`
// directly (see src/lib/auth.ts) rather than this context.
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
