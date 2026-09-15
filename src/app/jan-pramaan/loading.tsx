/**
 * Route-segment loader for the Jan-Pramaan surface (changes-1.md §6 point
 * "Jan-Pramaan-specific loading screen"). Next's `loading.tsx` convention
 * fires on every navigation into `/jan-pramaan` and `/jan-pramaan/[id]` —
 * intentionally distinct from the global, session-gated splash screen
 * (that one only fires once per session on first site load; this one is a
 * per-navigation route transition, matching how a citizen actually enters
 * the flow — often straight off a QR scan, not through the rest of the
 * site). design.md §6.1: Jan-Pramaan is "the one place a slightly more
 * expressive, reassuring motion is earned" — kept under 400ms, single
 * signal, and fully inert under prefers-reduced-motion (global CSS rule in
 * globals.css collapses all animation-duration to ~0).
 */
export default function JanPramaanLoading() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-paper px-6 font-body">
      <div className="jp-loader-mark flex flex-col items-center gap-3 text-center">
        <span className="jp-loader-dot h-3 w-3 rounded-full bg-marigold-600" />
        <h1 className="jp-loader-title font-display text-2xl tracking-wide text-ink-950 md:text-3xl">
          JAN-PRAMAAN
        </h1>
        <p className="jp-loader-tagline max-w-xs text-sm text-ink-950/60">
          See it. Verify it. Keep it honest.
        </p>
      </div>

      {/* Single finite entrance sequence, under 400ms total — design.md §6.3
          reserves infinite loops for the one justified "awaiting
          verification" pulse chip, so this loader animates in once and
          settles rather than looping. */}
      <style>{`
        .jp-loader-dot {
          animation: jp-pop 300ms ease-out both;
        }
        .jp-loader-title {
          animation: jp-fade-in 350ms ease-out 60ms both;
        }
        .jp-loader-tagline {
          animation: jp-fade-in 350ms ease-out 140ms both;
        }
        @keyframes jp-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes jp-pop {
          from { opacity: 0; transform: scale(0.4); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </main>
  );
}
