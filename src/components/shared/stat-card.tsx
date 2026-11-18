import type { LucideIcon } from "lucide-react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "cn"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  delta?: string
  trend?: "up" | "down"
}

export function StatCard({ label, value, icon: Icon, delta, trend = "up" }: StatCardProps) {
  return (
    <Card className="gap-3 py-5">
      <CardContent className="flex items-start justify-between gap-3 px-5">
        <div className="space-y-1.5">
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            {label}
          </p>
          <p className="font-heading text-2xl font-semibold text-foreground">
            {value}
          </p>
          {delta && (
            <p
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
              )}
            >
              {trend === "up" ? (
                <TrendingUp className="size-3.5" />
              ) : (
                <TrendingDown className="size-3.5" />
              )}
              {delta}
            </p>
          )}
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  )
}
