import { Inbox, TriangleAlert } from "lucide-react"
import { cn } from "cn"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

type StateBlockProps = {
  state: "loading" | "empty" | "error"
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

const defaults = {
  loading: { title: "Loading…", description: "Fetching the latest data." },
  empty: {
    title: "Nothing here yet",
    description: "Items will appear here once they're available.",
  },
  error: {
    title: "Something went wrong",
    description: "We couldn't load this content. Please try again.",
  },
} as const

/**
 * Reusable loading / empty / error state for lists, tables and pages.
 */
export function StateBlock({
  state,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: StateBlockProps) {
  const fallback = defaults[state]

  return (
    <div
      role={state === "error" ? "alert" : "status"}
      className={cn(
        "flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center",
        className
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-gold/10 text-gold">
        {state === "loading" ? (
          <Spinner className="size-5" />
        ) : state === "error" ? (
          <TriangleAlert className="size-5" />
        ) : (
          <Inbox className="size-5" />
        )}
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">
          {title ?? fallback.title}
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {description ?? fallback.description}
        </p>
      </div>
      {state === "error" && actionLabel && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
          className="rounded-full"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
