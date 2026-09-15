"use client";

import { useState, type FormEvent } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// changes-3.md §4 — unified sign-in/sign-up flow, restyled to the Persuade
// design language (paper/ink/marigold tokens, same card conventions as
// /projects, /mp-allocations, /jan-pramaan) rather than the old bespoke
// navy/slate "Operate" skin. Sign-in logic against src/lib/auth.ts is
// untouched — this is presentation plus a demo-only, non-persisted sign-up
// flow (changes-3.md §9.4: no DB writes required, just a believable
// walkthrough that doesn't need to survive a refresh).

const inputClass =
  "rounded-md border border-ink-950/15 bg-paper px-3 py-2 text-sm text-ink-950 outline-none placeholder:text-ink-950/35 focus-visible:border-ink-950 focus-visible:ring-2 focus-visible:ring-marigold-600/30";
const labelClass = "text-sm font-medium text-ink-950/80";

type View = "sign-in" | "sign-up";
type SignUpRole = "contractor" | "dm";

export function SignInClient({ districts }: { districts: string[] }) {
  const [view, setView] = useState<View>("sign-in");

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-paper px-4 py-10 font-body sm:px-6">
      <div className="mb-6 w-full max-w-md">
        <Link
          href="/"
          className="text-sm font-semibold text-ink-950/60 transition-colors hover:text-marigold-600"
        >
          ← Back to ePehredaar
        </Link>
      </div>

      <div className="w-full max-w-md rounded-lg border border-ink-950/10 bg-paper-2 p-8 shadow-sm">
        {view === "sign-in" ? (
          <SignInPanel onSignUp={() => setView("sign-up")} />
        ) : (
          <SignUpPanel districts={districts} onCancel={() => setView("sign-in")} />
        )}
      </div>
    </main>
  );
}

function SignInPanel({ onSignUp }: { onSignUp: () => void }) {
  const router = useRouter();
  const params = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("That email/phone and password (or OTP) don't match an account.");
      return;
    }

    // changes-5.md §2 — the previous version always fell back to "/" when
    // no explicit callbackUrl was present, which is the common case (a
    // direct visit to /sign-in, not a redirect from a gated route). That
    // silently stranded every Contractor/DM login on the homepage instead
    // of their portal, which read as "the portal doesn't exist." Route by
    // the session's actual role instead whenever callbackUrl wasn't set.
    const explicitCallbackUrl = params.get("callbackUrl");
    if (explicitCallbackUrl) {
      router.push(explicitCallbackUrl);
      router.refresh();
      return;
    }

    const session = await getSession();
    const role = session?.user?.role;
    const roleHome: Record<string, string> = {
      contractor: "/contractor",
      dm: "/dm",
      ministry: "/ministry",
    };
    router.push(roleHome[role ?? ""] ?? "/");
    router.refresh();
  }

  return (
    <>
      <h1 className="font-display text-2xl tracking-tight text-ink-950">SIGN IN</h1>
      <p className="mt-1 text-sm text-ink-950/60">
        Contractor, District Magistrate.
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="identifier" className={labelClass}>
            Email or phone
          </label>
          <input
            id="identifier"
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className={inputClass}
            placeholder="dm@example.com"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="password123"
          />
          <p className="text-xs text-ink-950/45">
            Demo build: the OTP <span className="font-mono">123456</span>{" "}
            also works for any account.
          </p>
        </div>

        {error && (
          <p className="rounded-md bg-flagged-tint px-3 py-2 text-sm text-flagged">
            {error}
          </p>
        )}

        <Button type="submit" variant="marigold" disabled={loading} className="mt-2 w-full">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="mt-6 border-t border-ink-950/10 pt-4 text-xs text-ink-950/50">
        <p className="font-medium text-ink-950/70">Demo accounts:</p>
        <p className="mt-1 font-mono">dm@example.com · dm</p>
        <p className="font-mono">bharat.infra.developers@example.com · contractor</p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-ink-950/10 pt-5">
        <p className="text-sm text-ink-950/70">New here? Create an account.</p>
        <Button type="button" variant="outline-paper" onClick={onSignUp}>
          Sign Up
        </Button>
      </div>
    </>
  );
}

