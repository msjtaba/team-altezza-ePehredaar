/**
 * Idempotent seed script — trd.md §6.
 * Real records (MPs, the 4 project examples) load first with
 * is_real_data: true; every other table is generated to reach the counts
 * prd.md's modules call for, marked is_real_data: false. Safe to re-run:
 * wipes and reseeds every table each time (prototype-scale data, no need
 * for incremental upsert logic).
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { MPS_REAL } from "./data/mps.real";
import { PROJECTS_REAL } from "./data/projects.real";

const prisma = new PrismaClient();

// Fixed districts — real project states get a real-named district; a
// handful of additional states are seeded so the public listing's
// State/District filters have something to filter across.
// Coordinates are each district's approximate town-center lat/lng — added
// post-hoc (tracker.md §8 deviation #5) so Phase 3's Jan-Pramaan geofence
// flow has real project coordinates to test against, not just district
// labels. Individual projects get a small jitter off these centers so they
// don't all land on the exact same point.
const DISTRICTS = [
  { name: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867 },
  { name: "Vellore", state: "Tamil Nadu", lat: 12.9165, lng: 79.1325 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { name: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376 },
  { name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
  { name: "Guwahati", state: "Assam", lat: 26.1445, lng: 91.7362 },
];

const FAKE_CONTRACTORS = [
  { company: "Bharat Infra Developers", kyc: "verified", trust: 82, phone: "9810000001", address: "Plot 4, Industrial Area, Pune" },
  { company: "Shakti Constructions Pvt Ltd", kyc: "verified", trust: 74, phone: "9810000002", address: "12 MG Road, Jaipur" },
  { company: "Nirmaan Engineering Works", kyc: "unverified", trust: null, phone: "9810000003", address: "45 Civil Lines, Lucknow" },
  { company: "Rajdhani Builders & Co", kyc: "verified", trust: 58, phone: "9810000004", address: "Sector 9, Patna" },
  { company: "Ganga Yamuna Contractors", kyc: "verified", trust: 41, phone: "9810000005", address: "9 Ashok Nagar, Bhopal" },
  { company: "Uttarayan Roadworks", kyc: "unverified", trust: null, phone: "9810000006", address: "7 Fancy Bazaar, Guwahati" },
] as const;

const FAKE_PROJECTS = [
  {
    title: "Widening of village approach road, Kondapur to NH junction",
    category: "road",
    state: "Maharashtra",
    district: "Pune",
    sanctioned: 3200000,
    status: "in_progress",
  },
  {
    title: "Construction of additional classroom block, Govt Primary School",
    category: "school",
    state: "Rajasthan",
    district: "Jaipur",
    sanctioned: 1850000,
    status: "awarded",
  },
  {
    title: "Installation of 25kW solar power plant, community health centre",
    category: "solar_plant",
    state: "Uttar Pradesh",
    district: "Lucknow",
    sanctioned: 4100000,
    status: "tendered",
  },
  {
    title: "Storm-water drainage upgrade, Ward 14",
    category: "drainage",
    state: "Bihar",
    district: "Patna",
    sanctioned: 2750000,
    status: "sanctioned",
  },
  {
    title: "Community hall construction, Gram Panchayat Bhavan",
    category: "community_hall",
    state: "Madhya Pradesh",
    district: "Bhopal",
    sanctioned: 3950000,
    status: "completed",
  },
  {
    title: "Repair and resurfacing of internal roads, Ward 6",
    category: "road",
    state: "Assam",
    district: "Guwahati",
    sanctioned: 2200000,
    status: "citizen_verified",
  },
] as const;

const MILESTONE_SEQUENCE = ["sanctioned", "started", "in_process", "completed", "citizen_verified", "paid"] as const;
const STAGE_TO_MILESTONE_INDEX: Record<string, number> = {
  sanctioned: 0,
  tendered: 0,
  awarded: 1,
  in_progress: 2,
  completed: 3,
  citizen_verified: 4,
  payment_released: 5,
};

async function main() {
  console.log("Wiping existing data...");
  // Reverse dependency order.
  await prisma.grievance.deleteMany();
  await prisma.fundFlow.deleteMany();
  await prisma.parkedFund.deleteMany();
  await prisma.collusionEdge.deleteMany();
  await prisma.alertAction.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.auditDossier.deleteMany();
  await prisma.janPramaanConsensus.deleteMany();
  await prisma.janPramaanSubmission.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.tender.deleteMany();
  await prisma.project.deleteMany();
  await prisma.contractor.deleteMany();
  await prisma.user.deleteMany();
  await prisma.mp.deleteMany();
  await prisma.district.deleteMany();

  console.log("Seeding districts...");
  const districtByName = new Map<string, string>();
  const districtCoords = new Map<string, { lat: number; lng: number }>();
  for (const d of DISTRICTS) {
    const row = await prisma.district.create({ data: { name: d.name, state: d.state } });
    districtByName.set(d.name, row.id);
    districtCoords.set(d.name, { lat: d.lat, lng: d.lng });
  }
  // Small deterministic jitter (~50-300m) so projects in the same district
  // don't all share one exact point.
  function jitteredCoords(districtName: string, seed: number) {
    const base = districtCoords.get(districtName)!;
    const dx = (((seed * 9301 + 49297) % 233280) / 233280 - 0.5) * 0.004;
    const dy = (((seed * 4111 + 12345) % 233280) / 233280 - 0.5) * 0.004;
    return { latitude: base.lat + dx, longitude: base.lng + dy };
  }

  console.log(`Seeding ${MPS_REAL.length} real MPs...`);
  const mpByName = new Map<string, string>();
  for (const [srNo, state, name, constituency, amount] of MPS_REAL) {
    const row = await prisma.mp.create({
      data: {
        srNo,
        state,
        name,
        constituency,
        allocatedAmount: amount ?? undefined,
        isRealData: true,
      },
    });
    mpByName.set(name, row.id);
  }

  console.log("Seeding fake contractors...");
  const contractors = [];
  for (const c of FAKE_CONTRACTORS) {
    const user = await prisma.user.create({
      data: {
        name: c.company,
        email: `${c.company.toLowerCase().replace(/[^a-z0-9]+/g, ".")}@example.com`,
        phone: c.phone,
        passwordHash: await bcrypt.hash("password123", 10),
        role: "contractor",
      },
    });
    const contractor = await prisma.contractor.create({
      data: {
        userId: user.id,
        companyName: c.company,
        registrationNumber: `REG-${c.phone.slice(-6)}`,
        gstNumber: c.kyc === "verified" ? `27GST${c.phone.slice(-6)}Z1` : null,
        panNumber: c.kyc === "verified" ? `ABCDE${c.phone.slice(-4)}F` : null,
        phone: c.phone,
        registeredAddress: c.address,
        kycStatus: c.kyc,
        trustScore: c.trust ?? undefined,
        isRealData: false,
      },
    });
    contractors.push(contractor);
  }

  console.log("Seeding demo contractor accounts (changes-1.md §9.1)...");
  // Named demo logins for the Contractor Portal build (changes-1.md §5) —
  // one KYC-verified, one KYC-unverified, so both portal states can be
  // demoed. Kept separate from FAKE_CONTRACTORS above (which use generated
  // @example.com emails) because these need the exact @epehredaar.demo
  // addresses/password the spec calls for.
  const DEMO_CONTRACTORS = [
    { company: "Sri Balaji Infra Projects", email: "contractor.verified@epehredaar.demo", kyc: "verified", trust: 82, phone: "9810000007", address: "18 Banjara Hills Road, Hyderabad" },
    { company: "Deccan Builders & Co.", email: "contractor.unverified@epehredaar.demo", kyc: "unverified", trust: null, phone: "9810000008", address: "22 Abids Circle, Hyderabad" },
  ] as const;
  const demoContractorByCompany = new Map<string, { id: string }>();
  for (const c of DEMO_CONTRACTORS) {
    const user = await prisma.user.create({
      data: {
        name: c.company,
        email: c.email,
        phone: c.phone,
        passwordHash: await bcrypt.hash("Demo@123", 10),
        role: "contractor",
      },
    });
    const contractor = await prisma.contractor.create({
      data: {
        userId: user.id,
        companyName: c.company,
        registrationNumber: `REG-${c.phone.slice(-6)}`,
        gstNumber: c.kyc === "verified" ? `27GST${c.phone.slice(-6)}Z1` : null,
        panNumber: c.kyc === "verified" ? `ABCDE${c.phone.slice(-4)}F` : null,
        phone: c.phone,
        registeredAddress: c.address,
        kycStatus: c.kyc,
        trustScore: c.trust ?? undefined,
        isRealData: false,
      },
    });
    demoContractorByCompany.set(c.company, contractor);
  }

  console.log("Seeding real projects (data.md §2)...");
  const allProjects: { id: string; status: string; isReal: boolean; sanctioned: number }[] = [];
  for (const p of PROJECTS_REAL) {
    const mpId = mpByName.get(p.mpName);
    if (!mpId) throw new Error(`Real project references unknown MP: ${p.mpName}`);
    const districtName = p.constituency === "HYDERABAD" ? "Hyderabad" : "Vellore";
    const districtId = districtByName.get(districtName)!;
    const project = await prisma.project.create({
      data: {
        title: p.title,
        category: p.category,
        mpId,
        districtId,
        sanctionedAmount: p.sanctionedAmount,
        billedAmount: p.payments.reduce((s, x) => s + x.amount, 0),
        sanctionDate: p.sanctionDate,
        status: p.status,
        workId: p.workId ?? undefined,
        isRealData: true,
        ...jitteredCoords(districtName, allProjects.length + 1),
      },
    });
    for (const pay of p.payments) {
      await prisma.payment.create({
        data: { projectId: project.id, amount: pay.amount, paidAt: pay.paidAt, status: "success" },
      });
    }
    allProjects.push({ id: project.id, status: p.status, isReal: true, sanctioned: p.sanctionedAmount });
  }

  console.log("Seeding fake projects (tracker.md decision #2)...");
  // Fake projects need an MP too — reuse the first few real MPs rather than
  // inventing MPs the product would treat as real (is_real_data stays on
  // the project row, which is the honest signal here).
  const fillerMpIds = [...mpByName.values()].slice(0, FAKE_PROJECTS.length);
  for (let i = 0; i < FAKE_PROJECTS.length; i++) {
    const p = FAKE_PROJECTS[i];
    const districtId = districtByName.get(p.district)!;
    const assignedContractorId =
      ["awarded", "in_progress", "completed", "citizen_verified", "payment_released"].includes(p.status)
        ? contractors[i % contractors.length].id
        : null;
    const project = await prisma.project.create({
      data: {
        title: p.title,
        category: p.category,
        mpId: fillerMpIds[i],
        districtId,
        sanctionedAmount: p.sanctioned,
        billedAmount: p.status === "completed" || p.status === "citizen_verified" ? p.sanctioned : 0,
        sanctionDate: new Date(2025, i, 10),
        status: p.status,
        assignedContractorId: assignedContractorId ?? undefined,
        isRealData: false,
        ...jitteredCoords(p.district, i + 1),
      },
    });
    allProjects.push({ id: project.id, status: p.status, isReal: false, sanctioned: p.sanctioned });

    // Milestones up to the project's current stage.
    const upTo = STAGE_TO_MILESTONE_INDEX[p.status] ?? 0;
    for (let m = 0; m <= upTo; m++) {
      await prisma.milestone.create({
        data: {
          projectId: project.id,
          name: MILESTONE_SEQUENCE[m],
          sequenceOrder: m,
          paymentStatus: m === upTo && m >= 3 ? "released" : "pending",
          reachedAt: new Date(2025, i, 10 + m * 20),
        },
      });
    }

    // Open tender + a couple of bids for the one still in "tendered".
    if (p.status === "tendered" || p.status === "awarded") {
      const tender = await prisma.tender.create({
        data: {
          projectId: project.id,
          bidDeadline: new Date(2026, 2, 1),
          status: p.status === "awarded" ? "awarded" : "open",
        },
      });
      const bidders = contractors.slice(0, 3);
      for (let b = 0; b < bidders.length; b++) {
        await prisma.bid.create({
          data: {
            tenderId: tender.id,
            contractorId: bidders[b].id,
            priceQuote: p.sanctioned * (0.92 + b * 0.03),
            proposedTimelineDays: 90 + b * 15,
            supportingDocsUrl: "/docs/placeholder-bid-doc.pdf",
            status: p.status === "awarded" && b === 0 ? "won" : p.status === "awarded" ? "lost" : "submitted",
          },
        });
      }
    }
  }

  console.log("Seeding Osmania University demo project (changes-1.md §9.3)...");
  const osmaniaMpId = mpByName.get("Asaduddin Owaisi");
  if (!osmaniaMpId) throw new Error("Osmania demo project references unknown MP: Asaduddin Owaisi");
  const sriBalaji = demoContractorByCompany.get("Sri Balaji Infra Projects");
  if (!sriBalaji) throw new Error("Osmania demo project references unknown contractor: Sri Balaji Infra Projects");
  const osmaniaDistrictId = districtByName.get("Hyderabad")!;
  const osmaniaProject = await prisma.project.create({
    data: {
      title: "Renovation and Construction of Additional Seminar Hall Block, Osmania University, Hyderabad",
      category: "other",
      mpId: osmaniaMpId,
      districtId: osmaniaDistrictId,
      sanctionedAmount: 3850000,
      billedAmount: 3850000,
      sanctionDate: new Date("2025-08-10"),
      status: "completed",
      assignedContractorId: sriBalaji.id,
      workId: "OU-2025-114",
      isRealData: false,
      // Real Osmania University, Hyderabad campus coordinates
      // (changes-1.md §9.3) — used directly rather than a jittered
      // district center, since this is the project the Jan-Pramaan QR
      // demo geofences against.
      // Updated per changes-3.md §5.1 to pin the College of Engineering
      // building specifically (hackathon venue / live Jan-Pramaan QR demo
      // location), rather than a generic campus point. Corrected again per
      // changes-5.md §1 to the exact pin from the provided Maps link
      // (the §5.1 figure was an approximate, campus-wide guess).
      latitude: 17.4068029,
      longitude: 78.5185352,
    },
  });
  allProjects.push({ id: osmaniaProject.id, status: "completed", isReal: false, sanctioned: 3850000 });

  // Milestones up through "completed", mirroring the fake-project
  // convention above. Deliberately NO JanPramaanSubmission or
  // JanPramaanConsensus rows are created for this project: changes-1.md
  // §9.3 requires zero prior citizen submissions so the live Jan-Pramaan
  // demo scan is the first one. It is intentionally left out of the
  // `jpProjects` list seeded further below — do not add it there.
  const osmaniaMilestoneUpTo = STAGE_TO_MILESTONE_INDEX["completed"];
  for (let m = 0; m <= osmaniaMilestoneUpTo; m++) {
    await prisma.milestone.create({
      data: {
        projectId: osmaniaProject.id,
        name: MILESTONE_SEQUENCE[m],
        sequenceOrder: m,
        paymentStatus: m === osmaniaMilestoneUpTo ? "released" : "pending",
        reachedAt: new Date(2025, 7, 10 + m * 15),
      },
    });
  }

  console.log("Seeding Grand Meadows demo project (changes-3.md §5.2)...");
  // Fake/demo project anchored to a real MP + constituency (Konda
  // Vishweshwar Reddy, CHELVELLA — data.md §? MP allocation table), added
  // for live QR-scan testing at the coordinates from the shared Maps link.
  // Deliberately assigned to the UNVERIFIED demo contractor (Deccan
  // Builders & Co.) so this project doubles as the unverified-contractor
  // demo case.
  const grandMeadowsMpId = mpByName.get("KONDA VISHWESHWAR REDDY");
  if (!grandMeadowsMpId) throw new Error("Grand Meadows demo project references unknown MP: KONDA VISHWESHWAR REDDY");
  const deccanBuilders = demoContractorByCompany.get("Deccan Builders & Co.");
  if (!deccanBuilders) throw new Error("Grand Meadows demo project references unknown contractor: Deccan Builders & Co.");
  const grandMeadowsDistrictId = districtByName.get("Hyderabad")!;
  const grandMeadowsProject = await prisma.project.create({
    data: {
      title: "Development of Community Open Space and Walking Track at Grand Meadows, Attapur, Hyderabad",
      category: "community_hall",
      mpId: grandMeadowsMpId,
      districtId: grandMeadowsDistrictId,
      sanctionedAmount: 1875000,
      billedAmount: 1875000,
      sanctionDate: new Date("2025-09-02"),
      status: "completed",
      assignedContractorId: deccanBuilders.id,
      workId: "GM-2025-041",
      isRealData: false,
      // Real coordinates from the shared Maps link (changes-3.md §5.2),
      // used directly rather than a jittered district center.
      latitude: 17.343425,
      longitude: 78.402552,
    },
  });
  allProjects.push({ id: grandMeadowsProject.id, status: "completed", isReal: false, sanctioned: 1875000 });

  // Milestones up through "completed", mirroring the Osmania/fake-project
  // convention above.
  const grandMeadowsMilestoneUpTo = STAGE_TO_MILESTONE_INDEX["completed"];
  for (let m = 0; m <= grandMeadowsMilestoneUpTo; m++) {
    await prisma.milestone.create({
      data: {
        projectId: grandMeadowsProject.id,
        name: MILESTONE_SEQUENCE[m],
        sequenceOrder: m,
        paymentStatus: m === grandMeadowsMilestoneUpTo ? "released" : "pending",
        reachedAt: new Date(2025, 8, 2 + m * 15),
      },
    });
  }

  // Single payment installment per changes-3.md §5.2.
  await prisma.payment.create({
    data: { projectId: grandMeadowsProject.id, amount: 1875000, paidAt: new Date("2026-02-15"), status: "success" },
  });

  console.log("Seeding Sri Balaji track-record projects (changes-4.md §7)...");
  // changes-4.md §7 — a "top-rated" verified contractor (Trust Score
  // 82/100) with only one completed project (Osmania) doesn't read as
  // convincing. Bump the completed-project count to 18 total by backfilling
  // 17 more small completed works, all assigned to Sri Balaji, same
  // MP/district as the Osmania project for narrative consistency.
  const SRI_BALAJI_TRACK_RECORD_TITLES = [
    "Construction of Community Drinking Water Kiosk, Malakpet, Hyderabad",
    "Repair and Widening of Internal Roads, Chandrayangutta, Hyderabad",
    "Installation of Solar Street Lighting, Yakutpura, Hyderabad",
    "Construction of Public Toilet Block, Nampally, Hyderabad",
    "Renovation of Government Primary School Building, Bahadurpura, Hyderabad",
    "Construction of Storm Water Drainage, Kishanbagh, Hyderabad",
    "Development of Children's Park, Santoshnagar, Hyderabad",
    "Construction of Community Hall, Falaknuma, Hyderabad",
    "Repair of Approach Road to Government Dispensary, Chaderghat, Hyderabad",
    "Installation of Solar Water Pump, Barkas, Hyderabad",
    "Construction of Boundary Wall, Government Junior College, Asifnagar",
    "Widening of Drainage Channel, Rein Bazar, Hyderabad",
    "Construction of Bus Shelter, Charminar, Hyderabad",
    "Renovation of Public Library Building, Ghansi Bazar, Hyderabad",
    "Construction of Overhead Water Tank, Uppuguda, Hyderabad",
    "Repair of Internal Roads, Jahanuma, Hyderabad",
    "Installation of Solar Streetlights, Talabkatta, Hyderabad",
  ];
  const sriBalajiMpId = mpByName.get("Asaduddin Owaisi")!;
  const sriBalajiDistrictId = districtByName.get("Hyderabad")!;
  for (let i = 0; i < SRI_BALAJI_TRACK_RECORD_TITLES.length; i++) {
    const sanctioned = 900000 + (i % 5) * 350000;
    const sanctionDate = new Date(2023, i % 12, 5 + (i % 20));
    const trackProject = await prisma.project.create({
      data: {
        title: SRI_BALAJI_TRACK_RECORD_TITLES[i],
        category: "other",
        mpId: sriBalajiMpId,
        districtId: sriBalajiDistrictId,
        sanctionedAmount: sanctioned,
        billedAmount: sanctioned,
        sanctionDate,
        status: "completed",
        assignedContractorId: sriBalaji.id,
        workId: `SBI-${2023 + Math.floor(i / 12)}-${String(100 + i).padStart(3, "0")}`,
        isRealData: false,
        ...jitteredCoords("Hyderabad", 900 + i),
      },
    });
    allProjects.push({ id: trackProject.id, status: "completed", isReal: false, sanctioned });

    const trackUpTo = STAGE_TO_MILESTONE_INDEX["completed"];
    for (let m = 0; m <= trackUpTo; m++) {
      await prisma.milestone.create({
        data: {
          projectId: trackProject.id,
          name: MILESTONE_SEQUENCE[m],
          sequenceOrder: m,
          paymentStatus: m === trackUpTo ? "released" : "pending",
          reachedAt: new Date(sanctionDate.getFullYear(), sanctionDate.getMonth(), sanctionDate.getDate() + m * 15),
        },
      });
    }
    await prisma.payment.create({
      data: {
        projectId: trackProject.id,
        amount: sanctioned,
        paidAt: new Date(sanctionDate.getFullYear(), sanctionDate.getMonth(), sanctionDate.getDate() + 120),
        status: "success",
      },
    });
  }

  console.log("Seeding audit dossiers (prd.md §4.7 — 10 monitored works)...");
  const riskProfiles = [22, 68, 81, 15, 45, 92, 8, 55, 73, 30];
  for (let i = 0; i < allProjects.length; i++) {
    const proj = allProjects[i];
    const risk = riskProfiles[i % riskProfiles.length];
    await prisma.auditDossier.create({
      data: {
        caseId: `WRK-2025-${String(i + 1).padStart(2, "0")}`,
        projectId: proj.id,
        category: "infrastructure",
        riskScore: risk,
        billedAmount: proj.sanctioned * (risk > 70 ? 1.15 : risk > 40 ? 0.6 : 0.95),
        sanctionedAmount: proj.sanctioned,
        alertTag: risk >= 70 ? "Overpricing Alert" : risk >= 40 ? "Under Review" : null,
        isRealData: proj.isReal,
      },
    });
  }

  console.log("Seeding alerts (prd.md §4.4.2 — 4 tabs)...");
  const highRiskFakeProject = allProjects.find((p) => !p.isReal && p.status === "in_progress")!;
  const alertSeeds = [
    { category: "financial_procurement", type: "cost_anomaly", risk: 78, desc: "Invoice 300% above district baseline for comparable road works.", project: allProjects[4] },
    { category: "financial_procurement", type: "duplicate_project", risk: 65, desc: "New submission closely matches an existing sanctioned project, both semantically and geographically.", project: allProjects[5] },
    { category: "financial_procurement", type: "split_tender", risk: 71, desc: "Three similarly-sized submissions from the same contractor filed on the same day, each just under the approval threshold.", project: highRiskFakeProject },
    { category: "financial_procurement", type: "cartel_collusion", risk: 84, desc: "Three bidders on this tender share registered contact/identity metadata.", project: allProjects[0] },
    { category: "image_forensics", type: "gps_mismatch", risk: 88, desc: "Submitted completion photo's location is 2.4km from the sanctioned site.", project: allProjects[1] },
    { category: "image_forensics", type: "duplicate_image", risk: 92, desc: "Submitted photo matches an image already used on a different project.", project: allProjects[2] },
    { category: "image_forensics", type: "timestamp_anomaly", risk: 55, desc: "Photo is dated 12 days before the claimed completion date.", project: allProjects[3] },
    { category: "jan_pramaan", type: "negative_consensus", risk: 74, desc: "4 of 5 citizen submissions dispute this project's claimed completion.", project: allProjects[5] },
    { category: "jan_pramaan", type: "mock_location", risk: 60, desc: "A citizen submission was flagged for a suspected mock-location app.", project: allProjects[1] },
    { category: "fund_timeline", type: "parked_funds", risk: 40, desc: "₹18.5L sanctioned to this district has sat unspent for 210 days.", project: null },
    { category: "fund_timeline", type: "stalled_project", risk: 52, desc: "No milestone progress recorded in 95 days, beyond the expected timeline.", project: allProjects[3] },
  ] as const;

  const seededAlerts = [];
  for (const a of alertSeeds) {
    const alert = await prisma.alert.create({
      data: {
        category: a.category,
        type: a.type,
        projectId: a.project?.id,
        contractorId: contractors[Math.floor(Math.random() * contractors.length)].id,
        riskScore: a.risk,
        description: a.desc,
        status: a.risk >= 80 ? "audit_triggered" : "open",
      },
    });
    seededAlerts.push(alert);
  }

  console.log("Seeding collusion scenario (prd.md §4.6 — anchored to a real project)...");
  const anchorProject = allProjects.find((p) => p.isReal)!;
  const [ca, cb, cc] = contractors;
  await prisma.collusionEdge.create({
    data: { contractorAId: ca.id, contractorBId: cb.id, sharedAttribute: "phone_number", projectId: anchorProject.id },
  });
  await prisma.collusionEdge.create({
    data: { contractorAId: cb.id, contractorBId: cc.id, sharedAttribute: "pan_prefix", projectId: anchorProject.id },
  });

  console.log("Seeding users (DM, Ministry, demo logins)...");
  const dmUser = await prisma.user.create({
    data: {
      name: "Priya Nair",
      email: "dm@example.com",
      phone: "9800000001",
      passwordHash: await bcrypt.hash("password123", 10),
      role: "dm",
      districtId: districtByName.get("Pune"),
    },
  });
  await prisma.user.create({
    data: {
      name: "Ministry Overview Desk",
      email: "ministry@example.com",
      phone: "9800000002",
      passwordHash: await bcrypt.hash("password123", 10),
      role: "ministry",
    },
  });
  await prisma.user.create({
    data: {
      name: "Aarav Citizen",
      email: "citizen@example.com",
      phone: "9800000003",
      passwordHash: await bcrypt.hash("password123", 10),
      role: "citizen",
    },
  });

  console.log("Seeding demo DM account (changes-1.md §9.2)...");
  // Named demo login for the DM Portal build (changes-1.md §7), scoped to
  // the existing Hyderabad district (already seeded above — same record
  // the real Owaisi/Osmania projects use, per changes-1.md §9.2's note to
  // reuse it rather than create a duplicate).
  await prisma.user.create({
    data: {
      name: "Dr. Ravi Kumar",
      email: "dm.hyderabad@epehredaar.demo",
      phone: "9800000004",
      passwordHash: await bcrypt.hash("Demo@123", 10),
      role: "dm",
      districtId: districtByName.get("Hyderabad"),
    },
  });

  console.log("Seeding DM alert actions + audit log trail...");
  const resolvedAlerts = seededAlerts.filter((a) => a.riskScore < 60).slice(0, 3);
  for (const alert of resolvedAlerts) {
    await prisma.alertAction.create({
      data: {
        alertId: alert.id,
        dmId: dmUser.id,
        decision: "approved_with_justification",
        justificationNote: "Reviewed against site records; variance within expected tolerance for material cost inflation this quarter.",
      },
    });
    await prisma.alert.update({ where: { id: alert.id }, data: { status: "approved" } });
  }

  console.log("Seeding Jan-Pramaan submissions + consensus...");
  const jpProjects = [allProjects[4], allProjects[5], allProjects[0]]; // verified, disputed, awaiting
  const jpOutcomes: Array<{ votes: Array<"up" | "down">; status: string }> = [
    { votes: ["up", "up", "up", "up"], status: "verified" },
    { votes: ["down", "down", "down", "up"], status: "disputed" },
    { votes: ["up"], status: "awaiting" },
  ];
  for (let i = 0; i < jpProjects.length; i++) {
    const proj = jpProjects[i];
    const outcome = jpOutcomes[i];
    for (let v = 0; v < outcome.votes.length; v++) {
      await prisma.janPramaanSubmission.create({
        data: {
          projectId: proj.id,
          photoUrl: `/images/jan-pramaan/sample-${(i % 3) + 1}.jpg`,
          deviceTimestamp: new Date(2026, 1, 10 + v),
          gpsLat: 17.385 + Math.random() * 0.01,
          gpsLng: 78.4867 + Math.random() * 0.01,
          gpsDeviationM: Math.random() * 40,
          mockLocationFlag: false,
          vote: outcome.votes[v],
          isRealData: false,
        },
      });
    }
    const up = outcome.votes.filter((v) => v === "up").length;
    const down = outcome.votes.filter((v) => v === "down").length;
    await prisma.janPramaanConsensus.create({
      data: {
        projectId: proj.id,
        submissionCount: outcome.votes.length,
        thumbsUpCount: up,
        thumbsDownCount: down,
        status: outcome.status,
      },
    });
  }

  console.log("Seeding fund flows + parked funds (Fund Tracker)...");
  for (const proj of allProjects.slice(0, 6)) {
    await prisma.fundFlow.create({
      data: { projectId: proj.id, fromEntity: "ministry", toEntity: "state", amount: proj.sanctioned, flowDate: new Date(2025, 0, 15), isRealData: proj.isReal },
    });
    await prisma.fundFlow.create({
      data: { projectId: proj.id, fromEntity: "state", toEntity: "district", amount: proj.sanctioned, flowDate: new Date(2025, 0, 25), isRealData: proj.isReal },
    });
  }
  await prisma.parkedFund.create({
    data: { districtId: districtByName.get("Patna")!, amount: 1850000, parkedSince: new Date(2025, 5, 1), reason: "Awaiting revised technical sanction", isRealData: false },
  });
  await prisma.parkedFund.create({
    data: { districtId: districtByName.get("Bhopal")!, amount: 920000, parkedSince: new Date(2025, 8, 12), reason: "Contractor selection delayed", isRealData: false },
  });
  // Osmania demo project (not in the slice(0,6) loop above) — same
  // ministry->state->district legs as the other completed projects, so
  // the DM Fund Tracker reflects it consistently.
  await prisma.fundFlow.create({
    data: { projectId: osmaniaProject.id, fromEntity: "ministry", toEntity: "state", amount: 3850000, flowDate: new Date(2025, 6, 20), isRealData: false },
  });
  await prisma.fundFlow.create({
    data: { projectId: osmaniaProject.id, fromEntity: "state", toEntity: "district", amount: 3850000, flowDate: new Date(2025, 6, 28), isRealData: false },
  });

  console.log("Seeding a sample grievance...");
  await prisma.grievance.create({
    data: {
      contractorId: contractors[2].id,
      alertId: seededAlerts[6].id,
      description: "Timestamp flag is incorrect — photo metadata was corrupted on upload, resubmitting with EXIF intact.",
      evidenceUrl: "/docs/placeholder-grievance-evidence.pdf",
      status: "open",
    },
  });

  console.log("Seed complete.");
  console.log(`  MPs: ${MPS_REAL.length} (real) | Districts: ${DISTRICTS.length}`);
  console.log(`  Projects: ${allProjects.length} (${PROJECTS_REAL.length} real + ${FAKE_PROJECTS.length} fake)`);
  console.log(`  Contractors: ${contractors.length} | Alerts: ${seededAlerts.length} | Audit dossiers: ${allProjects.length}`);
  console.log("  Demo logins (password 'password123' or OTP '123456'):");
  console.log("    contractor: bharat.infra.developers@example.com");
  console.log("    dm:         dm@example.com");
  console.log("    ministry:   ministry@example.com");
  console.log("  changes-1.md §9 demo logins (password 'Demo@123'):");
  console.log("    contractor (verified):   contractor.verified@epehredaar.demo");
  console.log("    contractor (unverified): contractor.unverified@epehredaar.demo");
  console.log("    dm (Hyderabad):          dm.hyderabad@epehredaar.demo");
  console.log(`  Osmania demo project: ${osmaniaProject.id} (workId OU-2025-114, zero Jan-Pramaan submissions)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
