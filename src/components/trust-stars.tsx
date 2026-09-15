import { Star } from "@phosphor-icons/react/dist/ssr";

/**
 * Public Trust Score, rendered as stars — never a raw number
 * (design.md §3.4 / prd.md §4.1). trustScore is 0-100 internally;
 * Math.round(score / 20) converts to a 5-star display.
 */
export function TrustStars({ score }: { score: number | null }) {
  if (score === null) {
    return <span className="text-sm text-ink-950/50">Not yet rated</span>;
  }
  const filled = Math.max(0, Math.min(5, Math.round(score / 20)));
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${filled} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={18}
          weight="fill"
          className={i < filled ? "text-marigold-600" : "text-ink-950/20"}
        />
      ))}
    </span>
  );
}