function SignUpPanel({
  districts,
  onCancel,
}: {
  districts: string[];
  onCancel: () => void;
}) {
  const [role, setRole] = useState<SignUpRole>("contractor");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Contractor fields (prisma Contractor model + linked User).
  const [companyName, setCompanyName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [contractorPhone, setContractorPhone] = useState("");
  const [contractorEmail, setContractorEmail] = useState("");
  const [contractorPassword, setContractorPassword] = useState("");
  const [contractorConfirm, setContractorConfirm] = useState("");

  // DM fields (prisma User model, role = "dm").
  const [fullName, setFullName] = useState("");
  const [district, setDistrict] = useState("");
  const [dmEmail, setDmEmail] = useState("");
  const [dmPassword, setDmPassword] = useState("");
  const [dmConfirm, setDmConfirm] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // changes-3.md §9.4 — sign-up is demo-only, no persistence: just
    // validate client-side and show a believable confirmation state.
    if (role === "contractor" && contractorPassword !== contractorConfirm) {
      setError("Passwords don't match.");
      return;
    }
    if (role === "dm" && dmPassword !== dmConfirm) {
      setError("Passwords don't match.");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-healthy-tint text-healthy">
          ✓
        </div>
        <h1 className="font-display text-xl tracking-tight text-ink-950">
          ACCOUNT CREATED
        </h1>
        <p className="max-w-xs text-sm text-ink-950/60">
          Your {role === "contractor" ? "Contractor" : "District Magistrate"}{" "}
          account request has been submitted. You can now sign in.
        </p>
        <Button
          type="button"
          variant="marigold"
          className="mt-1 w-full max-w-xs"
          onClick={onCancel}
        >
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-2xl tracking-tight text-ink-950">SIGN UP</h1>
      <p className="mt-1 text-sm text-ink-950/60">
        Create a Contractor or District Magistrate account.
      </p>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => setRole("contractor")}
          className={`flex-1 rounded-md border-2 px-3 py-2 text-sm font-semibold transition-colors ${
            role === "contractor"
              ? "border-marigold-600 bg-marigold-100 text-ink-950"
              : "border-ink-950/15 text-ink-950/60 hover:border-ink-950/30"
          }`}
        >
          Sign up as Contractor
        </button>
        <button
          type="button"
          onClick={() => setRole("dm")}
          className={`flex-1 rounded-md border-2 px-3 py-2 text-sm font-semibold transition-colors ${
            role === "dm"
              ? "border-marigold-600 bg-marigold-100 text-ink-950"
              : "border-ink-950/15 text-ink-950/60 hover:border-ink-950/30"
          }`}
        >
          Sign up as District Magistrate
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        {role === "contractor" ? (
          <>
            <Field label="Company Name" id="companyName">
              <input
                id="companyName"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={inputClass}
                placeholder="Sri Balaji Infra Projects"
              />
            </Field>
            <Field label="Registration Number" id="registrationNumber">
              <input
                id="registrationNumber"
                required
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className={inputClass}
                placeholder="REG-2024-00123"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="GST Number" id="gstNumber">
                <input
                  id="gstNumber"
                  required
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  className={inputClass}
                  placeholder="36ABCDE1234F1Z5"
                />
              </Field>
              <Field label="PAN Number" id="panNumber">
                <input
                  id="panNumber"
                  required
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  className={inputClass}
                  placeholder="ABCDE1234F"
                />
              </Field>
            </div>
            <Field label="Phone" id="contractorPhone">
              <input
                id="contractorPhone"
                type="tel"
                required
                value={contractorPhone}
                onChange={(e) => setContractorPhone(e.target.value)}
                className={inputClass}
                placeholder="9876543210"
              />
            </Field>
            <Field label="Email" id="contractorEmail">
              <input
                id="contractorEmail"
                type="email"
                required
                value={contractorEmail}
                onChange={(e) => setContractorEmail(e.target.value)}
                className={inputClass}
                placeholder="contact@company.com"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Password" id="contractorPassword">
                <input
                  id="contractorPassword"
                  type="password"
                  required
                  minLength={6}
                  value={contractorPassword}
                  onChange={(e) => setContractorPassword(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Confirm Password" id="contractorConfirm">
                <input
                  id="contractorConfirm"
                  type="password"
                  required
                  minLength={6}
                  value={contractorConfirm}
                  onChange={(e) => setContractorConfirm(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </>
        ) : (
          <>
            <Field label="Full Name" id="fullName">
              <input
                id="fullName"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
                placeholder="Dr. A. Sharma"
              />
            </Field>
            <Field label="District" id="district">
              <select
                id="district"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={inputClass}
              >
                <option value="" disabled>
                  Select a district
                </option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Email" id="dmEmail">
              <input
                id="dmEmail"
                type="email"
                required
                value={dmEmail}
                onChange={(e) => setDmEmail(e.target.value)}
                className={inputClass}
                placeholder="dm@example.com"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Password" id="dmPassword">
                <input
                  id="dmPassword"
                  type="password"
                  required
                  minLength={6}
                  value={dmPassword}
                  onChange={(e) => setDmPassword(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Confirm Password" id="dmConfirm">
                <input
                  id="dmConfirm"
                  type="password"
                  required
                  minLength={6}
                  value={dmConfirm}
                  onChange={(e) => setDmConfirm(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </>
        )}

        {error && (
          <p className="rounded-md bg-flagged-tint px-3 py-2 text-sm text-flagged">
            {error}
          </p>
        )}

        <Button type="submit" variant="marigold" className="mt-2 w-full">
          Create account
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-ink-950/60 transition-colors hover:text-marigold-600"
        >
          ← Back to sign in
        </button>
      </form>
    </>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}
