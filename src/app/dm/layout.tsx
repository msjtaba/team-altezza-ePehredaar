import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DmNav } from "@/components/dm/dm-nav";

// Vercel/serverless fix: this page/layout queries Prisma at render time,
// which must never happen during Next's static-generation build step (no
// working DATABASE_URL exists in that build container) — force per-request
// rendering instead.
export const dynamic = "force-dynamic";

// design.md §1.1/§4.1/§7 — Operate-mode surface, the highest VISUAL_DENSITY
// surface in the product (design.md §1 "a cockpit, not a gallery"). Overrides
// the global Nunito/`font-body` default from src/app/layout.tsx, same pattern
// as src/app/contractor/layout.tsx and src/app/ministry/layout.tsx.
// src/middleware.ts already gates /dm/* to authenticated dm-role sessions;
// this redirect is a defensive fallback only — but it must independently
// re-check the role too (changes-4.md §4), not just that a session exists,
// since every route/action under /dm/* is expected to reject the wrong
// role server-side on its own rather than lean entirely on the middleware.
export default async function DmLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user.role !== "dm" && session.user.role !== "admin")) {
    redirect("/sign-in?callbackUrl=/dm");
  }

  const dmUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { district: true },
  });

  return (
    <div className="font-body bg-paper text-ink-950/80 min-h-[100dvh]">
      <DmNav name={dmUser?.name ?? session.user.name ?? "District Magistrate"} district={dmUser?.district?.name ?? null} />
      <main className="mx-auto max-w-dashboard px-6 py-8">{children}</main>
    </div>
  );
}
