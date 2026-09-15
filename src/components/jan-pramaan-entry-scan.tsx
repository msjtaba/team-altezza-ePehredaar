"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { resolveDemoJanPramaanQr } from "@/app/jan-pramaan/actions";

/**
 * The neutral, no-project-pre-loaded entry point (changes-1.md §6 "Entry
 * state"). No project data is fetched or shown here — this component's
 * only job is turning a QR scan into a navigation.
 *
 * Judgment call: on a successful scan, we client-side route to
 * `/jan-pramaan/[id]` via `useRouter().push(...)` rather than revealing the
 * project in place on this page. Reasons: (1) `/jan-pramaan/[id]` already
 * owns the full status banner + consensus meter + capture flow — resolving
 * in place would mean duplicating all of that here; (2) the printed
 * per-project QR (jan-pramaan-qr.tsx) already encodes that project's own
 * `/jan-pramaan/[id]` URL, so a *real* scan is naturally a navigation, not
 * a data fetch; (3) it keeps the URL shareable/bookmarkable per project,
 * consistent with how every other surface in the app works.
 *
 * A genuine decoded QR value is honored directly if it looks like a
 * `/jan-pramaan/<id>` path (this is what the real per-project QR encodes).
 * The "Simulate scan (demo)" affordance — matching the existing pattern in
 * jan-pramaan-capture.tsx's QrStep — always resolves to the §9.3 Osmania
 * University demo project via its stable `workId`, looked up server-side.
 */
export function JanPramaanEntryScan() {
  const router = useRouter();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function goToDemoProject() {
    setResolving(true);
    setError(null);
    const result = await resolveDemoJanPramaanQr();
    if (result.ok) {
      router.push(`/jan-pramaan/${result.projectId}`);
    } else {
      setError(result.error);
      setResolving(false);
    }
  }

  function handleDecoded(text: string) {
    const match = text.match(/\/jan-pramaan\/([a-zA-Z0-9-]+)/);
    if (match) {
      router.push(`/jan-pramaan/${match[1]}`);
    } else {
      // Not a recognized site QR — fall back to the demo project so the
      // flow still completes for the live demo.
      goToDemoProject();
    }
  }

  return (
    <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-marigold-100">
        <QrCode size={28} weight="bold" className="text-marigold-600" />
      </div>
      <h2 className="mt-4 font-display text-xl tracking-wide text-ink-950">SCAN TO BEGIN</h2>
      <p className="mx-auto mt-2 max-w-xs text-sm text-ink-950/60">
        Find the Jan-Pramaan QR code posted at the project site and scan it to pull up that
        project&apos;s details.
      </p>

      {scannerOpen ? (
        <QrScanner onDecoded={handleDecoded} />
      ) : (
        <button
          type="button"
          onClick={() => setScannerOpen(true)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-ink-950/20 px-5 py-4 text-sm font-semibold text-ink-950 hover:border-marigold-600"
        >
          <QrCode size={18} weight="bold" />
          Open camera scanner
        </button>
      )}

      <Button
        variant="marigold"
        className="mt-4 w-full"
        onClick={goToDemoProject}
        disabled={resolving}
      >
        {resolving ? "Loading project…" : "Simulate scan (demo)"}
      </Button>
      {error && <p className="mt-2 text-sm text-flagged">{error}</p>}
      <p className="mt-2 text-xs text-ink-950/40">
        No physical QR handy? Use the demo affordance above.
      </p>
    </div>
  );
}

function QrScanner({ onDecoded }: { onDecoded: (text: string) => void }) {
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scannerRef.current) return;
    let cancelled = false;
    let scanner: import("html5-qrcode").Html5Qrcode | null = null;

    import("html5-qrcode").then(({ Html5Qrcode }) => {
      if (cancelled || !scannerRef.current) return;
      scanner = new Html5Qrcode(scannerRef.current.id);
      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 200 },
          (decodedText) => {
            scanner?.stop().catch(() => {});
            onDecoded(decodedText);
          },
          undefined
        )
        .catch(() => {
          // Camera unavailable/denied — "Simulate scan" remains the
          // reliable demo path.
        });
    });

    return () => {
      cancelled = true;
      scanner?.stop().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id="jp-entry-qr-reader" ref={scannerRef} className="mt-5 overflow-hidden rounded-md" />;
}
