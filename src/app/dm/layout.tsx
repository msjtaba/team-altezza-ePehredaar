import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DmNav } from "@/components/dm/dm-nav";

// design.md §1.1/§4.1/§7 — Operate-mode surface, the highest VISUAL_DENSITY
// surface in the product (design.md §1 "a cockpit, not a gallery"). Overrides
// the global Nunito/`font-body` default from src/app/layout.tsx, same pattern
// as src/app/contractor/layout.tsx and src/app/ministry/layout.tsx.
// src/middleware.ts already gates /dm/* to authenticated dm-role sessions;
// this redirect is a defensive fallback only.
export default async function DmLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/dm");
  }

  const dmUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { district: true },
  });

  return (
    <div className="font-sans bg-slate-50 text-slate-700 min-h-[100dvh]">
      <DmNav name={dmUser?.name ?? session.user.name ?? "District Magistrate"} district={dmUser?.district?.name ?? null} />
      <main className="mx-auto max-w-dashboard px-6 py-8">{children}</main>
    </div>
  );
}
