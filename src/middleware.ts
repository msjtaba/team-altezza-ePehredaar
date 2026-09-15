import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// trd.md §7 non-functional requirement: a contractor session must never
// reach /dm/* or /ministry, and vice versa, regardless of direct URL access.
const ROUTE_ROLES: Record<string, string> = {
  "/contractor": "contractor",
  "/dm": "dm",
  "/ministry": "ministry",
};

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    const matchedPrefix = Object.keys(ROUTE_ROLES).find((prefix) =>
      pathname.startsWith(prefix)
    );
    if (matchedPrefix && role !== ROUTE_ROLES[matchedPrefix] && role !== "admin") {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/contractor/:path*", "/dm/:path*", "/ministry/:path*"],
};
