"use client";

import { useRouter } from "next/navigation";
import { RouterProvider } from "react-aria-components";
import type { ReactNode } from "react";

// React Aria / Untitled UI's documented Next.js App Router adapter: wire
// React Aria's router context to `next/navigation`'s `useRouter()` so any
// Untitled UI / React Aria component that navigates (links, menu items,
// etc.) goes through Next's client-side router instead of a full reload.
declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

export function RouteProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <RouterProvider navigate={router.push} useHref={(href) => href}>
      {children}
    </RouterProvider>
  );
}
