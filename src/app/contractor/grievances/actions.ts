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
  // changes-4.md §4 authorization audit — server actions re-check the role
  // independently rather than relying solely on the route-level middleware
  // gate (server actions are invoked as a direct POST, not a page render).
  if (session.user.role !== "contractor") {
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

  // Scoping fix: a crafted request could otherwise submit an alertId
  // belonging to a different contractor's alert. Only accept it if it
  // actually belongs to this contractor (or drop it silently otherwise).
  let linkedAlertId: string | null = null;
  if (alertId) {
    const alert = await prisma.alert.findUnique({ where: { id: alertId } });
    if (alert && alert.contractorId === contractor.id) {
      linkedAlertId = alertId;
    }
  }

  await prisma.grievance.create({
    data: {
      contractorId: contractor.id,
      alertId: linkedAlertId,
      description,
      evidenceUrl: evidenceUrl || null,
      status: "open",
    },
  });

  revalidatePath("/contractor/grievances");
  redirect("/contractor/grievances?success=1");
}
