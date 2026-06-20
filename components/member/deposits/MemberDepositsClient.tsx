"use client"

import * as React from "react"
import Link from "next/link"
import { Wallet, PlusCircle, ExternalLink } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { CustomButton } from "@/components/ui/CustomButton"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { DataTable, type Column } from "@/components/ui/DataTable"
import { QueryBoundary } from "@/components/ui/QueryBoundary"
import { SkeletonPatterns } from "@/components/ui/Skeleton"
import { formatDatePK, formatMonthPK } from "@/lib/dateUtils"
import { useMemberDeposits } from "@/services/depositService/hooks"

export function MemberDepositsClient() {
  const { data, isLoading, error, refetch } = useMemberDeposits()
  const deposits = data?.data ?? []

  const columns: Column<any>[] = [
    {
      header: "Month",
      render: (dep) => (
        <span className="font-semibold text-foreground">
          {formatMonthPK(dep.month)}
        </span>
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
      header: "Receipt",
      render: (dep) => (
        <a
          href={dep.receiptUrl || dep.screenshotUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center gap-1.5 text-xs font-medium"
        >
          <ExternalLink className="size-3" />
          View Receipt
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
      header: "Submission Date",
      render: (dep) => (
        <span className="text-muted-foreground text-xs">
          {formatDatePK(dep.createdAt)}
        </span>
      )
    },
    {
      header: "Admin Note",
      render: (dep) => (
        <span className="text-muted-foreground text-xs block max-w-xs truncate italic">
          {dep.note || "—"}
        </span>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Deposits"
        description="View status and history of your savings deposits."
      >
        <Link href="?deposit=true" passHref>
          <CustomButton className="gap-2 shadow-md">
            <PlusCircle className="size-4" />
            Submit Deposit
          </CustomButton>
        </Link>
      </PageHeader>

      <QueryBoundary
        isLoading={isLoading}
        loadingPlaceholder={<SkeletonPatterns.Table rows={8} />}
        error={error}
        onRetry={refetch}
        isEmpty={!isLoading && deposits.length === 0}
        emptyTitle="No deposits submitted yet"
        emptyDescription="Submit your monthly deposit proof to grow your savings balance."
        emptyIcon={Wallet}
      >
        <DataTable
          data={deposits}
          columns={columns}
          keyExtractor={(dep) => dep._id}
        />
      </QueryBoundary>
    </div>
  )
}
