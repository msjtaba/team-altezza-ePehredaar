import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MILESTONE_NAMES } from "@/lib/enums";
import {
  StatusChip,
  paymentStatusTone,
  statusLabel,
} from "@/components/contractor/status-chip";

const MILESTONE_LABELS: Record<string, string> = {
  sanctioned: "Sanctioned",
  started: "Started",
  in_process: "In Process",
  completed: "Completed",
  citizen_verified: "Citizen-Verified",
  paid: "Paid",
};

// brain.md §3 rule 1 — this tracker reads the same six-step sequence
// (MILESTONE_NAMES, enums.ts) that the public tracker, DM project view, and
// Ministry funnel all read; it never maintains its own copy of the stages.
export default async function MyProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/contractor/projects");

  const contractor = await prisma.contractor.findUnique({
    where: { userId: session.user.id },
  });
  if (!contractor) redirect("/sign-in?callbackUrl=/contractor/projects");

  const projects = await prisma.project.findMany({
    where: { assignedContractorId: contractor.id },
    include: {
      milestones: { orderBy: { sequenceOrder: "asc" } },
      district: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold text-navy-950">My Projects</h1>
        <p className="mt-1 text-sm text-slate-600">
          Awarded, in-progress, and completed projects, with the milestone
          tracker and per-milestone payment status.
        </p>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-slate-500">
          No projects have been assigned to you yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {projects.map((project) => {
            const reached = new Map(project.milestones.map((m) => [m.name, m]));
            const lastReachedIndex = MILESTONE_NAMES.reduce(
              (acc, name, i) => (reached.has(name) ? i : acc),
              -1
            );

            return (
              <div
                key={project.id}
                className="rounded-lg border border-slate-200 bg-white p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-navy-950">
                      {project.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {project.district.name}, {project.district.state} ·{" "}
                      Sanctioned{" "}
                      <span className="font-mono tabular-nums">
                        ₹{Number(project.sanctionedAmount).toLocaleString("en-IN")}
                      </span>
                    </p>
                  </div>
                  <StatusChip
                    label={statusLabel(project.status)}
                    tone={project.status === "payment_released" ? "positive" : "neutral"}
                  />
                </div>

                <ol className="mt-6 flex flex-wrap gap-3">
                  {MILESTONE_NAMES.map((name, i) => {
                    const milestone = reached.get(name);
                    const isReached = i <= lastReachedIndex;
                    return (
                      <li
                        key={name}
                        className={`flex min-w-[150px] flex-1 flex-col gap-2 rounded-md border px-3 py-2.5 transition-colors duration-150 ${
                          isReached
                            ? "border-navy-200 bg-navy-50"
                            : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] font-semibold ${
                              isReached
                                ? "bg-navy-700 text-white"
                                : "bg-slate-300 text-white"
                            }`}
                          >
                            {i + 1}
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              isReached ? "text-navy-950" : "text-slate-500"
                            }`}
                          >
                            {MILESTONE_LABELS[name]}
                          </span>
                        </div>
                        {milestone ? (
                          <StatusChip
                            label={statusLabel(milestone.paymentStatus)}
                            tone={paymentStatusTone(milestone.paymentStatus)}
                          />
                        ) : (
                          <span className="text-[11px] text-slate-400">Not yet reached</span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
