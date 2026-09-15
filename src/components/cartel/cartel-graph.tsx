"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MagnifyingGlass, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";

/**
 * Cartel & Collusion Surveillance page (changes-3.md §6/§6.1) — a bigger,
 * standalone, public "national" collusion explorer. Deliberately separate
 * from the DM-only single-project scenario in
 * src/app/dm/audit/collusion/[id]/page.tsx + collusion-graph.tsx, which
 * stays untouched. Same "custom hand-rolled SVG, fixed scenario" spirit
 * (trd.md §2 "Collusion graph" row) — no graph library, no real clustering
 * algorithm; coordinates below are fixed/hand-placed, not force-simulated.
 */

export type CartelNodeType = "vendor" | "director" | "asset";

export type CartelNode = {
  id: string;
  name: string;
  type: CartelNodeType;
  x: number;
  y: number;
  trustScore?: number;
  gstin?: string;
  detail?: string;
  /** Real Contractor row id, when this node corresponds to a seeded contractor. */
  contractorId?: string | null;
};

export type CartelLayer =
  | "ip-clusters"
  | "shared-directors"
  | "address-overlaps"
  | "pdf-metadata"
  | "bank-channels";

export type CartelEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
  layer: CartelLayer;
  flagged: boolean;
};

export type CartelCluster = {
  id: string;
  name: string;
  memberIds: string[];
  sharedSignals: string[];
};

const LAYER_META: Record<CartelLayer, { label: string; dot: string }> = {
  "ip-clusters": { label: "IP Clusters", dot: "#7C3AED" },
  "shared-directors": { label: "Shared Directors", dot: "#15803D" },
  "address-overlaps": { label: "Address Overlaps", dot: "#D97706" },
  "pdf-metadata": { label: "PDF Metadata", dot: "#0369A1" },
  "bank-channels": { label: "Bank Channels", dot: "#BE185D" },
};

// Graph-legend colors (vendor/director/asset shape encoding) — a different
// dimension from the risk triad (healthy/watch/flagged) and from the layer
// dots above, so pinned to their own hexes here rather than reusing a
// semantic token. SVG fill/stroke attrs can't consume Tailwind classes.
const TYPE_COLOR: Record<CartelNodeType, string> = {
  vendor: "#2563EB",
  director: "#15803D",
  asset: "#EA580C",
};

// Exact hex of the locked flagged/flagged-tint tokens (tailwind.config.ts) —
// pinned here for the same reason design.md §8 pins them in collusion-graph.tsx.
const FLAGGED = "#B91C1C";
const NEUTRAL_EDGE = "#94A3B8";

