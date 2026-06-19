import * as React from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Typography } from "@/components/ui/Typography"
import { CustomCard } from "@/components/ui/CustomCard"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { CustomAvatar } from "@/components/ui/CustomAvatar"
import { EmptyState } from "@/components/ui/EmptyState"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { SkeletonPatterns } from "@/components/ui/Skeleton"
import { fmtMonth } from "@/lib/dashboard-utils"

interface UnpaidMembersListProps {
  unpaidMembersList: any[]
  isLoading: boolean
  className?: string
}

export function UnpaidMembersList({
  unpaidMembersList,
  isLoading,
  className,
}: UnpaidMembersListProps) {
  return (
    <AnimatedSection delay="600" className={className}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="size-8 rounded-lg bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="size-4 text-destructive" />
        </div>
        <Typography variant="h4" className="text-base font-semibold">
          Members Who Haven&apos;t Paid
        </Typography>
        {!isLoading && (
          <CustomBadge variant="rejected" className="text-[10px] px-1.5 py-0 font-semibold">
            {unpaidMembersList.length}
          </CustomBadge>
        )}
      </div>

      <CustomCard
        body={
          isLoading ? (
            <SkeletonPatterns.Table rows={5} />
          ) : unpaidMembersList.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="Everyone's paid this month 🎉"
              description="All active members have submitted their monthly deposits and have been approved."
            />
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {unpaidMembersList.map(({ member, status, lastPaidTime }) => {
                return (
                  <div
                    key={member._id}
                    className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CustomAvatar
                        initials={member.fullName
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">
                          {member.fullName}
                        </p>
                        <p className="text-[11px] text-muted-foreground/60">
                          {lastPaidTime > 0
                            ? `Last paid: ${fmtMonth(new Date(lastPaidTime).toISOString())}`
                            : "Never paid"}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {status === "pending" ? (
                        <CustomBadge variant="pending" className="text-[9px] px-2 py-0">
                          Pending Deposit
                        </CustomBadge>
                      ) : (
                        <CustomBadge variant="rejected" className="text-[9px] px-2 py-0">
                          No deposit yet
                        </CustomBadge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }
      />
    </AnimatedSection>
  )
}
