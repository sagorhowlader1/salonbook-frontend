
import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins";

import { auth } from "./auth"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.BETTER_AUTH_URL,
     plugins: [inferAdditionalFields<typeof auth>()],

})


export const { signIn, signUp, signOut, useSession } = authClient;













//import { createAuthClient } from "better-auth/react"
// import { inferAdditionalFields } from "better-auth/client/plugins"

// export const authClient = createAuthClient({
//   baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
//   plugins: [
//     inferAdditionalFields<{
//       user: {
//         role: "customer" | "admin"
//       }
//     }>(),
//   ],
// })

// export const { signIn, signUp, signOut, useSession } = authClient