"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { RiskTier } from "@/lib/enums";

export type CollusionNode = { id: string; name: string; connectionCount: number };
export type CollusionEdgeView = { id: string; source: string; target: string; label: string };

// design.md §8 — collusion graph nodes sized/colored by connection count
// using the risk triad; the one place risk color legitimately drives a
// data-viz encoding rather than just a badge.
function tierForConnections(count: number): RiskTier {
  if (count >= 2) return "flagged";
  if (count >= 1) return "watch";
  return "healthy";
}
// Exact hex values of the locked healthy/watch/flagged tokens (tailwind.config.ts)
// — SVG fill attributes can't consume Tailwind classes, so these are pinned to
// match the design-system tokens byte-for-byte rather than picked ad hoc.
const FILL: Record<RiskTier, string> = { healthy: "#15803D", watch: "#B45309", flagged: "#B91C1C" };
const RADIUS_BASE = 24;
// Wider step than before (10 -> 15) so a 1-connection node and a 2-connection
// node are unmistakably different sizes at a glance — the previous step made
// the size difference (26px vs 46px radius) too subtle to read as hierarchy.
const RADIUS_STEP = 15;

/**
 * Hand-rolled SVG collusion graph (trd.md — deliberately not a graph
 * library). Nodes are laid out on a circle around a fixed center; simple
 * geometry works fine for the single 3-node/2-edge seeded scenario and
 * degrades gracefully if the scenario ever grows.
 */
export function CollusionGraph({
  nodes,
  edges,
  projectTitle,
}: {
  nodes: CollusionNode[];
  edges: CollusionEdgeView[];
  projectTitle: string;
}) {
  const [selected, setSelected] = useState<string | null>(nodes[0]?.id ?? null);

  const width = 560;
  // A little taller than before to give the now-larger, higher-hierarchy
  // nodes (and their name labels) breathing room without clipping.
  const height = 380;
  const cx = width / 2;
  const cy = height / 2;
  const layoutRadius = 120;

  const positions = new Map<string, { x: number; y: number }>();
  nodes.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    positions.set(n.id, { x: cx + layoutRadius * Math.cos(angle), y: cy + layoutRadius * Math.sin(angle) });
  });

  const selectedNode = nodes.find((n) => n.id === selected) ?? null;
  const selectedEdges = selectedNode ? edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id) : [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 w-full overflow-x-auto rounded-lg border border-ink-950/10 bg-paper-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[420px]"
          role="img"
          aria-label={`Collusion graph for ${projectTitle}`}
        >
          {edges.map((e) => {
            const s = positions.get(e.source);
            const t = positions.get(e.target);
            if (!s || !t) return null;
            const mx = (s.x + t.x) / 2;
            const my = (s.y + t.y) / 2;
            // Size the label pill to the text instead of a fixed box — at the
            // old fixed 116px width, longer labels like "shared registered
            // phone number" overflowed their own background and became
            // unreadable. ~6px/char at this font size keeps it comfortably fit.
            const boxWidth = Math.max(90, e.label.length * 6 + 20);
            return (
              <g key={e.id}>
                <line x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="#B91C1C" strokeWidth={2} strokeDasharray="4 3" opacity={0.6} />
                <rect x={mx - boxWidth / 2} y={my - 11} width={boxWidth} height={22} rx={11} fill="#FBF8F2" stroke="#14142B1A" />
                <text x={mx} y={my + 4} textAnchor="middle" fontSize={10.5} fontWeight={500} fill="#14142B99" fontFamily="var(--font-nunito)">
                  {e.label}
                </text>
              </g>
            );
          })}
          {nodes.map((n) => {
            const p = positions.get(n.id)!;
            const tier = tierForConnections(n.connectionCount);
            const r = RADIUS_BASE + n.connectionCount * RADIUS_STEP;
            const isSelected = n.id === selected;
            return (
              <g
                key={n.id}
                transform={`translate(${p.x}, ${p.y})`}
                onClick={() => setSelected(n.id)}
                className="cursor-pointer"
              >
                <circle
                  r={r}
                  fill={FILL[tier]}
                  opacity={isSelected ? 1 : 0.85}
                  stroke={isSelected ? "#14142B" : "#FBF8F2"}
                  strokeWidth={isSelected ? 3 : 2}
                />
                <text textAnchor="middle" y={4} fontSize={11} fontWeight={600} fill="white" fontFamily="var(--font-nunito)">
                  {initials(n.name)}
                </text>
                <text textAnchor="middle" y={r + 16} fontSize={11} fill="#26317A" fontFamily="var(--font-nunito)">
                  {n.name.length > 22 ? `${n.name.slice(0, 22)}…` : n.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-950/50">
          Bidder Detail
        </p>
        {selectedNode ? (
          <>
            <p className="mt-2 text-sm font-semibold text-ink-950">{selectedNode.name}</p>
            <div className="mt-1.5">
              <Badge tier={tierForConnections(selectedNode.connectionCount)}>
                <span className="font-mono tabular-nums">{selectedNode.connectionCount}</span> connection
                {selectedNode.connectionCount === 1 ? "" : "s"}
              </Badge>
            </div>
            <p className="mt-3 text-sm text-ink-950/70">
              Linked to {selectedNode.connectionCount} other bidder{selectedNode.connectionCount === 1 ? "" : "s"} on{" "}
              <span className="font-medium text-ink-950">{projectTitle}</span>.
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {selectedEdges.map((e) => {
                const otherId = e.source === selectedNode.id ? e.target : e.source;
                const other = nodes.find((n) => n.id === otherId);
                if (!other) return null;
                // Plain sentence rather than a "Name — field" data-dump row,
                // so a non-technical reader can follow it without decoding
                // the dash-separated shorthand.
                const detail = e.label.replace(/^shared\s+/i, "");
                return (
                  <li
                    key={e.id}
                    className="rounded-lg bg-ink-950/5 px-3 py-2 text-xs text-ink-950/70"
                  >
                    Shares a {detail} with <span className="font-medium text-ink-950">{other.name}</span>.
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p className="mt-2 text-sm text-ink-950/40">Click a node to see its connections.</p>
        )}
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}
