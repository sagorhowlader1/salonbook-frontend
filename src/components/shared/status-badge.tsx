import { cn } from "cn"

type StatusTone = "success" | "warning" | "gold" | "neutral" | "danger" | "info"

const tones: Record<StatusTone, string> = {
  success:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  gold: "border-gold/40 bg-gold/10 text-gold",
  neutral: "border-border bg-muted text-muted-foreground",
  danger: "border-destructive/30 bg-destructive/10 text-destructive",
  info: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
}

const statusTone: Record<string, StatusTone> = {
  Confirmed: "success",
  Pending: "warning",
  Completed: "gold",
  Cancelled: "danger",
  Paid: "success",
  Refunded: "neutral",
  Active: "success",
  Suspended: "danger",
}

/** Pill badge that colours itself from a status string. */
export function StatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const tone = statusTone[status] ?? "neutral"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        tones[tone],
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </span>
  )
}
