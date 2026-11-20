import { betterAuth } from "better-auth";
import dns from "node:dns"; 
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"])


const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("salonbook");

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
      google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_SECRET_ID as string, 
        }, 
    },

    user: {
        additionalFields: {
          role: {
              type: ["admin", "customer"],
              input: false,
              defaultValue: "customer"
          }
        }
    },
  database: mongodbAdapter(db, {
    client,
  }),
});