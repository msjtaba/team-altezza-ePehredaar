"use client";

import { ResponsiveSankey } from "@nivo/sankey";

// design.md §8 — Sankey nodes colored by entity type (Ministry/State/
// District/Contractor) using the Persuade structure scale by depth (ink →
// indigo), never risk colors. Hex values pinned to the exact Persuade tokens
// (tailwind.config.ts: ink-950, indigo-700, indigo-500, teal-700) since SVG
// fill attributes can't consume Tailwind classes.
const NODE_COLORS: Record<string, string> = {
  Ministry: "#14142B",
  State: "#26317A",
  District: "#3D4AA8",
};
const CONTRACTOR_COLOR = "#0F6B62";

export type SankeyNode = { id: string };
export type SankeyLink = { source: string; target: string; value: number };

export function FundSankey({ nodes, links }: { nodes: SankeyNode[]; links: SankeyLink[] }) {
  return (
    <div style={{ height: 420 }}>
      <ResponsiveSankey
        data={{ nodes, links }}
        margin={{ top: 20, right: 160, bottom: 20, left: 100 }}
        align="justify"
        colors={(n) => NODE_COLORS[n.id as string] ?? CONTRACTOR_COLOR}
        nodeOpacity={1}
        nodeThickness={16}
        nodeSpacing={20}
        nodeBorderWidth={0}
        nodeBorderRadius={2}
        linkOpacity={0.35}
        linkHoverOthersOpacity={0.1}
        linkContract={2}
        enableLinkGradient
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={12}
        labelTextColor="#26317A"
        theme={{
          labels: { text: { fontFamily: "var(--font-nunito)", fontSize: 12 } },
          tooltip: { container: { fontFamily: "var(--font-nunito)", fontSize: 12 } },
        }}
        animate={false}
      />
    </div>
  );
}
