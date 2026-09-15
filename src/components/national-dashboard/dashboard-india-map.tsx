"use client";

import { useEffect, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/national-dashboard/dashboard-card";
import type { RiskTier } from "@/lib/enums";

export type StateStat = {
  state: string;
  mpAllocatedTotal: number;
  mpCount: number;
  hasProjectData: boolean;
  projectSanctioned: number;
  projectBilled: number;
  utilizationPct: number | null;
  alertCount: number;
  maxRiskScore: number | null;
  riskTier: RiskTier | null;
};

/**
 * Persuade-mode fork of src/components/ministry/IndiaMap.tsx for the
 * National Overview Dashboard (changes-3.md §1 + §3). /ministry keeps
 * importing the original file unchanged — this copy exists so the
 * choropleth can be re-themed (teal utilization scale instead of navy,
 * paper/ink card chrome) without touching the authenticated Ministry
 * Overview page.
 *
 * The one functional addition beyond the re-theme: a floating hover
 * tooltip (changes-3.md §3's "most important piece") that follows the
 * cursor and shows state name + all four requested fields (allocated
 * amount, MP count, utilization %, risk level) independent of the
 * click-to-drill-down interaction, which still updates the panel on the
 * right exactly as before.
 */
const GEO_URL =
  "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson";

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\bthe\b/g, "")
    .replace(/[^a-z]/g, "");
}

const ALIASES: Record<string, string> = {
  orissa: "odisha",
  nctofdelhi: "delhi",
  pondicherry: "puducherry",
  andamanandnicobar: "andamanandnicobarislands",
  dadraandnagarhaveli: "dadraandnagarhaveliandamandiu",
  damananddiu: "dadraandnagarhaveliandamandiu",
};

function keyFor(name: string): string {
  const n = normalize(name);
  return ALIASES[n] ?? n;
}

// Teal-tinted utilization scale (design.md §3.0 — teal = secondary/
// alternating accent). Built with opacity modifiers on the single
// `teal-700` token defined in tailwind.config.ts, rather than inventing new
// palette entries, per the Persuade "one accent per job" discipline.
const UTILIZATION_STEPS = [
  { min: 0, className: "fill-teal-700/10" },
  { min: 20, className: "fill-teal-700/30" },
  { min: 45, className: "fill-teal-700/55" },
  { min: 70, className: "fill-teal-700/80" },
  { min: 90, className: "fill-teal-700" },
];

function utilizationFill(pct: number | null): string {
  if (pct === null) return "fill-ink-950/5";
  let cls = UTILIZATION_STEPS[0].className;
  for (const step of UTILIZATION_STEPS) {
    if (pct >= step.min) cls = step.className;
  }
  return cls;
}

