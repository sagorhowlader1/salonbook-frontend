"use client"

import * as React from "react"
import { Menu } from "@base-ui/react/menu"
import { cn } from "cn"

const DropdownMenu = Menu.Root
const DropdownMenuTrigger = Menu.Trigger

function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof Menu.Positioner> & { className?: string }) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        className="z-50 max-h-[var(--available-height)] outline-hidden"
        sideOffset={sideOffset}
        {...props}
      >
        <Menu.Popup
          className={cn(
            "relative min-w-[9rem] origin-[var(--transform-origin)] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md transition-[scale,opacity] duration-100 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
            className
          )}
        >
          {props.children}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  )
}

const itemClasses =
  "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden transition-colors select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof Menu.Item>) {
  return <Menu.Item className={cn(itemClasses, className)} {...props} />
}

function DropdownMenuLinkItem({
  className,
  ...props
}: React.ComponentProps<typeof Menu.LinkItem>) {
  return (
    <Menu.LinkItem closeOnClick className={cn(itemClasses, className)} {...props} />
  )
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator(props: React.ComponentProps<typeof Menu.Separator>) {
  return <Menu.Separator className="-mx-1 my-1 h-px bg-border" {...props} />
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
}
