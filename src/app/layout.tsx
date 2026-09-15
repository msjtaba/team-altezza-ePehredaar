import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Anton, Playfair_Display, Nunito } from "next/font/google";
import { AuthSessionProvider } from "@/components/session-provider";
import "./globals.css";

// design.md §4.1 — two font systems by surface mode.
// Operate (dashboards): Inter + IBM Plex Mono, unchanged from v1.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Persuade (public site): Anton (display) + Playfair Display (editorial
// accents) + Nunito (body) — explicit v2 brief. Self-hosted via next/font
// rather than a runtime <link>, per design.md §12.
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MPLADS AI Watchdog",
  description:
    "See where the money went — and prove it, on the ground. An oversight layer for MPLADS fund allocation, procurement, and citizen-verified project delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${plexMono.variable} ${anton.variable} ${playfair.variable} ${nunito.variable} font-body antialiased`}
      >
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
