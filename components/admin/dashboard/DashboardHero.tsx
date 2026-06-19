import * as React from "react"
import { cn } from "@/lib/utils"
import { Typography } from "@/components/ui/Typography"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { PiggyBank, Clock, AlertCircle, Users } from "lucide-react"

interface DashboardHeroProps {
  totalSavings: number
  activeMembersCount: number
  pendingDepositsCount: number
  pendingMembersCount: number
  isLoading: boolean
}

export function DashboardHero({
  totalSavings,
  activeMembersCount,
  pendingDepositsCount,
  pendingMembersCount,
  isLoading,
}: DashboardHeroProps) {
  return (
    <AnimatedSection direction="none" delay="100">
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden border border-border/30",
          "bg-gradient-to-br from-primary/10 via-card to-secondary/20",
          "dark:from-primary/15 dark:via-card dark:to-secondary/10",
          "shadow-lg p-8 md:p-10"
        )}
      >
        {/* Decorative blob */}
        <div
          className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/3 size-48 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, var(--chart-4) 0%, transparent 70%)",
          }}
        />

        <div className="relative flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
          {/* Total savings */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary/70">
                <PiggyBank className="size-3.5" />
                Total Platform Savings
              </span>
            </div>
            {isLoading ? (
              <div className="h-14 w-64 rounded-xl bg-muted/40 animate-pulse" />
            ) : (
              <Typography
                variant="h1"
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground font-mono"
              >
                PKR{" "}
                <span className="text-primary">
                  {totalSavings.toLocaleString()}
                </span>
              </Typography>
            )}
            <Typography variant="muted" className="text-sm mt-1">
              Across {activeMembersCount} active member
              {activeMembersCount !== 1 ? "s" : ""} · All time
            </Typography>
          </div>

          {/* Quick stat pills */}
          <div className="flex flex-wrap gap-3 md:ml-auto">
            {[
              {
                label: "Pending Deposits",
                value: pendingDepositsCount,
                icon: Clock,
                urgent: pendingDepositsCount > 0,
              },
              {
                label: "Pending Signups",
                value: pendingMembersCount,
                icon: AlertCircle,
                urgent: pendingMembersCount > 0,
              },
              {
                label: "Active Members",
                value: activeMembersCount,
                icon: Users,
                urgent: false,
              },
            ].map((pill) => (
              <div
                key={pill.label}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-4 py-2.5 backdrop-blur-sm",
                  "bg-card/70 shadow-sm transition-all duration-200",
                  pill.urgent
                    ? "border-destructive/30 text-destructive"
                    : "border-border/40 text-foreground"
                )}
              >
                <pill.icon className="size-4 shrink-0 opacity-80" />
                <span className="text-xl font-bold">{pill.value}</span>
                <span className="text-xs text-muted-foreground leading-tight max-w-[70px]">
                  {pill.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
