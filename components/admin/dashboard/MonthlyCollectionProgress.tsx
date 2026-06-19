import * as React from "react"
import { CustomCard } from "@/components/ui/CustomCard"
import { Typography } from "@/components/ui/Typography"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { CalendarDays } from "lucide-react"
import { fmtPKR } from "@/lib/dashboard-utils"

const MONTHLY_TARGET_PER_MEMBER = 5_000

interface MonthlyCollectionProgressProps {
  activeMembersCount: number
  monthlyTarget: number
  thisMonthCollected: number
  progressPct: number
  thisMonthDepositsCount: number
}

export function MonthlyCollectionProgress({
  activeMembersCount,
  monthlyTarget,
  thisMonthCollected,
  progressPct,
  thisMonthDepositsCount,
}: MonthlyCollectionProgressProps) {
  const now = new Date()

  return (
    <AnimatedSection delay="200">
      <CustomCard
        body={
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-primary" />
                  <Typography variant="h4" className="text-base font-semibold">
                    This Month&apos;s Collection
                  </Typography>
                </div>
                <Typography variant="muted" className="text-xs">
                  {now.toLocaleDateString("en-PK", {
                    month: "long",
                    year: "numeric",
                  })}
                  &nbsp;· Target PKR {monthlyTarget.toLocaleString()} (
                  {activeMembersCount} members × PKR{" "}
                  {MONTHLY_TARGET_PER_MEMBER.toLocaleString()})
                </Typography>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  PKR {fmtPKR(thisMonthCollected)}
                </p>
                <p className="text-xs text-muted-foreground">
                  of PKR {fmtPKR(monthlyTarget)} target
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="relative h-3 w-full rounded-full bg-muted/50 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${progressPct}%`,
                    background:
                      "linear-gradient(90deg, var(--primary) 0%, var(--chart-4) 100%)",
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {progressPct}% collected
                </span>
                <span>
                  {thisMonthDepositsCount} deposit
                  {thisMonthDepositsCount !== 1 ? "s" : ""} approved
                </span>
              </div>
            </div>
          </div>
        }
      />
    </AnimatedSection>
  )
}
