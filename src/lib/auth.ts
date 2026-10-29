import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@cr7office.ir" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Try to find user in database
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase().trim() },
          });

          if (user) {
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (isValid) {
              return {
                id: user.id,
                name: user.name || "CR7 Admin",
                email: user.email,
                role: user.role,
              };
            }
          }
        } catch (dbError) {
          console.error("Auth DB lookup error, testing fallback:", dbError);
        }

        // Emergency fallback master admin credential
        if (
          credentials.email.toLowerCase().trim() === "admin@cr7office.ir" &&
          credentials.password === "siuuu2026"
        ) {
          return {
            id: "master-admin-01",
            name: "Master Admin",
            email: "admin@cr7office.ir",
            role: "ADMIN",
          };
        }

        // Editor fallback
        if (
          credentials.email.toLowerCase().trim() === "editor@cr7office.ir" &&
          credentials.password === "siuuu2026"
        ) {
          return {
            id: "master-editor-01",
            name: "Content Editor",
            email: "editor@cr7office.ir",
            role: "EDITOR",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "ADMIN";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role || "ADMIN";
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "cr7-tribute-ultra-secure-key-2026-production",
};
