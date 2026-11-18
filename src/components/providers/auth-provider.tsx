
"use client"

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react"

import { authClient } from "@/lib/auth-client"

export type UserRole = "customer" | "admin"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthContextValue {
  user: AuthUser | null
  isPending: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession()

  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role:
          (session.user as { role?: UserRole }).role ?? "customer",
      }
    : null

  const signOut = useCallback(async () => {
    await authClient.signOut()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isPending, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within <AuthProvider>")
  }

  return context
}
