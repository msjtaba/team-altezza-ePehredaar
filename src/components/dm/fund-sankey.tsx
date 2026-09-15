"use client";

import { ResponsiveSankey } from "@nivo/sankey";

// design.md §8 — Sankey nodes colored by entity type (Ministry/State/
// District/Contractor) using the navy scale by depth, never risk colors.
const NODE_COLORS: Record<string, string> = {
  Ministry: "#0A1930",
  State: "#1E3A5F",
  District: "#3E5C82",
};
const CONTRACTOR_COLOR = "#8CA3BE";

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
        labelTextColor="#1E3A5F"
        theme={{
          labels: { text: { fontFamily: "var(--font-inter)", fontSize: 12 } },
          tooltip: { container: { fontFamily: "var(--font-inter)", fontSize: 12 } },
        }}
        animate={false}
      />
    </div>
  );
}
