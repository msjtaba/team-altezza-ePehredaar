"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "react-aria-components";
import { cn } from "@/lib/cn";

// Working dark-mode toggle (changes-2.md §1 / Open Item #2, decision: ADD
// dark mode now). Built on next-themes' `useTheme()` + a React Aria
// `Button` (Untitled UI's underlying interaction primitive) rather than a
// bare `<button>`, so it gets React Aria's focus/keyboard handling for free.
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // Avoid a hydration mismatch: the resolved theme is unknown on the
  // server, so render a neutral placeholder until mounted client-side.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      onPress={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500",
        "hover:bg-slate-50 hover:text-slate-700",
        "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200",
        "outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        "transition-colors duration-150",
        className
      )}
    >
      {mounted && isDark ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
    </Button>
  );
}
