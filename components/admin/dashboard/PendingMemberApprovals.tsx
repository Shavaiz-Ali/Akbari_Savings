import * as React from "react"
import { AlertCircle, UserCheck, Check, X } from "lucide-react"
import { Typography } from "@/components/ui/Typography"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { CustomAvatar } from "@/components/ui/CustomAvatar"
import { CustomButton } from "@/components/ui/CustomButton"
import { EmptyState } from "@/components/ui/EmptyState"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { SkeletonPatterns } from "@/components/ui/Skeleton"
import { UrgentCard } from "./UrgentCard"
import { fmtDate } from "@/lib/dashboard-utils"
import { IMemberUser } from "@/services/memberService/api"

interface PendingMemberApprovalsProps {
  pendingMembers: IMemberUser[]
  loadingPending: boolean
  onApprove: (user: { id: string; name: string }) => void
  onReject: (id: string) => void
}

export function PendingMemberApprovals({
  pendingMembers,
  loadingPending,
  onApprove,
  onReject,
}: PendingMemberApprovalsProps) {
  return (
    <AnimatedSection delay="300" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="size-4 text-destructive" />
          </div>
          <Typography variant="h4" className="text-base font-semibold">
            Pending Member Approvals
          </Typography>
          {!loadingPending && (
            <CustomBadge variant="pending">
              {pendingMembers.length}
            </CustomBadge>
          )}
        </div>
      </div>

      {loadingPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonPatterns.Card />
          <SkeletonPatterns.Card />
        </div>
      ) : pendingMembers.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="All caught up!"
          description="No signup requests waiting — every application has been processed."
          delay="300"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingMembers.map((user) => (
            <UrgentCard
              key={user._id}
              accentClass="bg-destructive/60"
            >
              <div className="flex items-center gap-3">
                <CustomAvatar
                  initials={user.fullName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                  <p className="text-[11px] text-muted-foreground/50 mt-0.5">
                    Signed up {fmtDate(user.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <CustomButton
                    size="sm"
                    className="gap-1 h-8 px-3 text-xs"
                    onClick={() =>
                      onApprove({ id: user._id, name: user.fullName })
                    }
                  >
                    <Check className="size-3.5" />
                    Approve
                  </CustomButton>
                  <CustomButton
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 gap-1 h-8 px-2 text-xs"
                    onClick={() => onReject(user._id)}
                  >
                    <X className="size-3.5" />
                    Reject
                  </CustomButton>
                </div>
              </div>
            </UrgentCard>
          ))}
        </div>
      )}
    </AnimatedSection>
  )
}
