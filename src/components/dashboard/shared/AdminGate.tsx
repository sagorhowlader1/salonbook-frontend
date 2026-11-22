"use client"

import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

import { useAuth } from "@/components/providers/auth-provider"
import { StateBlock } from "@/components/shared/state-block"

const container = "mx-auto w-full max-w-3xl px-4 pt-20 pb-14 lg:pt-14"


export function AdminGate({ children }: { children: ReactNode }) {
  const { user, isPending } = useAuth()
  const router = useRouter()

  if (isPending) {
    return (
      <div className={container}>
        <StateBlock
          state="loading"
          title="Checking access"
          description="Verifying your admin permissions…"
        />
      </div>
    )
  }

  if (!user) {
    return (
      <div className={container}>
        <StateBlock
          state="error"
          title="Admin access required"
          description="Sign in with an admin account to manage services."
          actionLabel="Sign In"
          onAction={() => router.push("/signin")}
        />
      </div>
    )
  }

  if (user.role !== "admin") {
    return (
      <div className={container}>
        <StateBlock
          state="error"
          title="Admins only"
          description="Your account doesn't have permission to manage services."
          actionLabel="Back to Dashboard"
          onAction={() => router.push("/dashboard")}
        />
      </div>
    )
  }

  return <>{children}</>
}
