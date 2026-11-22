
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

import {
  ac,
  adminRole,
  customerRole,
} from "@/lib/permissions";

export const authClient = createAuthClient({
  // baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  baseURL: process.env.BETTER_AUTH_URL,

  plugins: [
    adminClient({
      ac,
      roles: {
        admin: adminRole,
        customer: customerRole,
      },
    }),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;