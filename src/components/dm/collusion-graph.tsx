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
const FILL: Record<RiskTier, string> = { healthy: "#15803D", watch: "#B45309", flagged: "#B91C1C" };
const RADIUS_BASE = 26;
const RADIUS_STEP = 10;

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
  const height = 360;
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
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="lg:col-span-2 w-full rounded-md bg-slate-50"
        role="img"
        aria-label={`Collusion graph for ${projectTitle}`}
      >
        {edges.map((e) => {
          const s = positions.get(e.source);
          const t = positions.get(e.target);
          if (!s || !t) return null;
          const mx = (s.x + t.x) / 2;
          const my = (s.y + t.y) / 2;
          return (
            <g key={e.id}>
              <line x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="#B91C1C" strokeWidth={2} strokeDasharray="4 3" opacity={0.6} />
              <rect x={mx - 58} y={my - 10} width={116} height={20} rx={10} fill="white" stroke="#E2E8F0" />
              <text x={mx} y={my + 4} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="var(--font-inter)">
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
                stroke={isSelected ? "#0A1930" : "white"}
                strokeWidth={isSelected ? 3 : 2}
              />
              <text textAnchor="middle" y={4} fontSize={11} fontWeight={600} fill="white" fontFamily="var(--font-inter)">
                {initials(n.name)}
              </text>
              <text textAnchor="middle" y={r + 16} fontSize={11} fill="#1E3A5F" fontFamily="var(--font-inter)">
                {n.name.length > 22 ? `${n.name.slice(0, 22)}…` : n.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Node Detail</p>
        {selectedNode ? (
          <>
            <p className="mt-2 text-sm font-semibold text-navy-950">{selectedNode.name}</p>
            <div className="mt-1.5">
              <Badge tier={tierForConnections(selectedNode.connectionCount)}>
                <span className="font-mono tabular-nums">{selectedNode.connectionCount}</span> connection
                {selectedNode.connectionCount === 1 ? "" : "s"}
              </Badge>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Linked to {selectedNode.connectionCount} other bidder{selectedNode.connectionCount === 1 ? "" : "s"} on{" "}
              <span className="font-medium text-navy-950">{projectTitle}</span>.
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {selectedEdges.map((e) => {
                const otherId = e.source === selectedNode.id ? e.target : e.source;
                const other = nodes.find((n) => n.id === otherId);
                return (
                  <li key={e.id} className="rounded-md bg-white px-3 py-2 text-xs text-slate-600">
                    <span className="font-medium text-navy-950">{other?.name}</span> — {e.label}
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-400">Click a node to see its connections.</p>
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
