import type { Config } from "tailwindcss";

// Design tokens sourced directly from design.md — do not redefine these
// per-component; every color/radius/type value the product uses should
// trace back to this file (design.md §12 "Color/Shape Consistency Lock").
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Brand — "Watchtower Navy" (design.md §3.1) — the ONLY accent color.
        navy: {
          50: "#F4F7FA",
          100: "#E3EAF2",
          300: "#8CA3BE",
          500: "#3E5C82",
          700: "#1E3A5F",
          900: "#10233F",
          950: "#0A1930",
        },

        // Semantic risk triad (design.md §3.3) — status/risk meaning ONLY,
        // never decorative, never a 4th tier. Identical on Persuade & Operate.
        healthy: {
          DEFAULT: "#15803D",
          tint: "#DCFCE7",
        },
        watch: {
          DEFAULT: "#B45309",
          tint: "#FEF3C7",
        },
        flagged: {
          DEFAULT: "#B91C1C",
          tint: "#FEE2E2",
        },

        // Persuade palette — "Civic Editorial" (design.md §3.0, v2, public
        // site only). Three accents with distinct jobs: indigo = structure,
        // marigold = primary action, teal = secondary/alternating accent.
        ink: {
          950: "#14142B",
          800: "#1E1E3F",
        },
        paper: {
          DEFAULT: "#FBF8F2",
          2: "#F3EDE0",
        },
        indigo: {
          700: "#26317A",
          500: "#3D4AA8",
        },
        marigold: {
          600: "#E08A2E",
          400: "#F0A73C",
          100: "#FCEACB",
        },
        teal: {
          700: "#0F6B62",
          100: "#D8F0EC",
        },

        // Untitled UI React brand scale (changes-2.md §1) — generated from
        // the site's real primary action color (marigold-600 / #E08A2E, the
        // brand hex confirmed for the Untitled UI setup), so the shared
        // component library's "brand" tokens map onto ePehredaar's own
        // palette rather than Untitled UI's default purple. Used only by
        // the Untitled UI-pattern primitives in src/components/untitled-ui/
        // and the pages built on them (Ministry Overview, Collusion) —
        // existing pages keep using navy/marigold/teal directly per the
        // Round-1 design lock.
        brand: {
          25: "#FEFAF4",
          50: "#FDF6EC",
          100: "#FCEACB",
          200: "#F8D49B",
          300: "#F3BC6D",
          400: "#F0A73C",
          500: "#E89A35",
          600: "#E08A2E",
          700: "#B96E20",
          800: "#8F5519",
          900: "#6B3F13",
          950: "#402509",
        },
      },
      boxShadow: {
        // Untitled UI's elevation scale, used by the card/chart-container
        // primitives — additive to Tailwind's defaults, not a replacement.
        "uui-xs": "0px 1px 2px rgba(16, 24, 40, 0.05)",
        "uui-sm": "0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px -1px rgba(16, 24, 40, 0.1)",
        "uui-md": "0px 4px 6px -1px rgba(16, 24, 40, 0.08), 0px 2px 4px -2px rgba(16, 24, 40, 0.04)",
        "uui-lg": "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
      },
      fontFamily: {
        // Operate surfaces (design.md §4.1, unchanged).
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
        // Persuade surfaces (design.md §4.1, v2).
        display: ["var(--font-anton)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        // Shape Consistency Lock (design.md §5): buttons/inputs = md,
        // cards/panels = lg, badges/pills = full. No other values.
        md: "6px",
        lg: "8px",
      },
      maxWidth: {
        dashboard: "1400px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(12px, -16px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        // design.md §6.2 — Persuade duration band (200-500ms interactions;
        // these ambient loops are the one documented exception, §6.3).
        marquee: "marquee 28s linear infinite",
        drift: "drift 7s ease-in-out infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
