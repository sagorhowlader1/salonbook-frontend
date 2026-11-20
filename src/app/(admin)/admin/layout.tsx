import type { ReactNode } from "react"
import { Suspense } from "react"

import { AdminGate } from "@/components/dashboard/shared/AdminGate"
import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar"
export const instant = false
/** Admin area shell: sidebar navigation + admin-only content gate. */
export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={<div className="w-64 shrink-0" />}>
        <DashboardSidebar role="admin" />
      </Suspense>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminGate>{children}</AdminGate>
      </div>
    </div>
  )
}
