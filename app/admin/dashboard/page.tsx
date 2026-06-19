"use client"

import * as React from "react"
import { CustomCard } from "@/components/ui/CustomCard"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { CustomButton } from "@/components/ui/CustomButton"
import { CustomAvatar } from "@/components/ui/CustomAvatar"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { EmptyState } from "@/components/ui/EmptyState"
import { Typography } from "@/components/ui/Typography"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { SkeletonPatterns } from "@/components/ui/Skeleton"
import {
  Users,
  Wallet,
  Clock,
  AlertCircle,
  Check,
  X,
  TrendingUp,
  CheckCircle2,
  PiggyBank,
  UserCheck,
  Coins,
  Activity,
  CalendarDays,
} from "lucide-react"
import { STATUSES } from "@/lib/constants"
import {
  useActiveMembers,
  usePendingMembers,
  useApproveMember,
  useRejectMember,
} from "@/services/memberService/hooks"
import { useDeposits } from "@/services/depositService/hooks"
import { cn } from "@/lib/utils"

// ─── Helpers ────────────────────────────────────────────────────────────────
const MONTHLY_TARGET_PER_MEMBER = 5_000 // PKR

function fmtPKR(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function fmtMonth(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    month: "short",
    year: "numeric",
  })
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Thin coloured left-border card used for urgent items */
function UrgentCard({
  children,
  accentClass,
  className,
}: {
  children: React.ReactNode
  accentClass: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-border/40 bg-card shadow-sm transition-all duration-300",
        "hover:shadow-md hover:-translate-y-0.5 overflow-hidden",
        className
      )}
    >
      {/* Left accent stripe */}
      <span
        className={cn("absolute inset-y-0 left-0 w-1 rounded-l-xl", accentClass)}
      />
      <div className="pl-5 pr-5 py-4">{children}</div>
    </div>
  )
}

