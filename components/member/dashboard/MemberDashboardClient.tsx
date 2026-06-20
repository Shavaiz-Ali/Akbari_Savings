"use client"

import * as React from "react"
import Link from "next/link"
import { Wallet, PlusCircle, Landmark, ShieldCheck, Calendar, ArrowUpRight, TrendingUp } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { CustomCard } from "@/components/ui/CustomCard"
import { CustomButton } from "@/components/ui/CustomButton"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { QueryBoundary } from "@/components/ui/QueryBoundary"
import { SkeletonPatterns } from "@/components/ui/Skeleton"
import { formatDatePK, formatMonthPK } from "@/lib/dateUtils"
import { useMemberDeposits } from "@/services/depositService/hooks"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

interface MemberDashboardClientProps {
  user: {
    fullName: string
    email: string
    totalBalance: number
    monthlyTarget: number
    createdAt: string
  }
}

export function MemberDashboardClient({ user }: MemberDashboardClientProps) {
  const { data, isLoading, error, refetch } = useMemberDeposits()
  const deposits = data?.data ?? []
  const recentDeposits = deposits.slice(0, 5)

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Assalam-o-Alaikum, ${user.fullName}`}
        description="Track your monthly savings and request payments from one place."
      >
        <Link href="?deposit=true" passHref>
          <CustomButton className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
            <PlusCircle className="size-4" />
            Submit Deposit
          </CustomButton>
        </Link>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedSection delay="100">
          <CustomCard
            className="relative overflow-hidden border-sidebar-border bg-gradient-to-br from-card to-muted/30"
            body={
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Total Balance</span>
                  <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Wallet className="size-4.5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold tracking-tight text-foreground font-sans">
                    PKR {user.totalBalance.toLocaleString()}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                    <TrendingUp className="size-3" />
                    <span>Securely saved</span>
                  </div>
                </div>
              </div>
            }
          />
        </AnimatedSection>

        <AnimatedSection delay="200">
          <CustomCard
            className="relative overflow-hidden border-sidebar-border bg-gradient-to-br from-card to-muted/30"
            body={
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Monthly Target</span>
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Landmark className="size-4.5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold tracking-tight text-foreground font-sans">
                    PKR {user.monthlyTarget.toLocaleString()}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-semibold">
                    <ShieldCheck className="size-3 text-primary/60" />
                    <span>Required monthly deposit</span>
                  </div>
                </div>
              </div>
            }
          />
        </AnimatedSection>

        <AnimatedSection delay="200">
          <CustomCard
            className="relative overflow-hidden border-sidebar-border bg-gradient-to-br from-card to-muted/30"
            body={
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Account Status</span>
                  <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <ShieldCheck className="size-4.5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-sans">
                    Active
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="size-3" />
                    <span>Joined {formatDatePK(user.createdAt)}</span>
                  </div>
                </div>
              </div>
            }
          />
        </AnimatedSection>
      </div>

      {/* Quick Actions and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 columns - Recent Deposit Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-foreground font-serif">Recent Deposit Requests</h2>
            <Link href="/member/deposits" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              View All
              <ArrowUpRight className="size-3" />
            </Link>
          </div>

          <QueryBoundary
            isLoading={isLoading}
            loadingPlaceholder={<SkeletonPatterns.Table rows={5} />}
            error={error}
            onRetry={refetch}
            isEmpty={!isLoading && recentDeposits.length === 0}
            emptyTitle="No deposits submitted yet"
            emptyDescription="Submit your first monthly deposit to see it here."
            emptyIcon={Wallet}
          >
            <CustomCard
              className="border-sidebar-border"
              body={
                <div className="divide-y divide-border/40">
                  {recentDeposits.map((dep: any) => (
                    <div key={dep._id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="space-y-1 text-left">
                        <span className="font-semibold text-sm text-foreground block">
                          PKR {dep.amount.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground block">
                          For {formatMonthPK(dep.month)} · Submitted {formatDatePK(dep.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CustomBadge variant={dep.status}>
                          {dep.status}
                        </CustomBadge>
                      </div>
                    </div>
                  ))}
                </div>
              }
            />
          </QueryBoundary>
        </div>

        {/* Right column - Fast info card */}
        <div>
          <CustomCard
            className="border-sidebar-border h-full bg-gradient-to-b from-card to-muted/20"
            body={
              <div className="space-y-6 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <h3 className="font-bold text-base text-foreground font-serif">How Savings Work</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Akbari Savings is built to ensure a shared commitment to financial success. Every month, members deposit their savings based on their target.
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Once submitted, our administrators review the deposit and receipt. After validation, your total balance increases.
                  </p>
                </div>
                <div className="pt-6">
                  <Link href="?deposit=true" passHref>
                    <CustomButton className="w-full justify-center">
                      Submit a New Deposit
                    </CustomButton>
                  </Link>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}
