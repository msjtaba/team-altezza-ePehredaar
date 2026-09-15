import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { SignInClient } from "./sign-in-client";

// Shared gateway into every authenticated surface (Contractor/DM/Ministry),
// now restyled to the Persuade design language (changes-3.md §4) to match
// /projects, /mp-allocations, /jan-pramaan — same paper/ink/marigold tokens
// and card conventions, in place of the old bespoke navy/slate "Operate"
// skin. Sign-in itself still goes through src/lib/auth.ts unchanged; this
// file also now sources the full district list (server-side, via Prisma —
// same pattern as src/app/projects/page.tsx / project-filters.tsx's "all
// districts" list) for the DM sign-up form's dropdown.
export default async function SignInPage() {
  const districts = await prisma.district.findMany({ select: { name: true } });
  const districtNames = Array.from(new Set(districts.map((d) => d.name))).sort();

  return (
    <Suspense>
      <SignInClient districts={districtNames} />
    </Suspense>
  );
}
