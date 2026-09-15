"use server";

import { prisma } from "@/lib/prisma";

export type ResolveQrResult = { ok: true; projectId: string } | { ok: false; error: string };

/**
 * changes-1.md §6 "Entry state" + §9.3 — the neutral, no-project-pre-loaded
 * `/jan-pramaan` entry point resolves a QR scan to a project. The real QR
 * printed at any site encodes that project's own `/jan-pramaan/[id]` path
 * (see jan-pramaan-qr.tsx), so a genuine scan is handled client-side by
 * just navigating to the decoded path. This server action exists for the
 * "Simulate scan (demo)" affordance, which — per §9.3's locked spec value —
 * always resolves to the Osmania University demo project via its stable
 * `workId`, not a raw id a client could guess or hardcode.
 */
export async function resolveDemoJanPramaanQr(): Promise<ResolveQrResult> {
  const project = await prisma.project.findFirst({
    where: { workId: "OU-2025-114" },
    select: { id: true },
  });

  if (!project) {
    return {
      ok: false,
      error: "Demo project (Osmania University, work ID OU-2025-114) not found yet.",
    };
  }

  return { ok: true, projectId: project.id };
}
