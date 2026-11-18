import type { ReactNode } from "react"

import { AdminGate } from "@/components/dashboard/shared/AdminGate"
import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar"

/** Admin area shell: sidebar navigation + admin-only content gate. */
export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="admin" />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminGate>{children}</AdminGate>
      </div>
    </div>
  )
}
