// Real data — data.md §2, "Public Project Examples (Real)". Interaction
// rule (data.md §2, brain.md §4): completed projects open a detail card
// with a payment timeline on click; incomplete projects do not.

export const PROJECTS_REAL = [
  {
    title:
      "Laying of 900mm dia and 600mm dia Np-3 pipe line and CC road restoration from H.No. 17-4-387, Ashoorkhana Hazrat-e-Ameer Muqtar to H.No. 17-4-313 A and bylanes in Matha Kidiki Nala, Yakutpura Assembly Constituency",
    status: "completed",
    sanctionedAmount: 5656600,
    mpName: "Asaduddin Owaisi",
    constituency: "HYDERABAD",
    state: "Telangana",
    category: "drainage",
    workId: null,
    sanctionDate: new Date("2024-06-01"), // not supplied — placeholder, see note below
    payments: [{ amount: 5660000, paidAt: new Date("2025-11-28") }],
  },
  {
    title: "Construction of Bus shelter at Kodaiyanchi Panchayat, Natrampalli Union",
    status: "completed",
    sanctionedAmount: 1097477,
    mpName: "D M Kathir Anand",
    constituency: "VELLORE",
    state: "Tamil Nadu",
    category: "other",
    workId: "200525",
    sanctionDate: new Date("2024-09-01"), // not supplied — placeholder
    payments: [
      { amount: 500000, paidAt: new Date("2026-01-05") },
      { amount: 600000, paidAt: new Date("2026-03-23") },
    ],
  },
  {
    title:
      "Construction of 60 x 120ft roof near Chamundeeshwari Amman Temple at Periyankuppam Panchayat, Madanur Union",
    status: "in_progress",
    sanctionedAmount: 2500000,
    mpName: "D M Kathir Anand",
    constituency: "VELLORE",
    state: "Tamil Nadu",
    category: "community_hall",
    workId: "200526",
    sanctionDate: new Date("2024-11-20"),
    payments: [],
  },
  {
    title:
      "Providing of Bharat Benz 1017 5300WB BS VI, G85 49+1+D 3x2 Bus with Free Flow Rexin by BX with ABS and Speed Limiter ECU, with Insurance for 1 year to Government Nizamia Tibbi College, Charminar, Hyderabad",
    status: "in_progress",
    sanctionedAmount: 4356840,
    mpName: "Asaduddin Owaisi",
    constituency: "HYDERABAD",
    state: "Telangana",
    category: "other",
    workId: null,
    sanctionDate: new Date("2025-02-01"),
    payments: [],
  },
] as const;

// data.md §2's "Incomplete (does not open a detail card)" status maps to the
// product's `in_progress` stage in this seed — the two real incomplete
// examples don't specify which lifecycle stage more precisely, so
// `in_progress` is the closest honest fit (sanctioned + under work, not yet
// tendered/awarded data given). This is a seed-time interpretation, not a
// claim about real-world project status.
//
// Note: data.md doesn't supply exact sanction dates for the two completed
// projects (only their payment dates) — the sanctionDate values above are
// placeholders set earlier than the first payment date, clearly not part of
// the real dataset. Flagged here so a future pass with real sanction dates
// can replace them.
