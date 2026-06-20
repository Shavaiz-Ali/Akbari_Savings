"use client"

import * as React from "react"
import { Users, Pencil, UserX } from "lucide-react"
import { CustomAvatar } from "@/components/ui/CustomAvatar"
import { CustomButton } from "@/components/ui/CustomButton"
import { QueryBoundary } from "@/components/ui/QueryBoundary"
import { CardTable } from "@/components/ui/CardTable"
import { SkeletonPatterns } from "@/components/ui/Skeleton"
import { formatDatePK } from "@/lib/dateUtils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IMemberUser } from "@/services/memberService/api"

interface ActiveMembersTableProps {
  members: IMemberUser[]
  isLoading: boolean
  error: any
  onRetry: () => void
  onDeactivate: (member: { id: string; name: string }) => void
}

export function ActiveMembersTable({
  members,
  isLoading,
  error,
  onRetry,
  onDeactivate,
}: ActiveMembersTableProps) {
  return (
    <QueryBoundary
      isLoading={isLoading}
      loadingPlaceholder={<SkeletonPatterns.Table rows={8} />}
      error={error}
      onRetry={onRetry}
      isEmpty={!isLoading && members.length === 0}
      emptyIcon={Users}
      emptyTitle="No active members yet"
      emptyDescription="Active members will appear here once accounts are approved"
    >
      <CardTable>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="pl-6">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Monthly Target</TableHead>
              <TableHead>Total Balance</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member._id}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <CustomAvatar
                      initials={member.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                      size="sm"
                    />
                    <span className="font-medium text-foreground">
                      {member.fullName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {member.email}
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  PKR {member.monthlyTarget.toLocaleString()}
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  PKR {member.totalBalance.toLocaleString()}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {formatDatePK(member.createdAt)}
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <CustomButton
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs"
                    >
                      <Pencil className="size-3" />
                      Edit
                    </CustomButton>
                    <CustomButton
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs text-destructive hover:bg-destructive/10"
                      onClick={() => onDeactivate({ id: member._id, name: member.fullName })}
                    >
                      <UserX className="size-3" />
                      Deactivate
                    </CustomButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardTable>
    </QueryBoundary>
  )
}
