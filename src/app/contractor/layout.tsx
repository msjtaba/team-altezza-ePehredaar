import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PortalNav } from "@/components/contractor/portal-nav";

// Vercel/serverless fix: this page/layout queries Prisma at render time,
// which must never happen during Next's static-generation build step (no
// working DATABASE_URL exists in that build container) — force per-request
// rendering instead.
export const dynamic = "force-dynamic";

// changes-6.md §1 — retheme onto the same Persuade system (paper/ink,
// Nunito `font-body`, Anton `font-display`) used by every other page in the
// app, so the authenticated Contractor Portal reads as the same site rather
// than a bolted-on Operate dashboard. `src/middleware.ts` already gates
// `/contractor/*` to authenticated contractor-role sessions; this redirect
// is a defensive fallback only (e.g. a contractor user row missing its
// Contractor record).
export default async function ContractorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/contractor");
  }
  // changes-4.md §4 authorization audit — re-check the role here too, rather
  // than relying solely on src/middleware.ts's route-level gate.
  if (session.user.role !== "contractor") {
    redirect("/sign-in?callbackUrl=/contractor");
  }

  const contractor = await prisma.contractor.findUnique({
    where: { userId: session.user.id },
    select: { companyName: true, kycStatus: true },
  });

  return (
    <div className="font-body bg-paper text-ink-950/80 min-h-[100dvh]">
      <PortalNav
        companyName={contractor?.companyName ?? session.user.name ?? "Contractor"}
        kycStatus={contractor?.kycStatus ?? "unverified"}
      />
      <main className="mx-auto max-w-dashboard px-6 py-8">{children}</main>
    </div>
  );
}
