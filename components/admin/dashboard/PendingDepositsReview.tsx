import * as React from "react"
import { Coins } from "lucide-react"
import { Typography } from "@/components/ui/Typography"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { UrgentCard } from "./UrgentCard"
import { fmtMonth, timeAgo } from "@/lib/dashboard-utils"
import { IDeposit } from "@/services/depositService/api"

interface PendingDepositsReviewProps {
  pendingDeposits: IDeposit[]
  loadingDeposits: boolean
}

export function PendingDepositsReview({
  pendingDeposits,
  loadingDeposits,
}: PendingDepositsReviewProps) {
  if (loadingDeposits || pendingDeposits.length === 0) return null

  return (
    <AnimatedSection delay="400" className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Coins className="size-4 text-primary" />
        </div>
        <Typography variant="h4" className="text-base font-semibold">
          Deposits Awaiting Review
        </Typography>
        <CustomBadge variant="pending">{pendingDeposits.length}</CustomBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {pendingDeposits.slice(0, 6).map((dep) => (
          <UrgentCard key={dep._id} accentClass="bg-primary/60">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-foreground text-sm truncate">
                  {dep.userId?.fullName ?? "—"}
                </span>
                <CustomBadge variant="pending">pending</CustomBadge>
              </div>
              <div className="flex items-end justify-between gap-2">
                <div>
                  <p className="text-xl font-bold text-primary font-mono">
                    PKR {dep.amount.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    For {fmtMonth(dep.month)}
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground/50">
                  {timeAgo(dep.createdAt)}
                </p>
              </div>
            </div>
          </UrgentCard>
        ))}
      </div>

      {pendingDeposits.length > 6 && (
        <p className="text-xs text-muted-foreground text-center pt-1">
          +{pendingDeposits.length - 6} more deposits on the Deposits page
        </p>
      )}
    </AnimatedSection>
  )
}
