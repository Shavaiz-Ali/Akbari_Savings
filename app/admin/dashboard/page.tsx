"use client"

import * as React from "react"
import { CustomCard } from "@/components/ui/CustomCard"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { CustomButton } from "@/components/ui/CustomButton"
import { CustomAvatar } from "@/components/ui/CustomAvatar"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { PageHeader } from "@/components/ui/PageHeader"
import { CardTable } from "@/components/ui/CardTable"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  Wallet,
  Clock,
  AlertCircle,
  Check,
  X,
  TrendingUp,
} from "lucide-react"
import { QueryBoundary } from "@/components/ui/QueryBoundary"
import { SkeletonPatterns } from "@/components/ui/Skeleton"
import { STATUSES } from "@/lib/constants"
import { useActiveMembers, usePendingMembers, useApproveMember, useRejectMember } from "@/services/memberService/hooks"
import { useDeposits } from "@/services/depositService/hooks"

export default function AdminDashboardPage() {
  const [isApproveOpen, setIsApproveOpen] = React.useState(false)
  const [processingUser, setProcessingUser] = React.useState<{ id: string; name: string } | null>(null)

  // Data hooks
  const { data: activeData, isLoading: loadingActive, error: errorActive, refetch: refetchActive } = useActiveMembers()
  const { data: pendingData, isLoading: loadingPending, error: errorPending, refetch: refetchPending } = usePendingMembers()
  const { data: depositsData, isLoading: loadingDeposits, error: errorDeposits, refetch: refetchDeposits } = useDeposits({ status: undefined })

  const activeMembers = activeData?.data ?? []
  const pendingMembers = pendingData?.data ?? []
  const allDeposits = depositsData?.data ?? []

  const recentDeposits = allDeposits.slice(0, 5)

  // Mutation hooks
  const approveMember = useApproveMember()
  const rejectMember = useRejectMember()

  const handleApprove = (user: { id: string; name: string }) => {
    setProcessingUser(user)
    setIsApproveOpen(true)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-PK", { month: "short", day: "numeric", year: "numeric" })

  const formatMonth = (iso: string) =>
    new Date(iso).toLocaleDateString("en-PK", { month: "short", year: "numeric" })

  const stats = [
    {
      label: "Total Members",
      value: String(activeMembers.length),
      icon: Users,
      trend: `${activeMembers.length} active`,
    },
    {
      label: "Total Savings (PKR)",
      value: activeMembers.reduce((sum: number, m: any) => sum + m.totalBalance, 0).toLocaleString(),
      icon: Wallet,
      trend: "All time",
    },
    {
      label: "Pending Deposits",
      value: String(allDeposits.filter((d: any) => d.status === STATUSES.PENDING).length),
      icon: Clock,
      trend: "Awaiting review",
    },
    {
      label: "Pending Approvals",
      value: String(pendingMembers.length),
      icon: AlertCircle,
      trend: "New signups",
    },
  ]

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your savings platform"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {(loadingActive || loadingPending || loadingDeposits) ? (
          <>
            <SkeletonPatterns.StatCard />
            <SkeletonPatterns.StatCard />
            <SkeletonPatterns.StatCard />
            <SkeletonPatterns.StatCard />
          </>
        ) : (
          stats.map((stat, i) => (
            <AnimatedSection
              key={stat.label}
              delay={i === 0 ? "100" : i === 1 ? "200" : i === 2 ? "300" : "400"}
            >
              <CustomCard
                className="hover:shadow-xl transition-shadow duration-300"
                body={
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <stat.icon className="size-5" />
                      </div>
                      <TrendingUp className="size-4 text-muted-foreground/40" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-primary tracking-tight">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">
                        {stat.label}
                      </p>
                    </div>
                    <p className="text-[11px] text-muted-foreground/60 font-medium">
                      {stat.trend}
                    </p>
                  </div>
                }
              />
            </AnimatedSection>
          ))
        )}
      </div>

      {/* Recent Deposits */}
      <AnimatedSection delay="500" className="space-y-4">
        <h2 className="text-xl font-bold font-serif text-foreground">
          Recent Deposits
        </h2>
        <QueryBoundary
          isLoading={loadingDeposits}
          loadingPlaceholder={<SkeletonPatterns.Table rows={5} />}
          error={errorDeposits}
          isEmpty={!loadingDeposits && recentDeposits.length === 0}
          onRetry={refetchDeposits}
          emptyTitle="No recent deposits"
          emptyDescription="Verified deposits will appear here."
          emptyIcon={Clock}
        >
          <CardTable>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="pl-6">Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDeposits.map((dep: any) => (
                  <TableRow key={dep._id}>
                    <TableCell className="pl-6 font-medium">
                      {dep.userId.fullName}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      PKR {dep.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatMonth(dep.month)}
                    </TableCell>
                    <TableCell>
                      <CustomBadge variant={dep.status}>
                        {dep.status}
                      </CustomBadge>
                    </TableCell>
                    <TableCell className="pr-6 text-muted-foreground">
                      {formatDate(dep.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardTable>
        </QueryBoundary>
      </AnimatedSection>

      {/* Pending Approvals */}
      <AnimatedSection delay="700" className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold font-serif text-foreground">
            Pending Approvals
          </h2>
          <CustomBadge variant="pending">{pendingMembers.length}</CustomBadge>
        </div>

        <QueryBoundary
          isLoading={loadingPending}
          loadingPlaceholder={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SkeletonPatterns.Card />
              <SkeletonPatterns.Card />
            </div>
          }
          error={errorPending}
          isEmpty={!loadingPending && pendingMembers.length === 0}
          onRetry={refetchPending}
          emptyTitle="No pending approvals"
          emptyDescription="All signup requests have been processed."
          emptyIcon={Users}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pendingMembers.map((user: any) => (
              <CustomCard
                key={user._id}
                className="hover:border-primary/30 transition-colors duration-300"
                body={
                  <div className="flex items-start gap-4">
                    <CustomAvatar
                      initials={user.fullName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                      size="md"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="font-semibold text-foreground truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <p className="text-[11px] text-muted-foreground/60">
                        Signed up {formatDate(user.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <CustomButton
                        size="sm"
                        className="gap-1 shadow-md"
                        onClick={() => handleApprove({ id: user._id, name: user.fullName })}
                      >
                        <Check className="size-3.5" />
                        Approve
                      </CustomButton>
                      <CustomButton
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 gap-1"
                        onClick={() => rejectMember.mutate(user._id)}
                      >
                        <X className="size-3.5" />
                        Reject
                      </CustomButton>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        </QueryBoundary>
      </AnimatedSection>

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
    </>
  )
}
