"use client"

import * as React from "react"
import { Check, X, ExternalLink, Clock } from "lucide-react"
import { useSession } from "next-auth/react"
import { formatDatePK, formatMonthPK, generateMonthOptions } from "@/lib/dateUtils"
import { CustomButton } from "@/components/ui/CustomButton"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { CustomAvatar } from "@/components/ui/CustomAvatar"
import { FilterBar } from "@/components/ui/FilterBar"
import { DataTable, type Column } from "@/components/ui/DataTable"
import { QueryBoundary } from "@/components/ui/QueryBoundary"
import { SkeletonPatterns } from "@/components/ui/Skeleton"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { PageHeader } from "@/components/ui/PageHeader"
import { useDeposits, useApproveDeposit, useRejectDeposit } from "@/services/depositService/hooks"

type SelectedDeposit = {
  _id: string
  userId: { _id: string; fullName: string; email: string }
  amount: number
  month: string
} | null

export function DepositsPageClient() {
  const { data: session } = useSession()
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [monthFilter, setMonthFilter] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")

  // Confirmation states
  const [isApproveOpen, setIsApproveOpen] = React.useState(false)
  const [isRejectOpen, setIsRejectOpen] = React.useState(false)
  const [selectedDeposit, setSelectedDeposit] = React.useState<SelectedDeposit>(null)

  // Data hooks
  const { data, isLoading, error, refetch } = useDeposits({
    status: statusFilter === "all" ? undefined : statusFilter,
    month: monthFilter === "all" ? undefined : monthFilter,
  })
  const deposits = data?.data ?? []

  // Mutation hooks
  const approveDeposit = useApproveDeposit()
  const rejectDeposit = useRejectDeposit()

  const handleApproveClick = (dep: SelectedDeposit) => {
    setSelectedDeposit(dep)
    setIsApproveOpen(true)
  }

  const handleRejectClick = (dep: SelectedDeposit) => {
    setSelectedDeposit(dep)
    setIsRejectOpen(true)
  }

  const filteredDeposits = deposits.filter((dep: any) => {
    const nameMatch = dep.userId?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
    const emailMatch = dep.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
    const matchesSearch = nameMatch || emailMatch
    const matchesMonth = monthFilter === "all" || dep.month.startsWith(monthFilter)
    return matchesSearch && matchesMonth
  })

  // Generate dynamic month options starting from 2026
  const monthOptions = React.useMemo(() => generateMonthOptions(2026, 0), [])

  const filterConfigs = [
    {
      label: "Filter by Status",
      value: statusFilter,
      onValueChange: setStatusFilter,
      options: [
        { label: "All Statuses", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ]
    },
    {
      label: "Filter by Month",
      value: monthFilter,
      onValueChange: setMonthFilter,
      options: monthOptions
    }
  ]

  const columns: Column<any>[] = [
    {
      header: "Member",
      render: (dep) => (
        <div className="flex items-center gap-3">
          <CustomAvatar
            initials={dep.userId.fullName
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
            size="sm"
          />
          <div className="flex flex-col text-left">
            <span className="font-semibold text-foreground leading-tight">
              {dep.userId.fullName}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {dep.userId.email}
            </span>
          </div>
        </div>
      )
    },
    {
      header: "Amount",
      render: (dep) => (
        <span className="font-bold text-foreground">
          PKR {dep.amount.toLocaleString()}
        </span>
      )
    },
    {
      header: "Month",
      render: (dep) => (
        <span className="text-muted-foreground font-medium">
          {formatMonthPK(dep.month)}
        </span>
      )
    },
    {
      header: "Receipt",
      render: (dep) => (
        <a
          href={dep.receiptUrl || dep.screenshotUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center gap-1.5 text-xs font-medium"
        >
          <ExternalLink className="size-3" />
          View
        </a>
      )
    },
    {
      header: "Status",
      render: (dep) => (
        <CustomBadge variant={dep.status}>
          {dep.status}
        </CustomBadge>
      )
    },
    {
      header: "Date",
      render: (dep) => (
        <span className="text-muted-foreground text-[11px]">
          {formatDatePK(dep.createdAt)}
        </span>
      )
    },
    {
      header: "Actions",
      render: (dep) => {
        const isOwnDeposit = dep.userId?._id === session?.user?.id

        if (dep.status !== "pending") {
          return (
            <span className="text-[10px] uppercase font-bold text-muted-foreground/40 tracking-wider">
              Processed
            </span>
          )
        }

        if (isOwnDeposit) {
          return (
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-md border border-amber-500/20">
              Own Deposit (Disabled)
            </span>
          )
        }

        return (
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
        )
      }
    }
  ]

  return (
    <>
      <PageHeader
        title="Deposits"
        description="Review and manage member deposit submissions"
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchLabel="Search Members"
        searchPlaceholder="Search by name or email..."
        filters={filterConfigs}
      />

      {/* Deposits Table */}
      <QueryBoundary
        isLoading={isLoading}
        loadingPlaceholder={<SkeletonPatterns.Table rows={8} />}
        error={error}
        onRetry={refetch}
        isEmpty={!isLoading && filteredDeposits.length === 0}
        emptyTitle={searchQuery || monthFilter !== "all" ? "No matching deposits found" : "No deposits found"}
        emptyDescription={searchQuery || monthFilter !== "all" ? "Try adjusting your filters" : "Deposit history will appear here once submitted by members"}
        emptyIcon={Clock}
      >
        <DataTable
          data={filteredDeposits}
          columns={columns}
          keyExtractor={(dep) => dep._id}
        />
      </QueryBoundary>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={isApproveOpen}
        onOpenChange={setIsApproveOpen}
        title="Approve Deposit"
        description={`Confirm receipt of PKR ${selectedDeposit?.amount.toLocaleString()} from ${selectedDeposit?.userId.fullName} for ${selectedDeposit ? formatMonthPK(selectedDeposit.month) : ""}?`}
        onConfirm={async () => {
          if (selectedDeposit) approveDeposit.mutate(selectedDeposit._id)
          setIsApproveOpen(false)
        }}
        confirmText="Confirm Approval"
        variant="success"
      />

      <ConfirmDialog
        open={isRejectOpen}
        onOpenChange={setIsRejectOpen}
        title="Reject Deposit"
        description={`Reject deposit of PKR ${selectedDeposit?.amount.toLocaleString()} from ${selectedDeposit?.userId.fullName}? This action cannot be undone.`}
        onConfirm={async () => {
          if (selectedDeposit) rejectDeposit.mutate(selectedDeposit._id)
          setIsRejectOpen(false)
        }}
        confirmText="Reject Deposit"
        variant="destructive"
      />
    </>
  )
}