/** A single timeline event row */
function TimelineItem({
  icon: Icon,
  iconBg,
  iconColor,
  name,
  detail,
  meta,
  badge,
  isLast,
}: {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  name: string
  detail: string
  meta: string
  badge?: React.ReactNode
  isLast?: boolean
}) {
  return (
    <div className="flex gap-3 group">
      {/* timeline line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "size-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110",
            iconBg
          )}
        >
          <Icon className={cn("size-3.5", iconColor)} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-border/40 mt-1" />}
      </div>
      {/* content */}
      <div className="pb-4 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">{name}</span>
          {badge}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{detail}</p>
        <p className="text-[11px] text-muted-foreground/50 mt-0.5">{meta}</p>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [isApproveOpen, setIsApproveOpen] = React.useState(false)
  const [processingUser, setProcessingUser] = React.useState<{
    id: string
    name: string
  } | null>(null)

  const {
    data: activeData,
    isLoading: loadingActive,
  } = useActiveMembers()
  const {
    data: pendingData,
    isLoading: loadingPending,
    error: errorPending,
    refetch: refetchPending,
  } = usePendingMembers()
  const {
    data: depositsData,
    isLoading: loadingDeposits,
  } = useDeposits({ status: undefined })

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

  // Recent activity feed (last 8 deposits, any status)
  const recentActivity = [...allDeposits]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8)

  const isLoading = loadingActive || loadingPending || loadingDeposits

  return (
    <div className="space-y-8">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
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
                  className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground"
                >
                  PKR{" "}
                  <span className="text-primary">
                    {totalSavings.toLocaleString()}
                  </span>
                </Typography>
              )}
              <Typography variant="muted" className="text-sm mt-1">
                Across {activeMembers.length} active member
                {activeMembers.length !== 1 ? "s" : ""} · All time
              </Typography>
            </div>

            {/* Quick stat pills */}
            <div className="flex flex-wrap gap-3 md:ml-auto">
              {[
                {
                  label: "Pending Deposits",
                  value: pendingDeposits.length,
                  icon: Clock,
                  urgent: pendingDeposits.length > 0,
                },
                {
                  label: "Pending Signups",
                  value: pendingMembers.length,
                  icon: AlertCircle,
                  urgent: pendingMembers.length > 0,
                },
                {
                  label: "Active Members",
                  value: activeMembers.length,
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

      {/* ── Monthly Collection Progress ───────────────────────────────── */}
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
                    {activeMembers.length} members × PKR{" "}
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
                    {thisMonthDeposits.length} deposit
                    {thisMonthDeposits.length !== 1 ? "s" : ""} approved
                  </span>
                </div>
              </div>
            </div>
          }
        />
      </AnimatedSection>

      {/* ── Pending Approvals (Urgent) ────────────────────────────────── */}
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
            {pendingMembers.map((user: any) => (
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
                    size="md"
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
                        handleApprove({ id: user._id, name: user.fullName })
                      }
                    >
                      <Check className="size-3.5" />
                      Approve
                    </CustomButton>
                    <CustomButton
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 gap-1 h-8 px-2 text-xs"
                      onClick={() => rejectMember.mutate(user._id)}
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

      {/* ── Pending Deposits (Urgent) ─────────────────────────────────── */}
      {!loadingDeposits && pendingDeposits.length > 0 && (
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
            {pendingDeposits.slice(0, 6).map((dep: any) => (
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
                      <p className="text-xl font-bold text-primary">
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
      )}

      {/* ── Bottom two-column ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Recent Activity Feed */}
        <AnimatedSection delay="500" className="xl:col-span-3 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-chart-4/20 flex items-center justify-center">
              <Activity className="size-4 text-chart-4" />
            </div>
            <Typography variant="h4" className="text-base font-semibold">
              Recent Activity
            </Typography>
          </div>

          <CustomCard
            body={
              loadingDeposits ? (
                <SkeletonPatterns.Table rows={5} />
              ) : recentActivity.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="No activity yet"
                  description="Deposit transactions will appear here."
                />
              ) : (
                <div className="space-y-0">
                  {recentActivity.map((dep: any, i: number) => {
                    const isApproved = dep.status === STATUSES.APPROVED
                    const isRejected = dep.status === STATUSES.REJECTED
                    return (
                      <TimelineItem
                        key={dep._id}
                        icon={
                          isApproved
                            ? CheckCircle2
                            : isRejected
                              ? X
                              : Clock
                        }
                        iconBg={
                          isApproved
                            ? "bg-accent/20"
                            : isRejected
                              ? "bg-destructive/10"
                              : "bg-muted"
                        }
                        iconColor={
                          isApproved
                            ? "text-accent-foreground"
                            : isRejected
                              ? "text-destructive"
                              : "text-muted-foreground"
                        }
                        name={dep.userId?.fullName ?? "Unknown"}
                        detail={`PKR ${dep.amount.toLocaleString()} · ${fmtMonth(dep.month)}`}
                        meta={timeAgo(dep.createdAt)}
                        badge={
                          <CustomBadge variant={dep.status} className="text-[9px] px-1.5 py-0">
                            {dep.status}
                          </CustomBadge>
                        }
                        isLast={i === recentActivity.length - 1}
                      />
                    )
                  })}
                </div>
              )
            }
          />
        </AnimatedSection>

        {/* Platform Stats sidebar */}
        <AnimatedSection delay="600" className="xl:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="size-4 text-primary" />
            </div>
            <Typography variant="h4" className="text-base font-semibold">
              Platform Stats
            </Typography>
          </div>

          <div className="space-y-3">
            {[
              {
                label: "Total Members",
                value: activeMembers.length,
                suffix: "active",
                icon: Users,
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                label: "Total Savings",
                value: `PKR ${fmtPKR(totalSavings)}`,
                suffix: "all time",
                icon: Wallet,
                color: "text-chart-4",
                bg: "bg-chart-4/15",
              },
              {
                label: "Approved Deposits",
                value: approvedDeposits.length,
                suffix: "transactions",
                icon: CheckCircle2,
                color: "text-accent",
                bg: "bg-accent/15",
              },
              {
                label: "Pending Actions",
                value:
                  pendingDeposits.length + pendingMembers.length,
                suffix: "need attention",
                icon: AlertCircle,
                color:
                  pendingDeposits.length + pendingMembers.length > 0
                    ? "text-destructive"
                    : "text-muted-foreground",
                bg:
                  pendingDeposits.length + pendingMembers.length > 0
                    ? "bg-destructive/10"
                    : "bg-muted/50",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-border/40 bg-card p-4",
                  "shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                )}
              >
                <div
                  className={cn(
                    "size-10 rounded-lg flex items-center justify-center shrink-0",
                    stat.bg
                  )}
                >
                  <stat.icon className={cn("size-5", stat.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                  <p
                    className={cn(
                      "text-xl font-bold tabular-nums",
                      stat.color
                    )}
                  >
                    {isLoading ? (
                      <span className="inline-block w-16 h-5 rounded bg-muted/50 animate-pulse" />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground/50 shrink-0">
                  {stat.suffix}
                </span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* ── Confirm dialog ────────────────────────────────────────────── */}
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
