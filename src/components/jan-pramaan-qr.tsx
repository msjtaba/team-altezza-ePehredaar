"use client";

import { QRCodeSVG } from "qrcode.react";

/**
 * brain.md §3 rule 7 / prd.md §4.3.5 — the QR code only exists once a
 * project is marked 100% complete. Callers must gate on
 * `isStageCompletedOrLater(project.status)` before rendering this — it does
 * not re-check stage itself, since it has no access to the stage string.
 * Secondary/demo-only affordance: shows "what a contractor would post at
 * the site" once verification is unlockable, kept visually small.
 */
export function JanPramaanQr({ url }: { url: string }) {
  return (
    <div className="inline-flex flex-col items-center gap-2 rounded-lg border border-ink-950/10 bg-paper-2 p-4">
      <QRCodeSVG value={url} size={112} fgColor="#14142B" bgColor="#FBF8F2" />
      <p className="max-w-[140px] text-center text-xs text-ink-950/50">
        Site QR — scan to open this project&apos;s Jan-Pramaan page
      </p>
    </div>
  );
}
