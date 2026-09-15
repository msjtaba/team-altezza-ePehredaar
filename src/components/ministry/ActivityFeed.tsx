export type ActivityItem = {
  id: string;
  kind: "alert_action" | "payment" | "project_created";
  text: string;
  timestamp: string; // ISO string, already sorted desc by caller
};

const KIND_DOT: Record<ActivityItem["kind"], string> = {
  alert_action: "bg-watch",
  payment: "bg-healthy",
  project_created: "bg-navy-500",
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} mo. ago`;
}

// design.md §6.1 — Ministry dashboard is a high-frequency surface: no
// entrance animation, instant render, low visual emphasis (small type,
// muted color) since this is a background-awareness feed, not a headline.
export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-navy-950">Recent National Activity</h3>
      <p className="mt-1 text-xs text-slate-500">
        Real — merged from recent DM alert decisions, payments, and newly sanctioned projects.
      </p>
      <ul className="mt-3 max-h-80 divide-y divide-slate-100 overflow-y-auto">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-2.5 py-2">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${KIND_DOT[item.kind]}`} />
            <div className="min-w-0">
              <p className="text-xs leading-snug text-slate-600">{item.text}</p>
              <p className="mt-0.5 font-mono tabular-nums text-[11px] text-slate-400">
                {timeAgo(item.timestamp)}
              </p>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className="py-3 text-sm text-slate-400">No recent activity.</li>}
      </ul>
    </div>
  );
}
