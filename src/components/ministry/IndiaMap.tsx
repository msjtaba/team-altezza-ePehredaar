"use client";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Badge } from "@/components/ui/badge";
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

// Public India state-boundary GeoJSON (states + UTs). Fetched at runtime
// rather than bundled — see report for why (no topojson shipped in repo).
// If it fails to load (offline env, CDN hiccup), we fall back to the
// sortable table below, which is always rendered as the authoritative,
// accessible drill-down index regardless of map success.
const GEO_URL =
  "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson";

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z]/g, "");
}

// A few known name mismatches between the public geojson and our MP data's
// state spellings.
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

const UTILIZATION_STEPS = [
  { min: 0, className: "fill-navy-100" },
  { min: 20, className: "fill-navy-300" },
  { min: 45, className: "fill-navy-500" },
  { min: 70, className: "fill-navy-700" },
  { min: 90, className: "fill-navy-900" },
];

function utilizationFill(pct: number | null): string {
  if (pct === null) return "fill-slate-100";
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

export function IndiaMap({ stats }: { stats: StateStat[] }) {
  const [mapFailed, setMapFailed] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [selected, setSelected] = useState<StateStat | null>(null);
  const byKey = new Map(stats.map((s) => [keyFor(s.state), s]));

  useEffect(() => {
    // react-simple-maps loads the geoUrl itself; we just probe reachability
    // once up front so we can show an honest fallback instead of a blank map.
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

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-navy-950">
            Fund Utilization by State
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span>Low</span>
            <span className="h-2.5 w-4 rounded-md bg-navy-100" />
            <span className="h-2.5 w-4 rounded-md bg-navy-300" />
            <span className="h-2.5 w-4 rounded-md bg-navy-500" />
            <span className="h-2.5 w-4 rounded-md bg-navy-700" />
            <span className="h-2.5 w-4 rounded-md bg-navy-900" />
            <span>High</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Shaded by billed-vs-sanctioned utilization on monitored projects. Click a state for
          detail — grey states have real MP allocation on record but no monitored project in
          this prototype&apos;s seed data.
        </p>

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
                    const name: string =
                      geo.properties?.st_nm ?? geo.properties?.NAME_1 ?? geo.properties?.name ?? "";
                    const stat = byKey.get(keyFor(name));
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => stat && setSelected(stat)}
                        tabIndex={stat ? 0 : -1}
                        role={stat ? "button" : undefined}
                        aria-label={stat ? `${name}: view detail` : undefined}
                        className={`${utilizationFill(stat?.utilizationPct ?? null)} stroke-white [stroke-width:0.75] outline-none transition-colors duration-150 hover:fill-navy-950 focus-visible:fill-navy-950 ${
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
          <p className="mt-4 rounded-md bg-slate-50 p-3 text-xs text-slate-500">
            Map tiles unavailable in this environment — use the state table for drill-down
            instead.
          </p>
        )}
        {!mapReady && !mapFailed && (
          <p className="mt-2 text-xs text-slate-400">Loading map…</p>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-navy-950">State Drill-Down</h3>
        <p className="mt-1 text-xs text-slate-500">
          {selected ? "Selected state detail:" : "Select a state on the map, or a row below."}
        </p>

        {selected && (
          <div className="mt-3 rounded-md border border-navy-100 bg-navy-50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-navy-950">{selected.state}</p>
              {selected.riskTier && <Badge tier={selected.riskTier}>{selected.maxRiskScore}%</Badge>}
            </div>
            <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
              <dt className="text-slate-500">Real MP allocation</dt>
              <dd className="text-right font-mono tabular-nums text-slate-800">
                {formatCr(selected.mpAllocatedTotal)}
              </dd>
              <dt className="text-slate-500">Sanctioned (monitored)</dt>
              <dd className="text-right font-mono tabular-nums text-slate-800">
                {selected.hasProjectData ? formatCr(selected.projectSanctioned) : "—"}
              </dd>
              <dt className="text-slate-500">Utilized (monitored)</dt>
              <dd className="text-right font-mono tabular-nums text-slate-800">
                {selected.hasProjectData ? formatCr(selected.projectBilled) : "—"}
              </dd>
              <dt className="text-slate-500">Alerts</dt>
              <dd className="text-right font-mono tabular-nums text-slate-800">
                {selected.alertCount}
              </dd>
            </dl>
          </div>
        )}

        <div className="mt-3 max-h-72 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
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
                  className={`cursor-pointer border-b border-slate-100 hover:bg-navy-50 ${
                    selected?.state === s.state ? "bg-navy-50" : ""
                  }`}
                >
                  <td className="py-1.5 text-slate-800">{s.state}</td>
                  <td className="py-1.5 text-right font-mono tabular-nums text-slate-600">
                    {formatCr(s.mpAllocatedTotal)}
                  </td>
                  <td className="py-1.5 text-right font-mono tabular-nums text-slate-600">
                    {s.utilizationPct !== null ? `${s.utilizationPct.toFixed(0)}%` : "—"}
                  </td>
                  <td className="py-1.5 text-right font-mono tabular-nums text-slate-600">
                    {s.alertCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
