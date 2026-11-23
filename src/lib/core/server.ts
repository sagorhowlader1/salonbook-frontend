
import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getSession = async () => {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  return session;
};
