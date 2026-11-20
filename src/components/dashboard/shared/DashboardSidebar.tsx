"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
    CalendarCheck,
    CreditCard,
    LayoutDashboard,
    LogIn,
    LogOut,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    Plus,
    Scissors,
    User,
    Users,
    X,
} from "lucide-react"
import { cn } from "cn"

import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import { useSession } from "@/lib/auth-client"

/* ------------------------------------------------------------------ */
/* Navigation model                                                     */
/* ------------------------------------------------------------------ */

export interface NavItem {
    href: string
    label: string
    icon: LucideIcon
}

export interface NavGroup {
    label?: string
    items: NavItem[]
}

export type SidebarRole = "customer" | "admin"

const navByRole: Record<SidebarRole, NavGroup[]> = {
    customer: [
        {
            label: "General",
            items: [
                { href: "/dashboard", label: "Overview", icon: LayoutDashboard },

                {
                    href: "/dashboard/appointments",
                    label: "My Appointments",
                    icon: CalendarCheck,
                },
            ],
        },
        {
            label: "Account",
            items: [
                {
                    href: "/dashboard/profile",
                    label: "My Profile",
                    icon: User
                }
            ],
        },
    ],

    admin: [
        {
            label: "General",
            items: [
                { href: "/admin", label: "Overview", icon: LayoutDashboard },
                {
                    href: "/admin/appointments",
                    label: "Manage Appointments",
                    icon: CalendarCheck,
                },
                { href: "/admin/users", label: "Manage Users", icon: Users },
            ],
        },
        {
            label: "Catalogue",
            items: [
                { href: "/admin/services", label: "Manage Services", icon: Scissors },
                { href: "/admin/services/new", label: "Add Service", icon: Plus },
            ],
        },
        {
            label: "Finance",
            items: [
                { href: "/admin/transactions", label: "Transactions", icon: CreditCard },
            ],
        },
        {
            label: "Account",
            items: [{ href: "/admin/profile", label: "My Profile", icon: User }],
        },
    ],
}

