import { prisma } from "@/lib/prisma";
import { PersuadeNav } from "@/components/site/persuade-nav";
import { SiteFooter } from "@/components/site/site-footer";
import {
  CartelGraph,
  type CartelNode,
  type CartelEdge,
  type CartelCluster,
} from "@/components/cartel/cartel-graph";

/**
 * Cartel & Collusion Surveillance (changes-3.md §6/§6.1) — a new, bigger,
 * standalone public page, separate from the DM-only single-project
 * scenario at /dm/audit/collusion/[id]. Fixed/hardcoded demo scenario
 * (trd.md §2 "Collusion graph" row: no real graph-clustering algorithm,
 * "Louvain Community Detection" in the graph footer is copy-only flavor).
 *
 * Two real sample contractor names are reused for narrative continuity
 * (changes.md §9.1's verified/unverified demo accounts) — their real
 * Contractor row ids are looked up here so the sidebar's "Vendor Profile"
 * link can point at the real /contractors/[id] page for those two nodes.
 * Everyone else in the scenario (Charminar Civil Works, Musi Valley
 * Constructions, Ranga Reddy Roadways, the director/asset nodes) is an
 * invented shell entity with no DB row — their "Vendor Profile" button is
 * disabled rather than linking to a fake id.
 */
export default async function CartelPage() {
  const [sriBalaji, deccan] = await Promise.all([
    prisma.contractor.findFirst({ where: { companyName: "Sri Balaji Infra Projects" }, select: { id: true } }),
    prisma.contractor.findFirst({ where: { companyName: "Deccan Builders & Co." }, select: { id: true } }),
  ]);

  const nodes: CartelNode[] = [
    // Cluster A — "Hyderabad Ring" vendors
    {
      id: "v1",
      name: "Sri Balaji Infra Projects",
      type: "vendor",
      x: 150,
      y: 150,
      trustScore: 41,
      gstin: "36AAKCS4321L1Z8",
      contractorId: sriBalaji?.id ?? null,
    },
    {
      id: "v2",
      name: "Deccan Builders & Co.",
      type: "vendor",
      x: 150,
      y: 330,
      trustScore: 24,
      gstin: "36AABCD9987M1ZR",
      contractorId: deccan?.id ?? null,
    },
    {
      id: "v3",
      name: "Charminar Civil Works",
      type: "vendor",
      x: 320,
      y: 240,
      trustScore: 18,
      gstin: "36AAFCC1123N1Z4",
      contractorId: null,
    },
    // Cluster A — director / asset nodes
    { id: "d1", name: "Rajendra K. Reddy (MD)", type: "director", x: 250, y: 90 },
    { id: "a1", name: "22 Abids Circle, Hyderabad", type: "asset", x: 260, y: 380, detail: "Registered address match" },
    { id: "a2", name: "PDF Fingerprint 8F3AC9", type: "asset", x: 90, y: 240, detail: "Tender document metadata match" },

    // Cluster B — "Chevella Ring" vendors
    {
      id: "v4",
      name: "Musi Valley Constructions",
      type: "vendor",
      x: 650,
      y: 170,
      trustScore: 28,
      gstin: "36AACFM5567P1Z9",
      contractorId: null,
    },
    {
      id: "v5",
      name: "Ranga Reddy Roadways",
      type: "vendor",
      x: 650,
      y: 350,
      trustScore: 22,
      gstin: "36AADFR7789Q1Z2",
      contractorId: null,
    },
    // Cluster B — director / asset nodes
    { id: "d2", name: "Farha Sultana (Signatory)", type: "director", x: 780, y: 260 },
    { id: "a3", name: "HDFC A/C 50100234XXXX", type: "asset", x: 550, y: 90, detail: "Shared bank account credentials" },
    { id: "a4", name: "+91 98400 55231", type: "asset", x: 550, y: 430, detail: "Shared registered phone number" },

    // Cross-cluster infrastructure link — ties both rings together, giving
    // the subtitle's "indirect infrastructure connections" a concrete edge.
    { id: "a5", name: "IP 103.21.58.14", type: "asset", x: 460, y: 240, detail: "Shared outbound IP address" },
  ];

  const edges: CartelEdge[] = [
    { id: "e1", source: "v1", target: "d1", label: "Common Managing Director", layer: "shared-directors", flagged: true },
    { id: "e2", source: "v2", target: "d1", label: "Common Managing Director", layer: "shared-directors", flagged: true },
    { id: "e3", source: "v3", target: "d1", label: "Common Managing Director", layer: "shared-directors", flagged: true },
    { id: "e4", source: "v2", target: "a1", label: "Identical Registered Address", layer: "address-overlaps", flagged: true },
    { id: "e5", source: "v3", target: "a1", label: "Identical Registered Address", layer: "address-overlaps", flagged: true },
    { id: "e6", source: "v1", target: "a2", label: "Matching Tender PDF Fingerprint", layer: "pdf-metadata", flagged: true },
    { id: "e7", source: "v3", target: "a2", label: "Matching Tender PDF Fingerprint", layer: "pdf-metadata", flagged: true },

    { id: "e8", source: "v4", target: "d2", label: "Shared Signatory Director", layer: "shared-directors", flagged: true },
    { id: "e9", source: "v5", target: "d2", label: "Shared Signatory Director", layer: "shared-directors", flagged: true },
    { id: "e10", source: "v4", target: "a3", label: "Same Bank Account Credentials", layer: "bank-channels", flagged: true },
    { id: "e11", source: "v5", target: "a3", label: "Same Bank Account Credentials", layer: "bank-channels", flagged: true },
    { id: "e12", source: "v4", target: "a4", label: "Shared Registered Phone Number", layer: "bank-channels", flagged: true },
    { id: "e13", source: "v5", target: "a4", label: "Shared Registered Phone Number", layer: "bank-channels", flagged: true },

    { id: "e14", source: "v3", target: "a5", label: "Shared IP Address", layer: "ip-clusters", flagged: true },
    { id: "e15", source: "v5", target: "a5", label: "Shared IP Address", layer: "ip-clusters", flagged: true },
  ];

  const clusters: CartelCluster[] = [
    {
      id: "cluster-a",
      name: "Cluster A — Hyderabad Ring",
      memberIds: ["v1", "v2", "v3"],
      sharedSignals: [
        "Common Managing Director across all three entities",
        "Identical registered address (Deccan Builders & Co. ↔ Charminar Civil Works)",
        "Matching tender PDF fingerprint (Sri Balaji Infra Projects ↔ Charminar Civil Works)",
      ],
    },
    {
      id: "cluster-b",
      name: "Cluster B — Chevella Ring",
      memberIds: ["v4", "v5"],
      sharedSignals: [
        "Same bank account credentials",
        "Same registered phone number",
        "Shared signatory director",
      ],
    },
  ];

  return (
    <main className="font-body">
      <PersuadeNav />
      <div className="mx-auto max-w-dashboard px-4 py-10 sm:px-6 sm:py-14">
        <CartelGraph nodes={nodes} edges={edges} clusters={clusters} />
      </div>

      <SiteFooter
        disclaimer="This is a fixed demonstration scenario — no live IP/PAN scanning or graph-clustering algorithm runs in this build. Sri Balaji Infra Projects and Deccan Builders & Co. are real sample contractor accounts reused for narrative continuity; every other entity and signal shown is illustrative."
      />
    </main>
  );
}
