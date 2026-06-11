"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { CustomCard } from "@/components/ui/CustomCard"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Wallet,
  Calendar,
  Target,
  ArrowUpRight,
} from "lucide-react"

// ── Mock Data ──
const stats = {
  totalSaved: "PKR 97,500",
  thisMonthStatus: "pending" as const,
  monthlyTarget: "PKR 15,000",
  progress: 65,
}

const recentDeposits = [
  { id: 1, month: "June 2026", amount: "PKR 15,000", status: "pending" as const, date: "Jun 10, 2026" },
  { id: 2, month: "May 2026", amount: "PKR 15,000", status: "approved" as const, date: "May 8, 2026" },
  { id: 3, month: "April 2026", amount: "PKR 15,000", status: "approved" as const, date: "Apr 5, 2026" },
  { id: 4, month: "March 2026", amount: "PKR 15,000", status: "approved" as const, date: "Mar 10, 2026" },
]

export default function MemberDashboardPage() {
  const { data: session } = useSession()
  const userName = session?.user?.name || "Member"

  return (
    <AnimatedSection className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <AnimatedSection direction="right" delay="100" className="space-y-1">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight font-serif text-foreground">
          Welcome back, {userName.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground text-sm">
          Here is an overview of your savings this year
        </p>
      </AnimatedSection>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedSection delay="200">
          <CustomCard
            body={
              <div className="space-y-4">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Wallet className="size-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-primary tracking-tight">
                    {stats.totalSaved}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Total Saved
                  </p>
                </div>
              </div>
            }
          />
        </AnimatedSection>
        <AnimatedSection delay="300">
          <CustomCard
            body={
              <div className="space-y-4">
                <div className="size-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <Calendar className="size-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-foreground tracking-tight">
                      June Status
                    </p>
                    <CustomBadge variant={stats.thisMonthStatus}>
                      {stats.thisMonthStatus}
                    </CustomBadge>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Current Month Status
                  </p>
                </div>
              </div>
            }
          />
        </AnimatedSection>
        <AnimatedSection delay="400">
          <CustomCard
            body={
              <div className="space-y-4">
                <div className="size-10 rounded-lg bg-secondary/30 flex items-center justify-center text-secondary-foreground">
                  <Target className="size-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-foreground tracking-tight">
                    {stats.monthlyTarget}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Monthly Target
                  </p>
                </div>
              </div>
            }
          />
        </AnimatedSection>
      </div>

      {/* Progress Section */}
      <AnimatedSection delay="500">
        <CustomCard
          body={
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-serif text-foreground">
                  Annual Progress
                </h2>
                <span className="text-sm font-bold text-primary">{stats.progress}% of Goal</span>
              </div>
              
              <div className="relative h-4 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-out flex items-center justify-end pr-1 shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                <span>PKR 0</span>
                <span>Goal: PKR 1,80,000</span>
              </div>
            </div>
          }
        />
      </AnimatedSection>

      {/* Recent Activity */}
      <AnimatedSection delay="600" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-serif text-foreground">
            Recent Deposits
          </h2>
          <CustomBadge variant="approved">View All History</CustomBadge>
        </div>
        <CustomCard
          className="overflow-hidden"
          body={
            <div className="-mx-8 -my-8">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="pl-6">Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6 text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDeposits.map((dep) => (
                    <TableRow key={dep.id}>
                      <TableCell className="pl-6 font-medium text-foreground">
                        {dep.month}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {dep.amount}
                      </TableCell>
                      <TableCell>
                        <CustomBadge variant={dep.status}>
                          {dep.status}
                        </CustomBadge>
                      </TableCell>
                      <TableCell className="pr-6 text-right text-muted-foreground text-xs">
                        {dep.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          }
        />
      </AnimatedSection>
    </AnimatedSection>
  )
}
