import * as React from "react"
import { STATUSES } from "@/lib/constants"
import { CheckCircle2, Clock, X, UserCheck } from "lucide-react"
import { fmtMonth, timeAgo } from "./dashboard-utils"

export function useUnpaidMembersList(activeMembers: any[], allDeposits: any[]) {
  return React.useMemo(() => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()

    // Find all deposits for the current month (approved, pending, or rejected)
    const currentMonthDeposits = allDeposits.filter((d: any) => {
      if (!d.month) return false
      const depDate = new Date(d.month)
      return depDate.getFullYear() === currentYear && depDate.getMonth() === currentMonth
    })

    // Filter out members who already have an approved deposit for the current month
    const unpaidMembers = activeMembers.filter((member: any) => {
      const memberDepThisMonth = currentMonthDeposits.find(
        (d: any) => d.userId?._id === member._id || d.userId === member._id
      )
      return memberDepThisMonth?.status !== STATUSES.APPROVED
    })

    return unpaidMembers
      .map((member: any) => {
        const memberDepThisMonth = currentMonthDeposits.find(
          (d: any) => d.userId?._id === member._id || d.userId === member._id
        )

        // Determine status: "pending" or "unpaid"
        const isPending = memberDepThisMonth?.status === STATUSES.PENDING
        const status = isPending ? "pending" : "unpaid"

        // Calculate last paid time based on historical approved deposits
        const memberApprovedDeps = allDeposits.filter(
          (d: any) =>
            (d.userId?._id === member._id || d.userId === member._id) &&
            d.status === STATUSES.APPROVED
        )

        let lastPaidTime = 0
        if (memberApprovedDeps.length > 0) {
          const months = memberApprovedDeps.map((d: any) => new Date(d.month).getTime())
          lastPaidTime = Math.max(...months)
        } else {
          lastPaidTime = member.createdAt ? new Date(member.createdAt).getTime() : 0
        }

        return {
          member,
          status,
          lastPaidTime,
        }
      })
      .sort((a: any, b: any) => {
        // If one is pending and one is unpaid, unpaid goes first
        if (a.status !== b.status) {
          return a.status === "unpaid" ? -1 : 1
        }

        // If both are unpaid, sort by lastPaidTime ascending (oldest/most overdue first)
        if (a.status === "unpaid") {
          if (a.lastPaidTime !== b.lastPaidTime) {
            return a.lastPaidTime - b.lastPaidTime
          }
        }

        // Fallback to alphabetical sorting by full name
        return a.member.fullName.localeCompare(b.member.fullName)
      })
  }, [activeMembers, allDeposits])
}

export function useUnifiedActivityFeed(allDeposits: any[], activeMembers: any[]) {
  return React.useMemo(() => {
    const feedEvents: any[] = []

    // 1. Deposits events
    allDeposits.forEach((dep: any) => {
      const name = dep.userId?.fullName ?? "Unknown Member"
      const formattedAmount = dep.amount ? dep.amount.toLocaleString() : "0"
      const formattedMonth = dep.month ? fmtMonth(dep.month) : "—"

      if (dep.status === STATUSES.PENDING) {
        feedEvents.push({
          id: `dep-submitted-${dep._id}`,
          type: "deposit_submitted",
          createdAt: dep.createdAt,
          name,
          detail: `Submitted deposit of PKR ${formattedAmount} for ${formattedMonth}`,
          badgeText: "pending",
          badgeVariant: "pending",
          icon: Clock,
          iconBg: "bg-muted",
          iconColor: "text-muted-foreground",
          meta: timeAgo(dep.createdAt)
        })
      } else if (dep.status === STATUSES.APPROVED) {
        const approvedAt = dep.updatedAt || dep.createdAt
        feedEvents.push({
          id: `dep-approved-${dep._id}`,
          type: "deposit_approved",
          createdAt: approvedAt,
          name,
          detail: `Approved deposit of PKR ${formattedAmount} for ${formattedMonth}`,
          badgeText: "approved",
          badgeVariant: "approved",
          icon: CheckCircle2,
          iconBg: "bg-accent/20",
          iconColor: "text-accent-foreground",
          meta: timeAgo(approvedAt)
        })
      } else if (dep.status === STATUSES.REJECTED) {
        const rejectedAt = dep.updatedAt || dep.createdAt
        feedEvents.push({
          id: `dep-rejected-${dep._id}`,
          type: "deposit_rejected",
          createdAt: rejectedAt,
          name,
          detail: `Rejected deposit of PKR ${formattedAmount} for ${formattedMonth}`,
          badgeText: "rejected",
          badgeVariant: "rejected",
          icon: X,
          iconBg: "bg-destructive/10",
          iconColor: "text-destructive",
          meta: timeAgo(rejectedAt)
        })
      }
    })

    // 2. Active members approvals
    activeMembers.forEach((m: any) => {
      const approvalDate = m.approvedAt || m.createdAt
      if (approvalDate) {
        feedEvents.push({
          id: `member-approved-${m._id}`,
          type: "member_approved",
          createdAt: approvalDate,
          name: m.fullName,
          detail: "Account approved · Portal access granted",
          badgeText: "approved",
          badgeVariant: "approved",
          icon: UserCheck,
          iconBg: "bg-chart-4/15",
          iconColor: "text-chart-4",
          meta: timeAgo(approvalDate)
        })
      }
    })

    // Sort by createdAt descending, capped at 10 items
    return [...feedEvents]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
  }, [allDeposits, activeMembers])
}