function formatCr(amountInRupees: number): string {
  const cr = amountInRupees / 1e7;
  return `₹${cr.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
}

// mpAllocatedTotal is already in Crore units (see src/app/page.tsx's
// formatCrDirect comment) — must not be divided by 1e7 again like the
// rupee-denominated project sanctioned/billed fields above.
function formatCrDirect(amountInCrore: number): string {
  return `₹${amountInCrore.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
}

function riskLabel(tier: RiskTier | null): string {
  if (tier === "flagged") return "Flagged";
  if (tier === "watch") return "Watch";
  if (tier === "healthy") return "Healthy";
  return "No alerts on record";
}

// Deterministic fallback so a geography feature that doesn't match any real
// MP/project record still renders shaded and hoverable (changes-4.md §2:
// "fill any state without real data with fake data rather than leaving it
// blank... never an empty or missing tooltip"). Seeded off the state name so
// the same feature always gets the same plausible-looking figures across
// renders/hovers rather than flickering random values.
function seededRand(name: string): () => number {
  let seed = 0;
  for (let i = 0; i < name.length; i++) seed = (seed * 31 + name.charCodeAt(i)) >>> 0;
  return () => {
    seed = (seed * 1103515245 + 12345) >>> 0;
    return seed / 0xffffffff;
  };
}

const FALLBACK_RISK_TIERS: RiskTier[] = ["healthy", "watch", "flagged"];

function fakeStatFor(name: string): StateStat {
  const rand = seededRand(name);
  const mpCount = 1 + Math.floor(rand() * 6);
  const utilizationPct = Math.round(15 + rand() * 75);
  const maxRiskScore = Math.round(20 + rand() * 60);
  return {
    state: name,
    mpAllocatedTotal: Number((8 + rand() * 60).toFixed(2)),
    mpCount,
    hasProjectData: false,
    projectSanctioned: 0,
    projectBilled: 0,
    utilizationPct,
    alertCount: Math.floor(rand() * 3),
    maxRiskScore,
    riskTier: FALLBACK_RISK_TIERS[Math.floor(rand() * FALLBACK_RISK_TIERS.length)],
  };
}

type HoverState = { stat: StateStat; name: string; x: number; y: number };

export function DashboardIndiaMap({ stats }: { stats: StateStat[] }) {
  const [mapFailed, setMapFailed] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [selected, setSelected] = useState<StateStat | null>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const byKey = new Map(stats.map((s) => [keyFor(s.state), s]));

  useEffect(() => {
    let cancelled = false;
    fetch(GEO_URL, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setMapReady(res.ok);
        if (!cancelled && !res.ok) setMapFailed(true);
      })
      .catch(() => {
        if (!cancelled) setMapFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = [...stats].sort(
    (a, b) => (b.utilizationPct ?? -1) - (a.utilizationPct ?? -1) || b.mpAllocatedTotal - a.mpAllocatedTotal
  );

  function updateHover(evt: React.MouseEvent, stat: StateStat, name: string) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({ stat, name, x: evt.clientX - rect.left, y: evt.clientY - rect.top });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Funds Utilization by State</CardTitle>
            <CardDescription>
              Shaded by billed-vs-sanctioned utilization on monitored projects. Hover a state for a
              quick preview, click for full drill-down — grey states have real MP allocation on
              record but no monitored project in this prototype&apos;s seed data.
            </CardDescription>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 text-[11px] text-ink-950/50">
            <span>Low</span>
            <span className="h-2.5 w-4 rounded-md fill-teal-700/10 bg-teal-700/10" />
            <span className="h-2.5 w-4 rounded-md bg-teal-700/30" />
            <span className="h-2.5 w-4 rounded-md bg-teal-700/55" />
            <span className="h-2.5 w-4 rounded-md bg-teal-700/80" />
            <span className="h-2.5 w-4 rounded-md bg-teal-700" />
            <span>High</span>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={containerRef} className="relative">
            {!mapFailed ? (
              <div className="mt-3 aspect-[4/3] w-full">
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{ scale: 950, center: [82.8, 22.5] }}
                  width={500}
                  height={480}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Geographies geography={GEO_URL} onError={() => setMapFailed(true)}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        // Source geojson exposes the state name as `ST_NM`
                        // (uppercase) — the previous fallback chain only
                        // checked `st_nm`/`NAME_1`/`name`, so `name` was
                        // always "", every lookup missed, and every state
                        // rendered unshaded with no click/hover handler at
                        // all (changes-4.md §2's "no shading, no hover").
                        const name: string =
                          geo.properties?.ST_NM ??
                          geo.properties?.st_nm ??
                          geo.properties?.NAME_1 ??
                          geo.properties?.name ??
                          "";
                        const stat = name ? byKey.get(keyFor(name)) ?? fakeStatFor(name) : undefined;
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() => stat && setSelected(stat)}
                            onMouseEnter={(evt) => stat && updateHover(evt, stat, name)}
                            onMouseMove={(evt) => stat && updateHover(evt, stat, name)}
                            onMouseLeave={() => setHover(null)}
                            tabIndex={stat ? 0 : -1}
                            role={stat ? "button" : undefined}
                            aria-label={stat ? `${name}: view detail` : undefined}
                            className={`${utilizationFill(stat?.utilizationPct ?? null)} stroke-paper [stroke-width:0.75] outline-none transition-colors duration-150 hover:fill-marigold-600 focus-visible:fill-marigold-600 ${
                              stat ? "cursor-pointer" : "cursor-default"
                            }`}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ComposableMap>
              </div>
            ) : (
              <p className="mt-4 rounded-md bg-paper p-3 text-xs text-ink-950/50">
                Map tiles unavailable in this environment — use the state table for drill-down
                instead.
              </p>
            )}
            {!mapReady && !mapFailed && (
              <p className="mt-2 text-xs text-ink-950/40">Loading map…</p>
            )}

            {/* Floating hover tooltip — changes-3.md §3's "most important
                piece": name + all four fields, positioned near the
                cursor, independent of the click-driven drill-down below. */}
            {hover && (
              <div
                className="pointer-events-none absolute z-10 w-52 rounded-lg border border-ink-950/10 bg-paper p-3 text-xs shadow-lg shadow-ink-950/10"
                style={{
                  left: Math.min(hover.x + 14, Math.max(0, (containerRef.current?.clientWidth ?? 400) - 220)),
                  top: Math.max(0, hover.y - 8),
                }}
              >
                <p className="font-display text-sm tracking-wide text-ink-950">{hover.name}</p>
                <dl className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-1">
                  <dt className="text-ink-950/50">Allocated</dt>
                  <dd className="text-right font-mono tabular-nums text-ink-950/80">
                    {formatCrDirect(hover.stat.mpAllocatedTotal)}
                  </dd>
                  <dt className="text-ink-950/50">MPs</dt>
                  <dd className="text-right font-mono tabular-nums text-ink-950/80">
                    {hover.stat.mpCount}
                  </dd>
                  <dt className="text-ink-950/50">Utilization</dt>
                  <dd className="text-right font-mono tabular-nums text-ink-950/80">
                    {hover.stat.utilizationPct !== null ? `${hover.stat.utilizationPct.toFixed(0)}%` : "—"}
                  </dd>
                  <dt className="text-ink-950/50">Risk</dt>
                  <dd className="text-right text-ink-950/80">{riskLabel(hover.stat.riskTier)}</dd>
                </dl>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>State Drill-Down</CardTitle>
          <CardDescription>
            {selected ? "Selected state detail:" : "Click a state on the map, or a row below."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selected && (
            <div className="mt-1 rounded-md border border-teal-700/20 bg-teal-100/40 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink-950">{selected.state}</p>
                {selected.riskTier && <Badge tier={selected.riskTier}>{selected.maxRiskScore}%</Badge>}
              </div>
              <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <dt className="text-ink-950/50">Real MP allocation</dt>
                <dd className="text-right font-mono tabular-nums text-ink-950/80">
                  {formatCrDirect(selected.mpAllocatedTotal)}
                </dd>
                <dt className="text-ink-950/50">MPs</dt>
                <dd className="text-right font-mono tabular-nums text-ink-950/80">{selected.mpCount}</dd>
                <dt className="text-ink-950/50">Sanctioned (monitored)</dt>
                <dd className="text-right font-mono tabular-nums text-ink-950/80">
                  {selected.hasProjectData ? formatCr(selected.projectSanctioned) : "—"}
                </dd>
                <dt className="text-ink-950/50">Utilized (monitored)</dt>
                <dd className="text-right font-mono tabular-nums text-ink-950/80">
                  {selected.hasProjectData ? formatCr(selected.projectBilled) : "—"}
                </dd>
                <dt className="text-ink-950/50">Alerts</dt>
                <dd className="text-right font-mono tabular-nums text-ink-950/80">{selected.alertCount}</dd>
              </dl>
            </div>
          )}

          <div className="mt-3 max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink-950/10 text-ink-950/50">
                  <th className="py-1.5 font-medium">State</th>
                  <th className="py-1.5 text-right font-medium">MP Alloc.</th>
                  <th className="py-1.5 text-right font-medium">Util. %</th>
                  <th className="py-1.5 text-right font-medium">Alerts</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => (
                  <tr
                    key={s.state}
                    onClick={() => setSelected(s)}
                    className={`cursor-pointer border-b border-ink-950/5 hover:bg-teal-100/40 ${
                      selected?.state === s.state ? "bg-teal-100/40" : ""
                    }`}
                  >
                    <td className="py-1.5 text-ink-950/80">{s.state}</td>
                    <td className="py-1.5 text-right font-mono tabular-nums text-ink-950/60">
                      {formatCrDirect(s.mpAllocatedTotal)}
                    </td>
                    <td className="py-1.5 text-right font-mono tabular-nums text-ink-950/60">
                      {s.utilizationPct !== null ? `${s.utilizationPct.toFixed(0)}%` : "—"}
                    </td>
                    <td className="py-1.5 text-right font-mono tabular-nums text-ink-950/60">
                      {s.alertCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
