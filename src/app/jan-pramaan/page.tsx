import { JanPramaanEntryScan } from "@/components/jan-pramaan-entry-scan";

/**
 * changes-1.md §6 "Entry state" — the neutral `/jan-pramaan` landing route
 * with no id. No project is pre-loaded or shown; the screen's only job is
 * prompting a QR scan (real scanner or the "Simulate scan" demo
 * affordance), which resolves to a project and navigates to
 * `/jan-pramaan/[id]` (see jan-pramaan-entry-scan.tsx for why navigation
 * was chosen over an in-place reveal).
 *
 * Same desktop/mobile split as `/jan-pramaan/[id]` (changes-1.md §6 point
 * 1): mobile gets the scan UI, desktop/laptop gets the same explanatory
 * message, both viewport-gated via `md:hidden` / `hidden md:block` — no
 * user-agent sniffing.
 */
export default function JanPramaanEntryPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col bg-paper font-body">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-14">
        <div className="text-center md:hidden">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Jan-Pramaan Verification
          </p>
          <h1 className="mt-3 font-display text-3xl tracking-tight text-ink-950">JAN-PRAMAAN</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-950/60">
            See it. Verify it. Keep it honest.
          </p>

          <div className="mx-auto mt-8 max-w-sm">
            <JanPramaanEntryScan />
          </div>
        </div>

        <div className="hidden text-center md:block">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Jan-Pramaan Verification
          </p>
          <h1 className="mt-3 font-display text-3xl tracking-tight text-ink-950">JAN-PRAMAAN</h1>
          <div className="mx-auto mt-8 max-w-md rounded-lg border border-dashed border-ink-950/15 p-6 text-sm text-ink-950/50">
            Please use your mobile device to access this feature.
          </div>
        </div>
      </div>
    </main>
  );
}
