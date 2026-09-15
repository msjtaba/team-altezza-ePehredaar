import { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// tracker.md decision #4 — demo-only fixed-OTP bypass, no SMS/email provider.
// Matches prd.md §7's "no live KYC" assumption and trd.md's Credentials-only
// choice. Any account can also sign in with this code instead of a password.
export const DEMO_OTP = "123456";

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or phone", type: "text" },
        password: { label: "Password or OTP", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { phone: credentials.identifier },
            ],
          },
        });
        if (!user) return null;

        const otpMatch = credentials.password === DEMO_OTP;
        const passwordMatch =
          user.passwordHash &&
          (await bcrypt.compare(credentials.password, user.passwordHash));

        if (!otpMatch && !passwordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id;
      return session;
    },
  },
};
