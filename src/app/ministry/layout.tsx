import type { ReactNode } from "react";

// design.md §1.1 / §4.1 — Ministry is an Operate-mode surface: Inter body
// font, Slate neutrals, near-zero motion. The root layout (src/app/layout.tsx)
// sets Nunito as the global body font for the Persuade-mode public site, so
// every Operate route overrides it locally rather than the other way round.
export default function MinistryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="font-sans bg-slate-50 text-slate-700 min-h-[100dvh]">
      {children}
    </div>
  );
}
