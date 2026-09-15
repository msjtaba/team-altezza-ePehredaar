import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  StatusChip,
  bidStatusTone,
  tenderStatusTone,
  statusLabel,
} from "@/components/contractor/status-chip";
import { placeBid } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  verification_required: "Verification required to bid.",
  tender_closed: "That tender is no longer open.",
  already_bid: "You've already placed a bid on that tender.",
  invalid_price: "Enter a valid price quote greater than 0.",
  invalid_timeline: "Enter a valid proposed timeline in whole days.",
};

export default async function MyBidsPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/contractor/bids");

  const contractor = await prisma.contractor.findUnique({
    where: { userId: session.user.id },
  });
  if (!contractor) redirect("/sign-in?callbackUrl=/contractor/bids");

  const [bids, openTenders] = await Promise.all([
    prisma.bid.findMany({
      where: { contractorId: contractor.id },
      include: { tender: { include: { project: true } } },
      orderBy: { submittedAt: "desc" },
    }),
    prisma.tender.findMany({
      where: { status: "open", bids: { none: { contractorId: contractor.id } } },
      include: { project: true },
      orderBy: { bidDeadline: "asc" },
    }),
  ]);

  const errorMessage = searchParams.error ? ERROR_MESSAGES[searchParams.error] : null;
  const isVerified = contractor.kycStatus === "verified";

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-semibold text-navy-950">My Bids</h1>
        <p className="mt-1 text-sm text-slate-600">
          Track every bid you&apos;ve submitted, and place new ones on open tenders.
        </p>
      </div>

      {errorMessage && (
        <p className="rounded-md bg-flagged-tint px-4 py-3 text-sm text-flagged">
          {errorMessage}
        </p>
      )}
      {searchParams.success && (
        <p className="rounded-md bg-healthy-tint px-4 py-3 text-sm text-healthy">
          Bid submitted successfully.
        </p>
      )}

      <section>
        <h2 className="text-xl font-semibold text-navy-950">Submitted bids</h2>
        {bids.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            You haven&apos;t placed any bids yet.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Price Quote</th>
                  <th className="px-4 py-3 font-medium">Timeline</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid) => (
                  <tr key={bid.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 text-navy-950">{bid.tender.project.title}</td>
                    <td className="px-4 py-3 font-mono tabular-nums text-slate-700">
                      ₹{Number(bid.priceQuote).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-slate-700">
                      {bid.proposedTimelineDays} days
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {bid.submittedAt.toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip label={statusLabel(bid.status)} tone={bidStatusTone(bid.status)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-navy-950">Open tenders</h2>
        {openTenders.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No open tenders available to bid on right now.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {openTenders.map((tender) => (
              <div
                key={tender.id}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-navy-950">
                      {tender.project.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Sanctioned amount{" "}
                      <span className="font-mono tabular-nums">
                        ₹{Number(tender.project.sanctionedAmount).toLocaleString("en-IN")}
                      </span>{" "}
                      · Bid deadline {tender.bidDeadline.toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <StatusChip label={statusLabel(tender.status)} tone={tenderStatusTone(tender.status)} />
                </div>

                {isVerified ? (
                  <form
                    action={placeBid.bind(null, tender.id)}
                    className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3"
                  >
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor={`price-${tender.id}`}
                        className="text-sm font-medium text-slate-700"
                      >
                        Price quote (₹)
                      </label>
                      <input
                        id={`price-${tender.id}`}
                        name="priceQuote"
                        type="number"
                        min="1"
                        step="1"
                        required
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-mono tabular-nums text-navy-950 outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor={`timeline-${tender.id}`}
                        className="text-sm font-medium text-slate-700"
                      >
                        Proposed timeline (days)
                      </label>
                      <input
                        id={`timeline-${tender.id}`}
                        name="proposedTimelineDays"
                        type="number"
                        min="1"
                        step="1"
                        required
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-mono tabular-nums text-navy-950 outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor={`docs-${tender.id}`}
                        className="text-sm font-medium text-slate-700"
                      >
                        Supporting docs (URL)
                      </label>
                      <input
                        id={`docs-${tender.id}`}
                        name="supportingDocsUrl"
                        type="text"
                        placeholder="/docs/my-bid-proposal.pdf"
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm text-navy-950 outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Button type="submit" variant="primary">
                        Place Bid
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-4 flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-sm text-slate-600">
                      Verification required to bid.
                    </p>
                    <Button type="button" variant="secondary" disabled>
                      Place Bid
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
