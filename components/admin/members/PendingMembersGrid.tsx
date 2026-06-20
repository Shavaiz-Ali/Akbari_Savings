"use client"

import * as React from "react"
import { Users, Mail, Calendar, Check, X, User as UserIcon } from "lucide-react"
import { CustomCard } from "@/components/ui/CustomCard"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { CustomButton } from "@/components/ui/CustomButton"
import { QueryBoundary } from "@/components/ui/QueryBoundary"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { SkeletonPatterns } from "@/components/ui/Skeleton"
import { formatDatePK } from "@/lib/dateUtils"
import { IMemberUser } from "@/services/memberService/api"

interface PendingMembersGridProps {
  members: IMemberUser[]
  isLoading: boolean
  error: any
  onRetry: () => void
  onApprove: (member: { id: string; name: string }) => void
  onReject: (id: string) => void
}

export function PendingMembersGrid({
  members,
  isLoading,
  error,
  onRetry,
  onApprove,
  onReject,
}: PendingMembersGridProps) {
  return (
    <QueryBoundary
      isLoading={isLoading}
      loadingPlaceholder={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <SkeletonPatterns.Card />
          <SkeletonPatterns.Card />
          <SkeletonPatterns.Card />
        </div>
      }
      error={error}
      onRetry={onRetry}
      isEmpty={!isLoading && members.length === 0}
      emptyIcon={Users}
      emptyTitle="No pending approvals"
      emptyDescription="All signup requests have been reviewed"
    >
      <AnimatedSection delay="300" className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((user) => (
            <CustomCard
              key={user._id}
              className="hover:border-primary/30 transition-colors duration-300"
              body={
                <div className="space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <UserIcon className="size-5" />
                    </div>
                    <CustomBadge variant="pending">Pending</CustomBadge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-foreground">{user.fullName}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="size-3" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="size-3" />
                      <span>Signed up {formatDatePK(user.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <CustomButton
                      size="sm"
                      className="flex-1 gap-1 shadow-md"
                      onClick={() => onApprove({ id: user._id, name: user.fullName })}
                    >
                      <Check className="size-3.5" />
                      Approve
                    </CustomButton>
                    <CustomButton
                      variant="ghost"
                      size="sm"
                      className="flex-1 gap-1 text-destructive hover:bg-destructive/10"
                      onClick={() => onReject(user._id)}
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
    </QueryBoundary>
  )
}
