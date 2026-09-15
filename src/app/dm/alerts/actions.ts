"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ALERT_DECISIONS } from "@/lib/enums";

export type AlertActionResult = { ok: true } | { ok: false; error: string };

/**
 * The single write path for every DM decision in the Alerts Inbox
 * (prd.md §4.4.2). brain.md §3 rule 3 is non-negotiable here: every
 * approve/reject/escalate/audit call creates an AlertAction row carrying
 * the DM's identity, a required justification note, and a timestamp — and
 * updates Alert.status so the change is immediately visible both in the
 * Approvals/Audit Log (task 7) and on the alert's own inline history.
 */
export async function takeAlertAction(
  alertId: string,
  decision: (typeof ALERT_DECISIONS)[number],
  newStatus: string,
  justificationNote: string
): Promise<AlertActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "dm") {
    return { ok: false, error: "Not authorized." };
  }

  const note = justificationNote.trim();
  if (note.length < 10) {
    return { ok: false, error: "Justification note must be at least 10 characters." };
  }
  if (!ALERT_DECISIONS.includes(decision)) {
    return { ok: false, error: "Unrecognized decision type." };
  }

  const alert = await prisma.alert.findUnique({ where: { id: alertId } });
  if (!alert) {
    return { ok: false, error: "Alert not found." };
  }

  const writes: Prisma.PrismaPromise<unknown>[] = [
    prisma.alertAction.create({
      data: {
        alertId,
        dmId: session.user.id,
        decision,
        justificationNote: note,
      },
    }),
    prisma.alert.update({ where: { id: alertId }, data: { status: newStatus } }),
  ];

  // changes-4.md §1 — an Approve on a Jan-Pramaan alert IS the DM's
  // authorization to release payment (the prototype's simulated "Smart
  // Escrow" trigger). Flip that project's earliest still-pending milestone
  // to "released" — no real payment gateway, just the DB status flip.
  if (alert.category === "jan_pramaan" && decision === "approved_with_justification" && alert.projectId) {
    const pendingMilestone = await prisma.milestone.findFirst({
      where: { projectId: alert.projectId, paymentStatus: "pending" },
      orderBy: { sequenceOrder: "asc" },
    });
    if (pendingMilestone) {
      writes.push(
        prisma.milestone.update({
          where: { id: pendingMilestone.id },
          data: { paymentStatus: "released" },
        })
      );
    }
  }

  await prisma.$transaction(writes);

  // Reflect the decision everywhere brain.md §3 rule 3 requires it to show
  // up: the inbox itself, the audit log, and the project/contractor detail
  // pages' DM-only alert-history sections.
  revalidatePath("/dm/alerts");
  revalidatePath("/dm/audit-log");
  revalidatePath("/dm");
  if (alert.projectId) revalidatePath(`/projects/${alert.projectId}`);
  if (alert.contractorId) revalidatePath(`/contractors/${alert.contractorId}`);
  // Milestone payment-status flips (jan_pramaan approve, above) are also
  // visible on the contractor's own project/milestone tracker.
  revalidatePath("/contractor/projects");

  return { ok: true };
}
