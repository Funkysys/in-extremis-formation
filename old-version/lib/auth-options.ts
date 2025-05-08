import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Discord from "next-auth/providers/discord";
import Resend from "next-auth/providers/resend";

import prisma from "@/lib/connect";
import type { Adapter } from "next-auth/adapters";

export const authOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Discord({
      clientId:
        process.env.DISCORD_ID ??
        (() => {
          throw new Error("DISCORD_SECRET is not defined");
        })(),
      clientSecret:
        process.env.DISCORD_SECRET ??
        (() => {
          throw new Error("DISCORD_SECRET is not defined");
        })(),
    }),

    Resend({
      normalizeIdentifier(identifier: string): string {
        const [local, domain] = identifier.toLowerCase().trim().split("@");

        const new_domain = domain.split(",")[0];

        if (identifier.split("@").length > 2) {
          throw new Error("Only one email allowed");
        }
        return `${local}@${new_domain}`;
      },
    }),
  ],
};

export default authOptions;
