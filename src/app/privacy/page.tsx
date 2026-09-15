import { PersuadeNav } from "@/components/site/persuade-nav";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata = {
  title: "Privacy Policy — ePehredaar",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-lg tracking-wide text-ink-950">{title.toUpperCase()}</h2>
      <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-ink-950/70">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="font-body">
      <PersuadeNav />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Legal</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-ink-950 sm:text-4xl">
          PRIVACY POLICY
        </h1>
        <p className="mt-2 text-sm text-ink-950/50">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="mt-6 rounded-lg border border-marigold-600/30 bg-marigold-100 p-4 text-sm leading-relaxed text-ink-950/80">
          <strong className="font-semibold">Prototype notice:</strong> ePehredaar is a demonstration build, not a
          live government system. No real payments are processed, no real KYC/verification checks run, and no
          fraud-detection model executes live in this build — see each page&apos;s footer for what data is real
          versus illustrative. This policy describes how this prototype handles the data it does collect.
        </div>

        <Section title="What this is">
          <p>
            ePehredaar is an oversight-layer prototype for India&apos;s MPLADS (Members of Parliament Local Area
            Development Scheme) fund tracking. It presents fund allocation and project data, and lets citizens,
            contractors, and District Magistrates interact with a demonstration verification and alerts workflow.
          </p>
        </Section>

        <Section title="Information we collect">
          <p><strong className="font-semibold text-ink-950">Public MPLADS data.</strong> MP fund allocation figures and sample project records shown across the site are sourced from public records or constructed for demonstration purposes — this is not personal data about you.</p>
          <p><strong className="font-semibold text-ink-950">Account information.</strong> If you sign in or sign up as a Contractor or District Magistrate, we hold the details you provide for that account (name, email/phone, and for contractors, company/registration/GST/PAN fields) to operate the relevant portal.</p>
          <p><strong className="font-semibold text-ink-950">Jan-Pramaan citizen verification.</strong> If you use the mobile Jan-Pramaan flow to verify a project in person, we capture a photo (camera capture only), your device&apos;s GPS location at the moment of capture, and your thumbs-up/down response. This data is used only to compute a verification signal for the relevant project — it is never displayed publicly, and it is never shown to a District Magistrate as a raw photo or browsable gallery; only the aggregate outcome (and, internally, an alert if a model would flag it) is surfaced.</p>
          <p><strong className="font-semibold text-ink-950">Usage data.</strong> Standard web request data (e.g. pages visited) may be logged by the hosting environment for operating the site; this prototype does not run third-party analytics or advertising trackers.</p>
        </Section>

        <Section title="How we use this information">
          <p>
            Account data is used solely to authenticate you and show you the correct portal view. Jan-Pramaan
            submission data is used solely to compute a project&apos;s citizen-verification consensus and, in a full
            build, to feed a fraud-detection model — in this prototype, that detection layer is simulated, not
            live. We do not sell, rent, or share your data with third parties for marketing.
          </p>
        </Section>

        <Section title="Data retention">
          <p>
            This is a demonstration build. Data entered through the sign-up flow is not persisted beyond your
            session. Seeded/sample data (projects, contractors, alerts) exists only to demonstrate the product and
            may be reset at any time.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            Since this prototype does not persist personal accounts created through sign-up, there is no standing
            record to request access to or deletion of beyond your active session. For the pre-seeded demo
            accounts used to showcase the Contractor and DM portals, no real personal data is involved.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            We use a single session cookie to keep you signed in (via NextAuth). We do not use tracking or
            advertising cookies.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            As this prototype evolves, this page may be updated to reflect changes in what data is collected or
            how it&apos;s used. Check back here for the current version.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this prototype or this policy can be directed to the project team listed in the
            repository this build ships from.
          </p>
        </Section>
      </div>

      <SiteFooter />
    </main>
  );
}
