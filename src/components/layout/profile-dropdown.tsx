"use client"

import Link from "next/link"
import { ChevronsUpDown, LayoutDashboard, LogOut } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ProfileDropdown() {
  const { user, signOut } = useAuth()
  if (!user) return null

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="rounded-full gap-2 pl-1"
            aria-label="Open profile menu"
          />
        }
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-[0.7rem] font-medium text-primary-foreground">
          {initials}
        </span>
        <span className="hidden text-sm sm:inline">{user.name}</span>
        <ChevronsUpDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-52" align="end" sideOffset={8}>
        <DropdownMenuLabel className="px-2 py-1.5">
          <p className="text-sm font-medium text-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground">
            {user.role === "salon_owner" ? "Salon owner" : "Customer"}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLinkItem render={<Link href="/dashboard" />}>
          <LayoutDashboard />
          Dashboard
        </DropdownMenuLinkItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut()
            // Auth context updates synchronously, so the navbar swaps to the
            // public links immediately when this fires.
            toast.add({
              title: "Signed out",
              description: "You have been signed out successfully.",
              type: "success",
            })
          }}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
