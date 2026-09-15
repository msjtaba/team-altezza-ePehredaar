"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

// Untitled UI React's Next.js integration wires next-themes for light/dark
// mode (changes-2.md §1 / Open Item #2 — dark mode toggle: ON). class-based
// toggling matches tailwind.config.ts's `darkMode: ["class"]`, so every
// existing `dark:` utility across the app (and the new Untitled UI-pattern
// components) responds to the same toggle.
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
