"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// prd.md §4.2 — "Place Bid" is only available to KYC-verified contractors;
// re-checked server-side here even though the UI already gates the form,
// since this is a real mutation and the client-side gate is only a display
// concern (brain.md §3 rule 4 spirit — provenance/authorization is a data
// concern, not a display one).
export async function placeBid(tenderId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/contractor/bids");
  }
  // changes-4.md §4 authorization audit — server actions re-check the role
  // independently rather than relying solely on the route-level middleware
  // gate (server actions are invoked as a direct POST, not a page render).
  if (session.user.role !== "contractor") {
    redirect("/sign-in?callbackUrl=/contractor/bids");
  }

  const contractor = await prisma.contractor.findUnique({
    where: { userId: session.user.id },
  });
  if (!contractor) {
    redirect("/sign-in?callbackUrl=/contractor/bids");
  }
  if (contractor.kycStatus !== "verified") {
    redirect("/contractor/bids?error=verification_required");
  }

  const tender = await prisma.tender.findUnique({ where: { id: tenderId } });
  if (!tender || tender.status !== "open") {
    redirect("/contractor/bids?error=tender_closed");
  }

  const existing = await prisma.bid.findFirst({
    where: { tenderId, contractorId: contractor.id },
  });
  if (existing) {
    redirect("/contractor/bids?error=already_bid");
  }

  const priceQuote = Number(formData.get("priceQuote"));
  const proposedTimelineDays = Number(formData.get("proposedTimelineDays"));
  const supportingDocsUrl = String(formData.get("supportingDocsUrl") ?? "").trim();

  if (!Number.isFinite(priceQuote) || priceQuote <= 0) {
    redirect("/contractor/bids?error=invalid_price");
  }
  if (!Number.isInteger(proposedTimelineDays) || proposedTimelineDays <= 0) {
    redirect("/contractor/bids?error=invalid_timeline");
  }

  await prisma.bid.create({
    data: {
      tenderId,
      contractorId: contractor.id,
      priceQuote,
      proposedTimelineDays,
      supportingDocsUrl: supportingDocsUrl || null,
      status: "submitted",
    },
  });

  revalidatePath("/contractor/bids");
  revalidatePath("/contractor");
  redirect("/contractor/bids?success=1");
}
