"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { ALERT_CATEGORIES, ALERT_CATEGORY_LABELS, type AlertCategory, riskTierFromScore } from "@/lib/enums";
import { takeAlertAction } from "@/app/dm/alerts/actions";

export type InboxAlert = {
  id: string;
  category: string;
  type: string;
  riskScore: number;
  description: string;
  status: string;
  createdAt: string;
  project: { id: string; title: string } | null;
  contractor: { id: string; companyName: string } | null;
  hasFrozenMilestone: boolean;
  actions: Array<{
    id: string;
    decision: string;
    justificationNote: string;
    createdAt: string;
    dmName: string;
  }>;
};

type ActionSpec = { label: string; decision: string; status: string };

// prd.md §4.4.2 — exact action set per tab.
const TAB_ACTIONS: Record<AlertCategory, ActionSpec[]> = {
  financial_procurement: [
    { label: "Approve with Justification", decision: "approved_with_justification", status: "approved" },
    { label: "Initiate Audit", decision: "audit_initiated", status: "audit_triggered" },
  ],
  image_forensics: [
    { label: "Approve", decision: "approved_with_justification", status: "approved" },
    { label: "Reject", decision: "rejected", status: "rejected" },
    { label: "Request Physical Audit", decision: "physical_audit_requested", status: "audit_triggered" },
  ],
  jan_pramaan: [
    { label: "Approve", decision: "approved_with_justification", status: "approved" },
    { label: "Reject", decision: "rejected", status: "rejected" },
    { label: "Request Physical Audit", decision: "physical_audit_requested", status: "audit_triggered" },
  ],
  fund_timeline: [
    { label: "Send Reminder", decision: "reminder_sent", status: "reminder_sent" },
    { label: "Escalate to State Authority", decision: "escalated", status: "escalated" },
  ],
};

const DECISION_LABELS: Record<string, string> = {
  approved_with_justification: "Approved",
  audit_initiated: "Audit Initiated",
  rejected: "Rejected",
  physical_audit_requested: "Physical Audit Requested",
  reminder_sent: "Reminder Sent",
  escalated: "Escalated",
};

function decisionTier(decision: string): "healthy" | "watch" | "flagged" | "stage" {
  if (decision === "approved_with_justification" || decision === "reminder_sent") return "healthy";
  if (decision === "rejected") return "flagged";
  return "watch";
}

function janPramaanSubFilter(type: string): "pending_review" | "negative_consensus" | "mock_location" {
  if (type === "negative_consensus") return "negative_consensus";
  if (type === "mock_location") return "mock_location";
  return "pending_review";
}

