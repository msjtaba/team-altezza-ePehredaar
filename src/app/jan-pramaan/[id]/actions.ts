"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

/**
 * brain.md §3 rule 6 — a single thumbs-down never freezes/disputes a
 * project. Only once independent negative submissions cross this threshold
 * does consensus flip to "disputed" (matches the seeded negative_consensus
 * alert framing — 3-5 submissions). Verified needs the mirror-image signal:
 * a healthy run of positive submissions with no dispute-level negativity.
 */
const DISPUTE_THRESHOLD = 3;
const VERIFY_THRESHOLD = 3;

function nextConsensusStatus(thumbsUp: number, thumbsDown: number): "awaiting" | "verified" | "disputed" {
  if (thumbsDown >= DISPUTE_THRESHOLD) return "disputed";
  if (thumbsUp >= VERIFY_THRESHOLD && thumbsUp > thumbsDown) return "verified";
  return "awaiting";
}

export type SubmitJanPramaanResult = { ok: true } | { ok: false; error: string };

/**
 * prd.md §4.3.2 — mobile-web capture flow submission. Creates the raw
 * submission row (never rendered publicly — brain.md §3 rule 5) and rolls
 * it into the project's aggregate JanPramaanConsensus, which is the only
 * thing any public/mobile surface is ever allowed to read back out.
 */
export async function submitJanPramaanVerification(
  projectId: string,
  input: {
    photoDataUri: string;
    vote: "up" | "down";
    note?: string;
    deviceTimestamp: number;
    gpsLat: number;
    gpsLng: number;
    gpsDeviationM: number;
  }
): Promise<SubmitJanPramaanResult> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { ok: false, error: "Project not found." };

  if (!input.photoDataUri.startsWith("data:image/")) {
    return { ok: false, error: "Invalid photo capture." };
  }
  if (input.vote !== "up" && input.vote !== "down") {
    return { ok: false, error: "Invalid vote." };
  }

  await prisma.janPramaanSubmission.create({
    data: {
      projectId,
      photoUrl: input.photoDataUri,
      deviceTimestamp: new Date(input.deviceTimestamp),
      gpsLat: input.gpsLat,
      gpsLng: input.gpsLng,
      gpsDeviationM: input.gpsDeviationM,
      mockLocationFlag: false,
      vote: input.vote,
      note: input.note?.trim() || null,
      isRealData: false,
    },
  });

  const existing = await prisma.janPramaanConsensus.findUnique({ where: { projectId } });
  const submissionCount = (existing?.submissionCount ?? 0) + 1;
  const thumbsUpCount = (existing?.thumbsUpCount ?? 0) + (input.vote === "up" ? 1 : 0);
  const thumbsDownCount = (existing?.thumbsDownCount ?? 0) + (input.vote === "down" ? 1 : 0);
  const status = nextConsensusStatus(thumbsUpCount, thumbsDownCount);

  await prisma.janPramaanConsensus.upsert({
    where: { projectId },
    create: { projectId, submissionCount, thumbsUpCount, thumbsDownCount, status },
    update: { submissionCount, thumbsUpCount, thumbsDownCount, status },
  });

  revalidatePath(`/jan-pramaan/${projectId}`);
  revalidatePath(`/projects/${projectId}`);

  return { ok: true };
}
