import { prisma } from "@lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

const CredentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export default NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const { username, password } = CredentialsSchema.parse(credentials);
        const user = await prisma.user.findUnique({
          where: {
            username: username.trim(),
          },
        });

        if (!user) return null;

        const allow = await compare(password, user.password);

        if (allow) return user;
        else return null;
      },
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
    }),
  ],
  callbacks: {
    redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
    session({ session, token }) {
      if (token) {
        session.user = {
          sub: token.sub,
          full_name: token.full_name,
          username: token.username,
          role: token.role,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.full_name = user.full_name;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
