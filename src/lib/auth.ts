
import { betterAuth } from "better-auth";
import dns from "node:dns";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin } from "better-auth/plugins";

import {
  ac,
  adminRole,
  customerRole,
} from "@/lib/permissions";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("salonbook");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET_ID as string,
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),

  plugins: [
    admin({
      ac,
      roles: {
        admin: adminRole,
        customer: customerRole,
      },
      defaultRole: "customer",
      bannedUserMessage:
        "Your account has been blocked. Please contact support.",
    }),
  ],
});