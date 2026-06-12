"use client"

import * as React from "react"
import { CustomCard } from "@/components/ui/CustomCard"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { CustomButton } from "@/components/ui/CustomButton"
import { CustomAvatar } from "@/components/ui/CustomAvatar"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { PageHeader } from "@/components/ui/PageHeader"
import { CardTable } from "@/components/ui/CardTable"
import { toast } from "sonner"
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

// ── Mock Data ──
const stats = [
  { label: "Total Members", value: "25", icon: Users, trend: "+3 this month" },
  { label: "Total Savings (PKR)", value: "4,87,500", icon: Wallet, trend: "+PKR 75,000" },
  { label: "Pending Deposits", value: "3", icon: Clock, trend: "Awaiting review" },
  { label: "Pending Approvals", value: "2", icon: AlertCircle, trend: "New signups" },
]

const recentDeposits = [
  { id: 1, member: "Ahmed Raza", amount: "PKR 15,000", month: "Jun 2026", status: "approved" as const, date: "Jun 8, 2026" },
  { id: 2, member: "Fatima Noor", amount: "PKR 12,000", month: "Jun 2026", status: "pending" as const, date: "Jun 9, 2026" },
  { id: 3, member: "Hassan Ali", amount: "PKR 20,000", month: "Jun 2026", status: "approved" as const, date: "Jun 7, 2026" },
  { id: 4, member: "Sana Malik", amount: "PKR 10,000", month: "Jun 2026", status: "pending" as const, date: "Jun 10, 2026" },
  { id: 5, member: "Usman Sheikh", amount: "PKR 18,000", month: "Jun 2026", status: "rejected" as const, date: "Jun 6, 2026" },
]

const pendingApprovals = [
  { id: 1, name: "Bilal Khan", email: "bilal@email.com", date: "Jun 10, 2026" },
  { id: 2, name: "Ayesha Siddiqui", email: "ayesha@email.com", date: "Jun 9, 2026" },
]

export default function AdminDashboardPage() {
  const [isApproveOpen, setIsApproveOpen] = React.useState(false)
  const [processingUser, setProcessingUser] = React.useState<{id: number, name: string} | null>(null)

  const handleApprove = (user: {id: number, name: string}) => {
    setProcessingUser(user)
    setIsApproveOpen(true)
  }

  const confirmApprove = async () => {
    toast.success(`Successfully approved ${processingUser?.name}'s account`)
    setIsApproveOpen(false)
  }

  return (
    <>
      <PageHeader 
        title="Dashboard" 
        description="Overview of your savings platform" 
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
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
        ))}
      </div>

      {/* Recent Deposits */}
      <AnimatedSection delay="500" className="space-y-4">
        <h2 className="text-xl font-bold font-serif text-foreground">
          Recent Deposits
        </h2>
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
              {recentDeposits.map((dep) => (
                <TableRow key={dep.id}>
                  <TableCell className="pl-6 font-medium">
                    {dep.member}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {dep.amount}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dep.month}
                  </TableCell>
                  <TableCell>
                    <CustomBadge variant={dep.status}>
                      {dep.status}
                    </CustomBadge>
                  </TableCell>
                  <TableCell className="pr-6 text-muted-foreground">
                    {dep.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardTable>
      </AnimatedSection>

      {/* Pending Approvals */}
      <AnimatedSection delay="700" className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold font-serif text-foreground">
            Pending Approvals
          </h2>
          <CustomBadge variant="pending">{pendingApprovals.length}</CustomBadge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pendingApprovals.map((user) => (
            <CustomCard
              key={user.id}
              className="hover:border-primary/30 transition-colors duration-300"
              body={
                <div className="flex items-start gap-4">
                  <CustomAvatar
                    initials={user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                    size="md"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-semibold text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60">
                      Signed up {user.date}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <CustomButton 
                      size="sm" 
                      className="gap-1 shadow-md"
                      onClick={() => handleApprove({ id: user.id, name: user.name })}
                    >
                      <Check className="size-3.5" />
                      Approve
                    </CustomButton>
                    <CustomButton
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 gap-1"
                      onClick={() => toast.error(`Rejected ${user.name}'s request`)}
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
      </AnimatedSection>

      <ConfirmDialog
        open={isApproveOpen}
        onOpenChange={setIsApproveOpen}
        title="Approve Member Account"
        description={`Are you sure you want to approve ${processingUser?.name}? They will gain full access to the member portal.`}
        onConfirm={confirmApprove}
        confirmText="Approve Member"
        variant="success"
      />
    </>
  )
}
