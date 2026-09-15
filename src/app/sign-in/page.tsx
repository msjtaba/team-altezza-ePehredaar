"use client";

import { Suspense, useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

// Shared gateway into every authenticated surface (Contractor/DM/Ministry).
// Styled neutrally — Inter/navy (design.md §1.1's Operate system) rather
// than the public site's Persuade skin, since this page's job is a fast,
// unambiguous credential check, not brand storytelling.
export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
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
    const callbackUrl = params.get("callbackUrl") ?? "/";
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-slate-50 px-6 font-sans">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-navy-950">Sign in</h1>
        <p className="mt-1 text-sm text-slate-600">
          Contractor, District Magistrate, and Ministry accounts.
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="identifier" className="text-sm font-medium text-slate-700">
              Email or phone
            </label>
            <input
              id="identifier"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-navy-950 outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
              placeholder="dm@example.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password or OTP
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-navy-950 outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
              placeholder="password123"
            />
            <p className="text-xs text-slate-500">
              Demo build: the OTP <span className="font-mono">123456</span>{" "}
              also works for any account.
            </p>
          </div>

          {error && (
            <p className="rounded-md bg-flagged-tint px-3 py-2 text-sm text-flagged">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500">
          <p className="font-medium text-slate-600">Demo accounts:</p>
          <p className="mt-1 font-mono">dm@example.com · dm</p>
          <p className="font-mono">ministry@example.com · ministry</p>
          <p className="font-mono">bharat.infra.developers@example.com · contractor</p>
        </div>
      </div>
    </main>
  );
}