const roleLabels: Record<SidebarRole, string> = {
    customer: "Customer",
    admin: "Admin",
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export interface DashboardSidebarProps {
    /**
     * Which nav set to show. Defaults to the signed-in user's role
     * (falls back to "customer" while signed out).
     */
    role?: SidebarRole
    /** Desktop collapse state (controlled). */
    collapsed?: boolean
    /** Initial desktop collapse state (uncontrolled). */
    defaultCollapsed?: boolean
    onCollapsedChange?: (collapsed: boolean) => void
    /** Mobile drawer state (controlled). */
    open?: boolean
    /** Initial mobile drawer state (uncontrolled). */
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    className?: string
}

/**
 * Premium dashboard sidebar modelled on the shadcn/ui Sidebar pattern:
 *
 *  - `SidebarHeader`   — brand + role badge (mobile close button)
 *  - `SidebarContent`  — grouped navigation with active gold highlight
 *  - `SidebarFooter`   — account card, sign-out, collapse toggle
 *
 * Layout behaviour:
 *  - Desktop: sticky full-height rail that collapses to an icon-only
 *    column (toggle lives in the footer).
 *  - Mobile: off-canvas drawer with backdrop, opened by a floating
 *    trigger button. The trigger is only rendered while the drawer state
 *    is uncontrolled — pass `open` + `onOpenChange` to drive it from
 *    your own topbar instead.
 */
const DashboardSidebar = ({
    role,
    collapsed: collapsedProp,
    defaultCollapsed = false,
    onCollapsedChange,
    open: openProp,
    defaultOpen = true,
    onOpenChange,
    className,
}: DashboardSidebarProps) => {
    const pathname = usePathname()
    const { user, isPending, signOut } = useAuth()

    /* --- controllable state (controlled prop wins over internal state) --- */

    const isCollapsedControlled = collapsedProp !== undefined
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
    const collapsed = isCollapsedControlled ? collapsedProp : internalCollapsed

    const setCollapsed = useCallback(
        (next: boolean) => {
            if (!isCollapsedControlled) setInternalCollapsed(next)
            onCollapsedChange?.(next)
        },
        [isCollapsedControlled, onCollapsedChange]
    )

    const isOpenControlled = openProp !== undefined
    const [internalOpen, setInternalOpen] = useState(defaultOpen)
    const open = isOpenControlled ? openProp : internalOpen

    const setOpen = useCallback(
        (next: boolean) => {
            if (!isOpenControlled) setInternalOpen(next)
            onOpenChange?.(next)
        },
        [isOpenControlled, onOpenChange]
    )

    /* --- close the drawer on navigation (render-phase state adjustment,
           only valid while we own the state) --- */

    const [lastPathname, setLastPathname] = useState(pathname)
    if (lastPathname !== pathname) {
        setLastPathname(pathname)
        if (!isOpenControlled && internalOpen) setInternalOpen(false)
    }

    /* --- Escape closes the drawer; body scroll locks while it's open;
           crossing back to desktop width closes it too --- */

    useEffect(() => {
        if (!open) return

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false)
        }
        window.addEventListener("keydown", onKeyDown)

        const desktop = window.matchMedia("(min-width: 1024px)")
        const onViewportChange = () => {
            if (desktop.matches) setOpen(false)
        }
        desktop.addEventListener("change", onViewportChange)

        // Lock scroll only when the drawer is actually an overlay.
        const shouldLock = !desktop.matches
        const previousOverflow = document.body.style.overflow
        if (shouldLock) document.body.style.overflow = "hidden"

        return () => {
            window.removeEventListener("keydown", onKeyDown)
            desktop.removeEventListener("change", onViewportChange)
            if (shouldLock) document.body.style.overflow = previousOverflow
        }
    }, [open, setOpen])

    /* --- account --- */

    const {data: session} = useSession();
    const sessionRole = session?.user?.role;


    // const activeRole: SidebarRole =  "customer"
    const activeRole: SidebarRole =  sessionRole === "admin" ? "admin" : "customer"
    const groups = navByRole[activeRole]

   
    const initials = user
        ? user.name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : "SB"

    const handleSignOut = () => {
        void signOut()
        toast.add({
            title: "Signed out",
            description: "You have been signed out successfully.",
            type: "success",
        })
        setOpen(false)
    }

    return (
        <>
            {/* Mobile trigger — only while the drawer state is uncontrolled */}
            {!isOpenControlled && (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Open menu"
                    className="fixed top-4 left-4 z-30 flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground shadow-lg transition-colors hover:bg-muted lg:hidden"
                >
                    <Menu />
                </button>
            )}

            {/* Backdrop */}
            {open && (
                <div
                    aria-hidden
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside
                className={cn(
                    // Shell: off-canvas drawer on mobile, sticky rail on desktop.
                    "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col overflow-hidden border-r border-white/10 bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
                    "lg:sticky lg:bottom-auto lg:top-0 lg:z-auto lg:h-screen lg:shadow-none",
                    open ? "translate-x-0" : "-translate-x-full invisible lg:visible",
                    "lg:translate-x-0",
                    collapsed && "lg:w-[4.5rem]",
                    className
                )}
            >
                {/* ---------------- Header ---------------- */}
                <div
                    className={cn(
                        "relative flex items-center gap-3 border-b border-white/10 px-4 py-4",
                        collapsed && "justify-center px-3"
                    )}
                >
                    <Link
                        href="/"
                        aria-label="SalonBook home"
                        className="group flex min-w-0 items-center gap-3"
                    >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-gold-light to-gold text-black transition-transform group-hover:scale-105">
                            <Scissors className="size-4.5" />
                        </span>
                        {!collapsed && (
                            <span className="flex min-w-0 flex-col">
                                <span className="font-heading text-lg leading-none font-semibold text-white">
                                    SalonBook
                                </span>
                                <span className="mt-1 text-[0.65rem] font-medium tracking-[0.18em] text-gold uppercase">
                                    {roleLabels[activeRole]}
                                </span>
                            </span>
                        )}
                    </Link>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                        className="absolute right-2 rounded-full text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
                    >
                        <X />
                    </Button>
                </div>

                {/* ---------------- Content ---------------- */}
                <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
                    {groups.map((group) => (
                        <div key={group.label ?? "nav"} className="space-y-1.5">
                            {group.label && !collapsed && (
                                <p className="px-3 text-[0.65rem] font-semibold tracking-[0.18em] text-white/40 uppercase">
                                    {group.label}
                                </p>
                            )}
                            {group.items.map((item) => {
                                const active = pathname === item.href
                                const Icon = item.icon

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        aria-current={active ? "page" : undefined}
                                        title={collapsed ? item.label : undefined}
                                        className={cn(
                                            "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                                            collapsed && "justify-center px-0",
                                            active
                                                ? "bg-gold/15 text-gold"
                                                : "text-white/65 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        {active && !collapsed && (
                                            <span
                                                aria-hidden
                                                className="absolute inset-y-2 -left-3 w-1 rounded-r-full bg-linear-to-b from-gold-light to-gold"
                                            />
                                        )}
                                        <Icon
                                            className={cn(
                                                "size-4.5 shrink-0 transition-colors",
                                                active
                                                    ? "text-gold"
                                                    : "text-white/45 group-hover:text-gold"
                                            )}
                                        />
                                        {!collapsed && (
                                            <span className="flex-1 truncate">{item.label}</span>
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    ))}
                </nav>

                {/* ---------------- Footer ---------------- */}
                <div className="space-y-2 border-t border-white/10 p-3">
                    {isPending ? (
                        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
                            <Skeleton className="size-9 rounded-full" />
                            {!collapsed && (
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-3.5 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            )}
                        </div>
                    ) : user ? (
                        <div
                            className={cn(
                                "flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5",
                                collapsed && "flex-col gap-2 px-2 py-3"
                            )}
                        >
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-gold-light to-gold text-xs font-semibold text-black">
                                {initials}
                            </span>

                            {!collapsed && (
                                <>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-white">
                                            {user.name}
                                        </p>
                                        <p className="truncate text-xs text-white/50">
                                            {user.email}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Log out"
                                        onClick={handleSignOut}
                                        className="rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                                    >
                                        <LogOut />
                                    </Button>
                                </>
                            )}

                            {collapsed && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    aria-label="Log out"
                                    onClick={handleSignOut}
                                    className="rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                                >
                                    <LogOut />
                                </Button>
                            )}
                        </div>
                    ) : (
                        <Button
                            nativeButton={false}
                            render={<Link href="/signin" />}
                            className={cn(
                                "w-full rounded-full bg-linear-to-r from-gold-light to-gold font-semibold text-black hover:brightness-105",
                                collapsed && "px-0"
                            )}
                        >
                            {collapsed ? <LogIn /> : "Sign In"}
                        </Button>
                    )}

                    {/* Collapse toggle (desktop only) */}
                    <button
                        type="button"
                        onClick={() => setCollapsed(!collapsed)}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className={cn(
                            "hidden w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white lg:flex",
                            collapsed && "justify-center px-0"
                        )}
                    >
                        {collapsed ? (
                            <PanelLeftOpen className="size-4.5" />
                        ) : (
                            <>
                                <PanelLeftClose className="size-4.5" />
                                <span>Collapse</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>
        </>
    )
}

export default DashboardSidebar
