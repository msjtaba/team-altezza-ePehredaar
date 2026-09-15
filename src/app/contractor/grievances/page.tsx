import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  StatusChip,
  grievanceStatusTone,
  statusLabel,
} from "@/components/contractor/status-chip";
import { fileGrievance } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  description_required: "Description is required.",
};

// prd.md §4.2 "Grievance/Dispute Panel" — a channel for a contractor to
// contest an AI-generated flag or a frozen payment. Submission here routes
// to the relevant DM (brain.md §3 rule 3: every DM decision on it will
// later carry a justification note + DM identity + timestamp, on the DM
// side built in Phase 5) — status defaults to "open" until then.
export default async function GrievancesPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/contractor/grievances");
  if (session.user.role !== "contractor") redirect("/sign-in?callbackUrl=/contractor/grievances");

  const contractor = await prisma.contractor.findUnique({
    where: { userId: session.user.id },
  });
  if (!contractor) redirect("/sign-in?callbackUrl=/contractor/grievances");

  const [grievances, alerts] = await Promise.all([
    prisma.grievance.findMany({
      where: { contractorId: contractor.id },
      include: { alert: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.alert.findMany({
      where: { contractorId: contractor.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const errorMessage = searchParams.error ? ERROR_MESSAGES[searchParams.error] : null;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-2xl tracking-tight text-ink-950 sm:text-3xl">Grievances</h1>
        <p className="mt-1 text-sm text-ink-950/60">
          Contest an AI-generated flag or a frozen payment. Submissions route
          to the relevant District Magistrate for review.
        </p>
      </div>

      {errorMessage && (
        <p className="rounded-md bg-flagged-tint px-4 py-3 text-sm text-flagged">
          {errorMessage}
        </p>
      )}
      {searchParams.success && (
        <p className="rounded-md bg-healthy-tint px-4 py-3 text-sm text-healthy">
          Grievance filed successfully.
        </p>
      )}

      <section className="rounded-lg border border-ink-950/10 bg-paper-2 p-6">
        <h2 className="font-display text-lg tracking-wide text-ink-950">File a new grievance</h2>
        <form action={fileGrievance} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="alertId" className="text-sm font-medium text-ink-950/70">
              Related alert (optional)
            </label>
            <select
              id="alertId"
              name="alertId"
              className="rounded-md border border-ink-950/15 bg-paper px-3 py-2 text-sm text-ink-950 outline-none focus-visible:ring-2 focus-visible:ring-marigold-600"
              defaultValue=""
            >
              <option value="">Not linked to a specific alert</option>
              {alerts.map((alert) => (
                <option key={alert.id} value={alert.id}>
                  {statusLabel(alert.type)} — {alert.riskScore}% risk (
                  {alert.createdAt.toLocaleDateString("en-IN")})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-ink-950/70">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="rounded-md border border-ink-950/15 bg-paper px-3 py-2 text-sm text-ink-950 outline-none focus-visible:ring-2 focus-visible:ring-marigold-600"
            />
            <p className="text-xs text-ink-950/50">
              Explain why you&apos;re contesting the flag or frozen payment.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="evidenceUrl" className="text-sm font-medium text-ink-950/70">
              Evidence URL (optional)
            </label>
            <input
              id="evidenceUrl"
              name="evidenceUrl"
              type="text"
              placeholder="/docs/my-counter-evidence.pdf"
              className="rounded-md border border-ink-950/15 bg-paper px-3 py-2 text-sm text-ink-950 outline-none focus-visible:ring-2 focus-visible:ring-marigold-600"
            />
          </div>

          <div>
            <Button type="submit" variant="marigold">
              Submit Grievance
            </Button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-display text-lg tracking-wide text-ink-950">Your grievances</h2>
        {grievances.length === 0 ? (
          <p className="mt-3 text-sm text-ink-950/50">
            You haven&apos;t filed any grievances yet.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {grievances.map((g) => (
              <div key={g.id} className="rounded-lg border border-ink-950/10 bg-paper-2 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-ink-950">{g.description}</p>
                    {g.alert && (
                      <p className="mt-1 text-xs text-ink-950/50">
                        Related to: {statusLabel(g.alert.type)} alert (
                        {g.alert.riskScore}% risk)
                      </p>
                    )}
                    {g.evidenceUrl && (
                      <p className="mt-1 text-xs text-ink-950/50">
                        Evidence: <span className="font-mono">{g.evidenceUrl}</span>
                      </p>
                    )}
                  </div>
                  <StatusChip label={statusLabel(g.status)} tone={grievanceStatusTone(g.status)} />
                </div>
                <p className="mt-2 text-xs text-ink-950/40">
                  Filed {g.createdAt.toLocaleDateString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