export function AlertsInboxClient({
  alerts,
  projects,
  contractors,
}: {
  alerts: InboxAlert[];
  projects: Array<{ id: string; title: string }>;
  contractors: Array<{ id: string; companyName: string }>;
}) {
  const [tab, setTab] = useState<AlertCategory>("financial_procurement");
  const [jpSubFilter, setJpSubFilter] = useState<"all" | "pending_review" | "negative_consensus" | "mock_location">("all");
  const [projectFilter, setProjectFilter] = useState("");
  const [contractorFilter, setContractorFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = useMemo(() => {
    let list = alerts.filter((a) => a.category === tab);
    if (tab === "jan_pramaan" && jpSubFilter !== "all") {
      list = list.filter((a) => janPramaanSubFilter(a.type) === jpSubFilter);
    }
    if (projectFilter) list = list.filter((a) => a.project?.id === projectFilter);
    if (contractorFilter) list = list.filter((a) => a.contractor?.id === contractorFilter);
    if (dateFilter) {
      const cutoff = new Date(dateFilter).getTime();
      list = list.filter((a) => new Date(a.createdAt).getTime() >= cutoff);
    }
    // Shared behavior (prd.md §4.4.2): frozen-payment-linked alerts float
    // to the top, then highest risk first.
    return list.slice().sort((a, b) => {
      if (a.hasFrozenMilestone !== b.hasFrozenMilestone) return a.hasFrozenMilestone ? -1 : 1;
      return b.riskScore - a.riskScore;
    });
  }, [alerts, tab, jpSubFilter, projectFilter, contractorFilter, dateFilter]);

  const openCountByTab = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of ALERT_CATEGORIES) {
      counts[cat] = alerts.filter((a) => a.category === cat && !["approved", "rejected"].includes(a.status)).length;
    }
    return counts;
  }, [alerts]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight text-ink-950">Alerts Inbox</h1>
        <p className="mt-1 text-sm text-ink-950/60">
          Every alert content shown here is sample/hardcoded — the detection engine itself is not built.
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-ink-950/10">
        {ALERT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setTab(cat);
              setJpSubFilter("all");
            }}
            className={`rounded-t-md border-b-2 px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
              tab === cat
                ? "border-marigold-600 text-ink-950"
                : "border-transparent text-ink-950/50 hover:text-marigold-600"
            }`}
          >
            {ALERT_CATEGORY_LABELS[cat]}{" "}
            <span className="ml-1 font-mono text-xs tabular-nums text-ink-950/40">{openCountByTab[cat]}</span>
          </button>
        ))}
      </div>

      {tab === "jan_pramaan" && (
        <div className="flex flex-wrap gap-1">
          {(
            [
              ["all", "All"],
              ["pending_review", "Pending Review"],
              ["negative_consensus", "Negative Consensus Reached"],
              ["mock_location", "Mock-Location Flagged"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setJpSubFilter(val)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                jpSubFilter === val ? "bg-marigold-100 text-marigold-600" : "bg-paper text-ink-950/60 hover:bg-paper-2"
              } border border-ink-950/10`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-ink-950/10 bg-paper-2 p-4">
        <FilterField label="Project">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="rounded-md border border-ink-950/15 bg-paper px-3 py-1.5 text-sm text-ink-950/80 focus:border-marigold-600 focus:outline-none"
          >
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Contractor">
          <select
            value={contractorFilter}
            onChange={(e) => setContractorFilter(e.target.value)}
            className="rounded-md border border-ink-950/15 bg-paper px-3 py-1.5 text-sm text-ink-950/80 focus:border-marigold-600 focus:outline-none"
          >
            <option value="">All contractors</option>
            {contractors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.companyName}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Since">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-md border border-ink-950/15 bg-paper px-3 py-1.5 text-sm text-ink-950/80 focus:border-marigold-600 focus:outline-none"
          />
        </FilterField>
        {(projectFilter || contractorFilter || dateFilter) && (
          <button
            onClick={() => {
              setProjectFilter("");
              setContractorFilter("");
              setDateFilter("");
            }}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-ink-950/50 hover:text-marigold-600"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-ink-950/15 bg-paper-2 p-10 text-center text-sm text-ink-950/40">
            No alerts match the current filters.
          </div>
        )}
        {filtered.map((alert) => (
          <AlertCard key={alert.id} alert={alert} actionSpecs={TAB_ACTIONS[tab]} />
        ))}
      </div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-ink-950/50">{label}</label>
      {children}
    </div>
  );
}

function AlertCard({ alert, actionSpecs }: { alert: InboxAlert; actionSpecs: ActionSpec[] }) {
  const [openForm, setOpenForm] = useState<ActionSpec | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const tier = riskTierFromScore(alert.riskScore);
  const resolved = ["approved", "rejected"].includes(alert.status);

  return (
    <div className={`rounded-lg border bg-paper-2 p-5 ${alert.hasFrozenMilestone ? "border-flagged/40" : "border-ink-950/10"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-[240px]">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tier={tier}>
              <span className="font-mono tabular-nums">{alert.riskScore}%</span> risk
            </Badge>
            <Badge tier="stage">{alert.type.replace(/_/g, " ")}</Badge>
            {alert.hasFrozenMilestone && <Badge tier="flagged">Payment Frozen</Badge>}
            <Badge tier="stage">{alert.status.replace(/_/g, " ")}</Badge>
          </div>
          <p className="mt-2 text-sm text-ink-950">{alert.description}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-950/60">
            {alert.project && (
              <Link href={`/projects/${alert.project.id}`} className="hover:text-marigold-600 hover:underline">
                Project: {alert.project.title}
              </Link>
            )}
            {alert.contractor && (
              <Link href={`/contractors/${alert.contractor.id}`} className="hover:text-marigold-600 hover:underline">
                Contractor: {alert.contractor.companyName}
              </Link>
            )}
            <span className="font-mono tabular-nums">{formatDate(alert.createdAt)}</span>
          </div>
          {alert.type === "cartel_collusion" && alert.project && (
            <Link
              href={`/dm/audit/collusion/${alert.project.id}`}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:underline"
            >
              View collusion graph →
            </Link>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!resolved &&
            actionSpecs.map((spec) => (
              <Button
                key={spec.decision}
                variant={spec.decision === "rejected" ? "outline-paper" : "marigold"}
                className="px-3 py-1.5 text-xs"
                onClick={() => setOpenForm(openForm?.decision === spec.decision ? null : spec)}
              >
                {spec.label}
              </Button>
            ))}
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-ink-950/50 hover:text-marigold-600"
          >
            {showHistory ? "Hide" : "Show"} History ({alert.actions.length})
          </button>
        </div>
      </div>

      {openForm && <JustificationForm alertId={alert.id} spec={openForm} onDone={() => setOpenForm(null)} />}

      {showHistory && (
        <div className="mt-4 rounded-md bg-ink-950/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-950/50">Approval History</p>
          {alert.actions.length === 0 ? (
            <p className="mt-2 text-xs text-ink-950/40">No decisions recorded yet.</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-3">
              {alert.actions.map((act) => (
                <li key={act.id} className="text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tier={decisionTier(act.decision)}>{DECISION_LABELS[act.decision] ?? act.decision}</Badge>
                    <span className="font-medium text-ink-950">{act.dmName}</span>
                    <span className="font-mono tabular-nums text-ink-950/40">{formatDate(act.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-ink-950/70">{act.justificationNote}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function JustificationForm({
  alertId,
  spec,
  onDone,
}: {
  alertId: string;
  spec: ActionSpec;
  onDone: () => void;
}) {
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setError(null);
    if (note.trim().length < 10) {
      setError("Justification note is required — at least 10 characters.");
      return;
    }
    startTransition(async () => {
      const result = await takeAlertAction(alertId, spec.decision as never, spec.status, note);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onDone();
    });
  }

  return (
    <div className="mt-4 rounded-md border border-marigold-600/20 bg-marigold-100/40 p-4">
      <label htmlFor={`justification-${alertId}`} className="text-xs font-medium text-ink-950">
        Justification note — required for &quot;{spec.label}&quot;
      </label>
      <textarea
        id={`justification-${alertId}`}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        className="mt-1.5 w-full rounded-md border border-ink-950/15 bg-paper px-3 py-2 text-sm text-ink-950/80 focus:border-marigold-600 focus:outline-none"
      />
      {error && <p className="mt-1 text-xs text-flagged">{error}</p>}
      <div className="mt-3 flex items-center gap-2">
        <Button className="px-3 py-1.5 text-xs" onClick={submit} disabled={isPending}>
          {isPending ? "Submitting…" : `Confirm ${spec.label}`}
        </Button>
        <Button variant="outline-paper" className="px-3 py-1.5 text-xs" onClick={onDone} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
