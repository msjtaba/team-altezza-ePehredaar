"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// brain.md §3 rule 3 — DM decisions on a grievance always carry a
// justification note + DM identity + timestamp (handled on the DM side,
// Phase 5). This action only creates the contractor's side: an open
// grievance routed toward that eventual DM review.
export async function fileGrievance(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/contractor/grievances");
  }

  const contractor = await prisma.contractor.findUnique({
    where: { userId: session.user.id },
  });
  if (!contractor) {
    redirect("/sign-in?callbackUrl=/contractor/grievances");
  }

  const description = String(formData.get("description") ?? "").trim();
  const evidenceUrl = String(formData.get("evidenceUrl") ?? "").trim();
  const alertId = String(formData.get("alertId") ?? "").trim();

  if (!description) {
    redirect("/contractor/grievances?error=description_required");
  }

  await prisma.grievance.create({
    data: {
      contractorId: contractor.id,
      alertId: alertId || null,
      description,
      evidenceUrl: evidenceUrl || null,
      status: "open",
    },
  });

  revalidatePath("/contractor/grievances");
  redirect("/contractor/grievances?success=1");
}