export function CartelGraph({
  nodes,
  edges,
  clusters,
}: {
  nodes: CartelNode[];
  edges: CartelEdge[];
  clusters: CartelCluster[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeLayers, setActiveLayers] = useState<Record<CartelLayer, boolean>>({
    "ip-clusters": true,
    "shared-directors": true,
    "address-overlaps": true,
    "pdf-metadata": true,
    "bank-channels": true,
  });
  const [showTimestamps, setShowTimestamps] = useState(false);

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const visibleEdges = edges.filter((e) => activeLayers[e.layer]);
  const selected = selectedId ? nodeById.get(selectedId) ?? null : null;
  const linkedForSelected = selected
    ? edges
        .filter((e) => e.source === selected.id || e.target === selected.id)
        .map((e) => nodeById.get(e.source === selected.id ? e.target : e.source))
        .filter((n): n is CartelNode => Boolean(n))
    : [];

  function selectNode(id: string) {
    setSelectedId(id);
    setShowTimestamps(false);
  }

  function toggleLayer(layer: CartelLayer) {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  }

  function jumpToNode(name: string) {
    const match = nodes.find((n) => n.name.toLowerCase().includes(name.trim().toLowerCase()));
    if (match) selectNode(match.id);
  }

  const width = 900;
  const height = 540;

  return (
    <div className="flex flex-col gap-6">
      {/* Header row: title/subtitle + search + node dropdown */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-tight text-ink-950 sm:text-3xl">
            Cartel &amp; Collusion Surveillance
          </h1>
          <p className="mt-2 max-w-xl text-sm font-light leading-relaxed text-ink-950/60">
            Network graph mapping indirect infrastructure connections to expose bid rigging and shadow cartels.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <MagnifyingGlass
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-950/40"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") jumpToNode(query);
              }}
              placeholder="Jump to node..."
              className="w-full rounded-md border border-ink-950/15 bg-paper py-2 pl-8 pr-3 text-sm text-ink-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold-600 sm:w-52"
              aria-label="Jump to node by name"
            />
          </div>
          <select
            className="rounded-md border border-ink-950/15 bg-paper px-3 py-2 text-sm text-ink-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold-600"
            value=""
            onChange={(e) => {
              if (e.target.value) selectNode(e.target.value);
            }}
            aria-label="Jump to a network node"
          >
            <option value="">All Network Nodes</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Collusion Layers row */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-sm font-semibold text-ink-950/70">Collusion Layers:</span>
        {(Object.keys(LAYER_META) as CartelLayer[]).map((layer) => {
          const active = activeLayers[layer];
          return (
            <button
              key={layer}
              type="button"
              onClick={() => toggleLayer(layer)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-ink-950/20 bg-paper-2 text-ink-950"
                  : "border-ink-950/10 bg-transparent text-ink-950/35"
              )}
              aria-pressed={active}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: LAYER_META[layer].dot, opacity: active ? 1 : 0.35 }}
              />
              {LAYER_META[layer].label}
            </button>
          );
        })}
      </div>

      {/* Two-column: graph panel + right sidebar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main graph panel */}
        <div className="flex flex-col rounded-lg border border-ink-950/10 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-950/10 px-5 py-3">
            <p className="text-sm font-semibold text-ink-950/70">
              {nodes.length} Entities &middot; {edges.length} Inter-Links
            </p>
            <div className="flex items-center gap-4 text-xs font-medium text-ink-950/60">
              <span className="inline-flex items-center gap-1.5">
                <svg width="12" height="12" aria-hidden="true">
                  <circle cx="6" cy="6" r="5" fill={TYPE_COLOR.vendor} />
                </svg>
                Vendor
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg width="12" height="12" aria-hidden="true">
                  <rect x="1" y="1" width="10" height="10" fill={TYPE_COLOR.director} />
                </svg>
                Director
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg width="12" height="12" aria-hidden="true">
                  <polygon points="6,0 12,11 0,11" fill={TYPE_COLOR.asset} />
                </svg>
                Asset
              </span>
            </div>
          </div>

          <div className="overflow-x-auto p-2">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[640px]" role="img" aria-label="Cartel collusion network graph">
              {visibleEdges.map((e) => {
                const s = nodeById.get(e.source);
                const t = nodeById.get(e.target);
                if (!s || !t) return null;
                const mx = (s.x + t.x) / 2;
                const my = (s.y + t.y) / 2;
                const stroke = e.flagged ? FLAGGED : NEUTRAL_EDGE;
                const boxWidth = Math.max(84, e.label.length * 5.6 + 18);
                return (
                  <g key={e.id}>
                    <line x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke={stroke} strokeWidth={1.75} strokeDasharray={e.flagged ? "5 3" : undefined} opacity={0.75} />
                    <rect x={mx - boxWidth / 2} y={my - 10} width={boxWidth} height={20} rx={10} fill="white" stroke="#E2E2D8" />
                    <text x={mx} y={my + 4} textAnchor="middle" fontSize={9.5} fontWeight={500} fill="#3F3F52">
                      {e.label}
                    </text>
                  </g>
                );
              })}

              {nodes.map((n) => {
                const isSelected = n.id === selectedId;
                const color = TYPE_COLOR[n.type];
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x}, ${n.y})`}
                    onClick={() => selectNode(n.id)}
                    className="cursor-pointer"
                  >
                    {isSelected && (
                      <circle r={26} fill="none" stroke="#0A1930" strokeWidth={1.5} strokeDasharray="4 3" />
                    )}
                    {n.type === "vendor" && <circle r={18} fill={color} stroke="white" strokeWidth={2} />}
                    {n.type === "director" && (
                      <rect x={-15} y={-15} width={30} height={30} fill={color} stroke="white" strokeWidth={2} />
                    )}
                    {n.type === "asset" && (
                      <polygon points="0,-19 18,15 -18,15" fill={color} stroke="white" strokeWidth={2} />
                    )}
                    <text
                      textAnchor="middle"
                      y={n.type === "asset" ? 32 : 34}
                      fontSize={10.5}
                      fontWeight={600}
                      fill="#14142B"
                    >
                      {n.name.length > 20 ? `${n.name.slice(0, 20)}…` : n.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink-950/10 px-5 py-3">
            <p className="text-xs text-ink-950/50">Click any node to inspect collusion footprint</p>
            <p className="text-xs text-ink-950/35">Louvain Community Detection</p>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-flagged/30 bg-flagged-tint p-4">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-flagged">
              <WarningCircle size={15} weight="fill" />
              Cartel Clusters Detected
            </p>
            <ul className="mt-3 flex flex-col gap-3">
              {clusters.map((c) => (
                <li key={c.id} className="rounded-md border border-flagged/20 bg-white/60 p-3">
                  <p className="text-sm font-semibold text-ink-950">{c.name}</p>
                  <p className="mt-1 text-xs text-ink-950/70">
                    {c.memberIds
                      .map((id) => nodeById.get(id)?.name)
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <ul className="mt-2 flex flex-col gap-1">
                    {c.sharedSignals.map((s) => (
                      <li key={s} className="text-xs text-flagged/90">
                        &bull; {s}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-ink-950/10 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-950/40">Inspected Node</p>
              {selected && (
                <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-[11px] font-medium text-ink-950/60">
                  {selected.type}
                </span>
              )}
            </div>

            {!selected ? (
              <p className="mt-3 text-sm text-ink-950/40">Click a node in the graph to inspect it.</p>
            ) : (
              <>
                <p className="mt-2 text-lg font-bold text-ink-950">
                  {selected.name} <span className="font-normal text-ink-950/40">#{selected.id}</span>
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2 rounded-md border border-ink-950/10 p-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-ink-950/40">
                      {selected.type === "vendor" ? "Trust Score" : selected.type === "director" ? "Risk Score" : "Occurrences"}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-ink-950">
                      {selected.type === "asset" ? `${linkedForSelected.length}` : `${selected.trustScore ?? "—"} / 100`}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-ink-950/40">
                      {selected.type === "vendor" ? "GSTIN" : selected.type === "director" ? "DIN" : "Signal"}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-ink-950" title={selected.gstin ?? selected.detail ?? ""}>
                      {selected.gstin ?? selected.detail ?? "—"}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-ink-950/40">Linked Entities</p>
                <ul className="mt-1.5 flex flex-col gap-1.5">
                  {linkedForSelected.length === 0 ? (
                    <li className="text-xs text-ink-950/40">No linked entities.</li>
                  ) : (
                    linkedForSelected.map((n) => (
                      <li key={n.id} className="flex items-center justify-between rounded-md bg-paper-2 px-2.5 py-1.5 text-xs text-ink-950/80">
                        <span>{n.name}</span>
                        <span className="text-ink-950/40">
                          {n.type} &middot; #{n.id}
                        </span>
                      </li>
                    ))
                  )}
                </ul>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTimestamps((v) => !v)}
                    className="rounded-md border border-ink-950/15 px-3 py-2 text-xs font-semibold text-ink-950 transition-colors hover:border-ink-950/30"
                  >
                    View Timestamps
                  </button>
                  {showTimestamps && (
                    <ul className="rounded-md bg-paper-2 px-3 py-2 text-[11px] text-ink-950/60">
                      <li>First flagged: 03 Aug 2025, 11:14 IST</li>
                      <li>Last signal match: 21 Aug 2025, 09:02 IST</li>
                      <li>Record indexed: 22 Aug 2025, 00:30 IST</li>
                    </ul>
                  )}

                  {selected.type === "vendor" && selected.contractorId ? (
                    <Link
                      href={`/contractors/${selected.contractorId}`}
                      className="rounded-md border border-ink-950/15 px-3 py-2 text-center text-xs font-semibold text-ink-950 transition-colors hover:border-ink-950/30"
                    >
                      Vendor Profile ↗
                    </Link>
                  ) : selected.type === "vendor" ? (
                    <button
                      type="button"
                      disabled
                      title="No public contractor profile exists for this fake shell company in this demo."
                      className="cursor-not-allowed rounded-md border border-ink-950/10 px-3 py-2 text-center text-xs font-semibold text-ink-950/35"
                    >
                      Vendor Profile ↗
                    </button>
                  ) : null}

                  {selected.type === "vendor" && (
                    <button
                      type="button"
                      disabled
                      title="The Parliamentary Works & Audit Dossiers module (prd.md §4.7) has no browsable route yet in this build — placeholder only."
                      className="cursor-not-allowed rounded-md border border-ink-950/10 px-3 py-2 text-center text-xs font-semibold text-ink-950/35"
                    >
                      Inspect Dossier → <span className="font-normal">(coming soon)</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
