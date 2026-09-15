import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Untitled UI React's standard class-merge helper (clsx + tailwind-merge).
// Used by the src/components/untitled-ui/* primitives introduced for the
// Ministry Overview + Collusion page restyle (changes-2.md §1).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
