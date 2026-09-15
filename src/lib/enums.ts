/**
 * Application-level enum values, enforced here rather than at the DB level.
 * schema.prisma §"deviation 2" — SQLite has no native enum type, so every
 * field documented as an enum in trd.md §5 is a `String` column; this file
 * is the single source of truth for the allowed values, imported wherever
 * a status/category/type needs validating or rendering.
 */

export const ROLES = ["citizen", "contractor", "dm", "ministry", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const PROJECT_CATEGORIES = [
  "road",
  "school",
  "solar_plant",
  "community_hall",
  "drainage",
  "other",
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  road: "Road",
  school: "School",
  solar_plant: "Solar Plant",
  community_hall: "Community Hall",
  drainage: "Drainage",
  other: "Other",
};

// Single source of truth for project stage, everywhere it's read
// (brain.md §3 rule 1: public tracker, contractor milestones, DM view,
// ministry funnel must never diverge).
export const PROJECT_STAGES = [
  "sanctioned",
  "tendered",
  "awarded",
  "in_progress",
  "completed",
  "citizen_verified",
  "payment_released",
] as const;
export type ProjectStage = (typeof PROJECT_STAGES)[number];

export const PROJECT_STAGE_LABELS: Record<ProjectStage, string> = {
  sanctioned: "Sanctioned",
  tendered: "Tendered",
  awarded: "Awarded",
  in_progress: "In Progress",
  completed: "Completed",
  citizen_verified: "Citizen-Verified",
  payment_released: "Payment Released",
};

export const TENDER_STATUSES = ["open", "closed", "awarded"] as const;
export const BID_STATUSES = ["submitted", "under_review", "won", "lost"] as const;

export const MILESTONE_NAMES = [
  "sanctioned",
  "started",
  "in_process",
  "completed",
  "citizen_verified",
  "paid",
] as const;
export const PAYMENT_STATUSES = ["pending", "released", "frozen"] as const;

export const KYC_STATUSES = ["unverified", "verified"] as const;

export const JAN_PRAMAAN_VOTES = ["up", "down"] as const;
export const JAN_PRAMAAN_CONSENSUS_STATUSES = ["awaiting", "verified", "disputed"] as const;

// design.md §3.3 — the locked three-tier risk system. Never a 4th tier.
export const RISK_TIERS = ["healthy", "watch", "flagged"] as const;
export type RiskTier = (typeof RISK_TIERS)[number];

export function riskTierFromScore(score: number): RiskTier {
  if (score >= 70) return "flagged";
  if (score >= 40) return "watch";
  return "healthy";
}

/**
 * Interaction rule (data.md §2 / brain.md §4): a project's card is only
 * clickable through to its detail timeline once it has reached "completed"
 * or later in the stage progression. Used by the public listing (Phase 2)
 * to decide whether a project card links anywhere.
 */
export function isStageCompletedOrLater(status: string): boolean {
  const idx = PROJECT_STAGES.indexOf(status as ProjectStage);
  const completedIdx = PROJECT_STAGES.indexOf("completed");
  return idx >= completedIdx;
}

export const ALERT_CATEGORIES = [
  "financial_procurement",
  "image_forensics",
  "jan_pramaan",
  "fund_timeline",
] as const;
export type AlertCategory = (typeof ALERT_CATEGORIES)[number];

export const ALERT_CATEGORY_LABELS: Record<AlertCategory, string> = {
  financial_procurement: "Financial & Procurement",
  image_forensics: "Image Forensics",
  jan_pramaan: "Jan-Pramaan Verification",
  fund_timeline: "Fund / Timeline",
};

export const ALERT_TYPES = [
  "cost_anomaly",
  "duplicate_project",
  "split_tender",
  "cartel_collusion",
  "gps_mismatch",
  "duplicate_image",
  "timestamp_anomaly",
  "negative_consensus",
  "mock_location",
  "parked_funds",
  "stalled_project",
] as const;

export const ALERT_STATUSES = [
  "open",
  "approved",
  "rejected",
  "audit_triggered",
  "reminder_sent",
  "escalated",
] as const;

export const ALERT_DECISIONS = [
  "approved_with_justification",
  "audit_initiated",
  "rejected",
  "physical_audit_requested",
  "reminder_sent",
  "escalated",
] as const;

export const COLLUSION_SHARED_ATTRIBUTES = [
  "phone_number",
  "pan_prefix",
  "registered_address",
] as const;

export const FUND_FLOW_ENTITIES = ["ministry", "state", "district", "contractor"] as const;

export const GRIEVANCE_STATUSES = ["open", "resolved", "rejected"] as const;
