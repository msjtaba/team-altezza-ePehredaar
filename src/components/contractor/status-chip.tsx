// changes-6.md §1 retheme: Persuade-styled status chip for non-risk status
// meaning (bid status, tender status, milestone payment status, grievance
// status) — kept as its own small component rather than `Badge` because it
// carries a 4-tone vocabulary (neutral/positive/warning/negative) that
// `Badge`'s tier set doesn't map onto directly. The `healthy`/`watch`/
// `flagged` tones below reuse the locked risk-triad color tokens purely for
// their positive/warning/negative visual meaning — never to imply a risk
// score (design.md §3.3 pairs color with text always). `neutral` now uses
// the same ink-based neutral as `Badge`'s "stage" tier, matching the rest
// of the Persuade site.
type Tone = "neutral" | "positive" | "warning" | "negative";

const tones: Record<Tone, string> = {
  neutral: "bg-ink-950/8 text-ink-950",
  positive: "bg-healthy-tint text-healthy",
  warning: "bg-watch-tint text-watch",
  negative: "bg-flagged-tint text-flagged",
};

export function StatusChip({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {label}
    </span>
  );
}

export function bidStatusTone(status: string): Tone {
  switch (status) {
    case "won":
      return "positive";
    case "lost":
      return "negative";
    case "under_review":
      return "warning";
    default:
      return "neutral";
  }
}

export function paymentStatusTone(status: string): Tone {
  switch (status) {
    case "released":
      return "positive";
    case "frozen":
      return "negative";
    default:
      return "neutral";
  }
}

export function tenderStatusTone(status: string): Tone {
  switch (status) {
    case "open":
      return "positive";
    case "awarded":
      return "neutral";
    default:
      return "neutral";
  }
}

export function grievanceStatusTone(status: string): Tone {
  switch (status) {
    case "resolved":
      return "positive";
    case "rejected":
      return "negative";
    default:
      return "warning";
  }
}

export function statusLabel(status: string): string {
  return status
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
