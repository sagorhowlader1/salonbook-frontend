"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Scissors } from "lucide-react"
import { cn } from "cn"
import { useAuth } from "@/components/providers/auth-provider"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Button } from "@/components/ui/button"
import { ProfileDropdown } from "@/components/layout/profile-dropdown"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
] as const

const authedLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services Details" },
  // { href: "/dashboard", label: "Dashboard" },
] as const

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {label}
    </Link>
  )
}

export function Navbar() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="sm:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={8}>
              {(user ? authedLinks : publicLinks).map((link) => (
                <DropdownMenuLinkItem
                  key={link.href}
                  render={<Link href={link.href} />}
                >
                  {link.label}
                </DropdownMenuLinkItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/"
            aria-label="SalonBook home"
            className="flex items-center gap-2 font-semibold text-foreground"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Scissors className="size-4" />
            </span>
            SalonBook
          </Link>
        </div>

        <nav className="hidden items-center gap-1 sm:flex">
          {(user ? authedLinks : publicLinks).map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <ProfileDropdown />
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                nativeButton={false}
                render={<Link href="/signin" />}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                nativeButton={false}
                render={<Link href="/signup" />}
                className="rounded-full bg-linear-to-r from-gold-light to-gold font-semibold text-black hover:brightness-105"
              >
                Sign Up
              </Button>

            </>
          )}
        </div>
      </div>
    </header>
  )
}
