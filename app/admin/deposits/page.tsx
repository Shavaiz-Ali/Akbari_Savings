"use client"

import * as React from "react"
import { CustomCard } from "@/components/ui/CustomCard"
import { CustomButton } from "@/components/ui/CustomButton"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { CustomInput } from "@/components/ui/CustomInput"
import { PageHeader } from "@/components/ui/PageHeader"
import { CardTable } from "@/components/ui/CardTable"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Check,
  X,
  ExternalLink,
  Calendar,
} from "lucide-react"

// ── Mock Data ──
const deposits = [
  { id: 1, member: "Ahmed Raza", amount: "PKR 15,000", month: "Jun 2026", status: "approved" as const, date: "Jun 8, 2026", screenshot: "#" },
  { id: 2, member: "Fatima Noor", amount: "PKR 12,000", month: "Jun 2026", status: "pending" as const, date: "Jun 9, 2026", screenshot: "#" },
  { id: 3, member: "Hassan Ali", amount: "PKR 20,000", month: "May 2026", status: "rejected" as const, date: "May 15, 2026", screenshot: "#" },
  { id: 4, member: "Sana Malik", amount: "PKR 10,000", month: "Jun 2026", status: "pending" as const, date: "Jun 10, 2026", screenshot: "#" },
  { id: 5, member: "Usman Sheikh", amount: "PKR 18,000", month: "Jun 2026", status: "approved" as const, date: "Jun 6, 2026", screenshot: "#" },
  { id: 6, member: "Zainab Iqbal", amount: "PKR 15,000", month: "May 2026", status: "approved" as const, date: "May 10, 2026", screenshot: "#" },
]

export default function AdminDepositsPage() {
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  
  // Confirmation states
  const [isApproveOpen, setIsApproveOpen] = React.useState(false)
  const [isRejectOpen, setIsRejectOpen] = React.useState(false)
  const [selectedDeposit, setSelectedDeposit] = React.useState<{id: number, member: string, amount: string, month: string} | null>(null)

  const handleApproveClick = (dep: any) => {
    setSelectedDeposit(dep)
    setIsApproveOpen(true)
  }

  const handleRejectClick = (dep: any) => {
    setSelectedDeposit(dep)
    setIsRejectOpen(true)
  }

  const confirmApprove = async () => {
    toast.success(`Approved deposit of ${selectedDeposit?.amount} from ${selectedDeposit?.member}`)
    setIsApproveOpen(false)
  }

  const confirmReject = async () => {
    toast.error(`Rejected deposit of ${selectedDeposit?.amount} from ${selectedDeposit?.member}`)
    setIsRejectOpen(false)
  }

  const filteredDeposits = deposits.filter((dep) => {
    const matchesStatus = statusFilter === "all" || dep.status === statusFilter
    const matchesSearch = dep.member.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <>
      <PageHeader 
        title="Deposits" 
        description="Review and manage member deposit submissions"
      />

      {/* Filters */}
      <AnimatedSection delay="200" className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:max-w-sm">
          <CustomInput
            label="Search Members"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search />}
          />
        </div>
        <div className="flex flex-col gap-2 min-w-[200px]">
          <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 ml-0.5">
            Filter by Status
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-12 w-full bg-background/50 border-input transition-all duration-200 shadow-sm focus-visible:ring-ring/10">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 min-w-[200px]">
          <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 ml-0.5">
            Filter by Month
          </label>
          <Select defaultValue="all">
            <SelectTrigger className="h-12 w-full bg-background/50 border-input transition-all duration-200 shadow-sm focus-visible:ring-ring/10">
              <SelectValue placeholder="All Months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              <SelectItem value="jun-2026">June 2026</SelectItem>
              <SelectItem value="may-2026">May 2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AnimatedSection>

      {/* Deposits Table */}
      <CardTable>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="pl-6">Member</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>Screenshot</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted Date</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeposits.length > 0 ? (
              filteredDeposits.map((dep) => (
                <TableRow key={dep.id}>
                  <TableCell className="pl-6 font-medium text-foreground">
                    {dep.member}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {dep.amount}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Calendar className="size-3" />
                      {dep.month}
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={dep.screenshot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                    >
                      View
                      <ExternalLink className="size-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <CustomBadge variant={dep.status}>
                      {dep.status}
                    </CustomBadge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {dep.date}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    {dep.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <CustomButton 
                          size="sm" 
                          className="h-8 px-3 gap-1 shadow-md"
                          onClick={() => handleApproveClick(dep)}
                        >
                          <Check className="size-3" />
                          Approve
                        </CustomButton>
                        <CustomButton
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 gap-1 text-destructive hover:bg-destructive/10"
                          onClick={() => handleRejectClick(dep)}
                        >
                          <X className="size-3" />
                          Reject
                        </CustomButton>
                      </div>
                    ) : (
                      <span className="text-[10px] uppercase font-bold text-muted-foreground/40 tracking-wider">
                        Processed
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No deposits found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardTable>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={isApproveOpen}
        onOpenChange={setIsApproveOpen}
        title="Approve Deposit"
        description={`Confirm receipt of ${selectedDeposit?.amount} from ${selectedDeposit?.member} for ${selectedDeposit?.month}?`}
        onConfirm={confirmApprove}
        confirmText="Confirm Approval"
        variant="success"
      />

      <ConfirmDialog
        open={isRejectOpen}
        onOpenChange={setIsRejectOpen}
        title="Reject Deposit"
        description={`Reject deposit of ${selectedDeposit?.amount} from ${selectedDeposit?.member}? This action cannot be undone.`}
        onConfirm={confirmReject}
        confirmText="Reject Deposit"
        variant="destructive"
      />
    </>
  )
}
