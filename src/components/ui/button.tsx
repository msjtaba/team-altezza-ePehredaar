import { type ButtonHTMLAttributes, forwardRef } from "react";

// design.md §4.1 — "primary/secondary/ghost" are Operate-mode (navy, Inter,
// ≤150ms). "marigold/outline-paper" are Persuade-mode (§3.0, ≤300ms hover
// lift). Never mix the two families on one surface.
type Variant = "primary" | "secondary" | "ghost" | "marigold" | "outline-paper";

const base =
  "inline-flex items-center justify-center rounded-md text-sm font-semibold " +
  "transition-all focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-offset-2 disabled:pointer-events-none " +
  "disabled:opacity-50 px-5 py-2.5 whitespace-nowrap";

const variants: Record<Variant, string> = {
  // Operate (v1, unchanged) — 150ms color-only transition, no motion.
  primary: "bg-navy-700 text-white hover:bg-navy-900 duration-150 focus-visible:ring-navy-700",
  secondary:
    "border border-navy-700 text-navy-700 bg-white hover:bg-navy-50 duration-150 focus-visible:ring-navy-700",
  ghost: "text-navy-700 hover:bg-navy-50 duration-150 focus-visible:ring-navy-700",

  // Persuade (v2) — 250ms with a hover lift, per design.md §6.2's 200-500ms band.
  marigold:
    "bg-marigold-600 text-ink-950 hover:bg-marigold-400 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-marigold-600/20 duration-[250ms] focus-visible:ring-marigold-600",
  "outline-paper":
    "border-2 border-ink-950/15 text-ink-950 hover:border-ink-950 hover:-translate-y-0.5 duration-[250ms] focus-visible:ring-ink-950",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(({ className = "", variant = "primary", ...props }, ref) => (
  <button
    ref={ref}
    className={`${base} ${variants[variant]} ${className}`}
    {...props}
  />
));
Button.displayName = "Button";
