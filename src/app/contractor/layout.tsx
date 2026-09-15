import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PortalNav } from "@/components/contractor/portal-nav";

// design.md §1.1/§4.1/§7 — Operate-mode surface. Overrides the global
// Nunito/`font-body` default set in src/app/layout.tsx so this whole route
// subtree renders in Inter (`font-sans`) + Slate neutrals instead, keeping
// the Contractor Portal visually distinct from the Persuade public site.
// `src/middleware.ts` already gates `/contractor/*` to authenticated
// contractor-role sessions; this redirect is a defensive fallback only
// (e.g. a contractor user row missing its Contractor record).
export default async function ContractorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/contractor");
  }

  const contractor = await prisma.contractor.findUnique({
    where: { userId: session.user.id },
    select: { companyName: true, kycStatus: true },
  });

  return (
    <div className="font-sans bg-slate-50 text-slate-700 min-h-[100dvh]">
      <PortalNav
        companyName={contractor?.companyName ?? session.user.name ?? "Contractor"}
        kycStatus={contractor?.kycStatus ?? "unverified"}
      />
      <main className="mx-auto max-w-dashboard px-6 py-8">{children}</main>
    </div>
  );
}
