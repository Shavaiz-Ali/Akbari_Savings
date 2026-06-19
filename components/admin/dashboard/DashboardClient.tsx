"use client"

import * as React from "react"
import { STATUSES } from "@/lib/constants"
import {
  useActiveMembers,
  usePendingMembers,
  useApproveMember,
  useRejectMember,
} from "@/services/memberService/hooks"
import { useDeposits } from "@/services/depositService/hooks"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"

// Sub-components
import { DashboardHero } from "./DashboardHero"
import { MonthlyCollectionProgress } from "./MonthlyCollectionProgress"
import { PendingMemberApprovals } from "./PendingMemberApprovals"
import { PendingDepositsReview } from "./PendingDepositsReview"
import { ActivityFeed } from "./ActivityFeed"
import { UnpaidMembersList } from "./UnpaidMembersList"

// Hooks
import { useUnpaidMembersList, useUnifiedActivityFeed } from "@/lib/dashboard-hooks"

const MONTHLY_TARGET_PER_MEMBER = 5_000

export function DashboardClient() {
  const [isApproveOpen, setIsApproveOpen] = React.useState(false)
  const [processingUser, setProcessingUser] = React.useState<{
    id: string
    name: string
  } | null>(null)

  const { data: activeData, isLoading: loadingActive } = useActiveMembers()
  const { data: pendingData, isLoading: loadingPending } = usePendingMembers()
  const { data: depositsData, isLoading: loadingDeposits } = useDeposits({
    status: undefined,
  })

  const activeMembers: any[] = activeData?.data ?? []
  const pendingMembers: any[] = pendingData?.data ?? []
  const allDeposits: any[] = depositsData?.data ?? []

  const approveMember = useApproveMember()
  const rejectMember = useRejectMember()

  const handleApprove = (user: { id: string; name: string }) => {
    setProcessingUser(user)
    setIsApproveOpen(true)
  }

  // ── Derived numbers ────────────────────────────────────────────
  const totalSavings = activeMembers.reduce(
    (sum: number, m: any) => sum + (m.totalBalance ?? 0),
    0
  )
  const pendingDeposits = allDeposits.filter(
    (d: any) => d.status === STATUSES.PENDING
  )
  const approvedDeposits = allDeposits.filter(
    (d: any) => d.status === STATUSES.APPROVED
  )

  // Monthly collection progress
  const monthlyTarget = activeMembers.length * MONTHLY_TARGET_PER_MEMBER
  const now = new Date()
  const thisMonthDeposits = approvedDeposits.filter((d: any) => {
    const m = new Date(d.month)
    return (
      m.getFullYear() === now.getFullYear() &&
      m.getMonth() === now.getMonth()
    )
  })
  const thisMonthCollected = thisMonthDeposits.reduce(
    (sum: number, d: any) => sum + (d.amount ?? 0),
    0
  )
  const progressPct =
    monthlyTarget > 0
      ? Math.min(100, Math.round((thisMonthCollected / monthlyTarget) * 100))
      : 0

  const unpaidMembersList = useUnpaidMembersList(activeMembers, allDeposits)
  const unifiedFeedEvents = useUnifiedActivityFeed(allDeposits, activeMembers)

  const isLoading = loadingActive || loadingPending || loadingDeposits

  return (
    <div className="space-y-8">
      <DashboardHero
        totalSavings={totalSavings}
        activeMembersCount={activeMembers.length}
        pendingDepositsCount={pendingDeposits.length}
        pendingMembersCount={pendingMembers.length}
        isLoading={isLoading}
      />

      <MonthlyCollectionProgress
        activeMembersCount={activeMembers.length}
        monthlyTarget={monthlyTarget}
        thisMonthCollected={thisMonthCollected}
        progressPct={progressPct}
        thisMonthDepositsCount={thisMonthDeposits.length}
      />

      <PendingMemberApprovals
        pendingMembers={pendingMembers}
        loadingPending={loadingPending}
        onApprove={handleApprove}
        onReject={(id) => rejectMember.mutate(id)}
      />

      <PendingDepositsReview
        pendingDeposits={pendingDeposits}
        loadingDeposits={loadingDeposits}
      />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <ActivityFeed
          unifiedFeedEvents={unifiedFeedEvents}
          loadingEvents={loadingDeposits || loadingActive}
          className="xl:col-span-3"
        />

        <UnpaidMembersList
          unpaidMembersList={unpaidMembersList}
          isLoading={isLoading}
          className="xl:col-span-2"
        />
      </div>

      <ConfirmDialog
        open={isApproveOpen}
        onOpenChange={setIsApproveOpen}
        title="Approve Member Account"
        description={`Are you sure you want to approve ${processingUser?.name}? They will gain full access to the member portal.`}
        onConfirm={async () => {
          if (processingUser) approveMember.mutate(processingUser.id)
          setIsApproveOpen(false)
        }}
        confirmText="Approve Member"
        variant="success"
      />
    </div>
  )
}
