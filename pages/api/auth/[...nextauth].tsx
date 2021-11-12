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

        if (!user) throw new Error("User doesn't exist");

        const allow = await compare(password, user.password);

        if (allow) return user;
        else throw new Error("Incorrect password");
      },
    }),
  ],
  callbacks: {
    redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      // Allows relative callback URLs
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    jwt: true,
  },
  jwt: {
    encryption: true,
    secret: process.env.JWT_SECRET,
    signingKey: process.env.JWT_SIGNING_KEY,
    encryptionKey: process.env.JWT_ENCRYPTION_KEY,
  },
});
