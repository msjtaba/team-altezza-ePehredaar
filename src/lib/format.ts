/**
 * Money formatting helpers — design.md's "Money is real INR" rule.
 * Sanctioned/billed/payment amounts are stored in raw rupees; MP allocation
 * figures are stored already converted to ₹ Crore (data.md §1). Never dump
 * a raw number — always run it through one of these.
 */

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Raw rupees -> "₹56,56,600" (Indian digit grouping via Intl en-IN). */
export function formatRupees(amount: number | string | { toString(): string }): string {
  const n = typeof amount === "object" ? Number(amount.toString()) : Number(amount);
  if (!Number.isFinite(n)) return "—";
  return rupeeFormatter.format(n);
}

/** Raw rupees -> "₹56.6 L" (lakh-shorthand, matches data.md §2's payment figures). */
export function formatLakhShort(amount: number | string | { toString(): string }): string {
  const n = typeof amount === "object" ? Number(amount.toString()) : Number(amount);
  if (!Number.isFinite(n)) return "—";
  const lakhs = n / 100000;
  return `₹${lakhs.toFixed(lakhs < 10 ? 1 : 0)} L`;
}

/** Already-in-Crore decimal -> "₹19.03 Cr" (MP allocation figures, data.md §1). */
export function formatCrore(amount: number | string | { toString(): string } | null): string {
  if (amount === null) return "Not available in source";
  const n = typeof amount === "object" ? Number(amount.toString()) : Number(amount);
  if (!Number.isFinite(n)) return "Not available in source";
  return `₹${n.toFixed(2)} Cr`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
