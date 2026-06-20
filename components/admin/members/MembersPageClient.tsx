"use client"

import * as React from "react"
import { UserPlus } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { CustomButton } from "@/components/ui/CustomButton"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { useActiveMembers, usePendingMembers, useCreateMember, useDeactivateMember, useApproveMember, useRejectMember } from "@/services/memberService/hooks"
import { IMemberUser } from "@/services/memberService/api"

import { MembersTabs } from "./MembersTabs"
import { ActiveMembersTable } from "./ActiveMembersTable"
import { PendingMembersGrid } from "./PendingMembersGrid"
import { AddMemberDialog } from "./AddMemberDialog"

type Tab = "active" | "pending"

export function MembersPageClient() {
  const [activeTab, setActiveTab] = React.useState<Tab>("active")
  const [addMemberOpen, setAddMemberOpen] = React.useState(false)

  // Confirmation states
  const [isDeactivateOpen, setIsDeactivateOpen] = React.useState(false)
  const [isApproveOpen, setIsApproveOpen] = React.useState(false)
  const [selectedMember, setSelectedMember] = React.useState<{ id: string; name: string } | null>(null)

  // Data hooks
  const { data: activeData, isLoading: loadingActive, error: errorActive, refetch: refetchActive } = useActiveMembers()
  const { data: pendingData, isLoading: loadingPending, error: errorPending, refetch: refetchPending } = usePendingMembers()

  const activeMembers: IMemberUser[] = activeData?.data ?? []
  const pendingMembers: IMemberUser[] = pendingData?.data ?? []

  // Mutation hooks
  const createMember = useCreateMember()
  const deactivateMember = useDeactivateMember()
  const approveMember = useApproveMember()
  const rejectMember = useRejectMember()

  const handleDeactivate = (member: { id: string; name: string }) => {
    setSelectedMember(member)
    setIsDeactivateOpen(true)
  }

  const handleApprove = (member: { id: string; name: string }) => {
    setSelectedMember(member)
    setIsApproveOpen(true)
  }

  const handleAddMemberSubmit = async (formData: Parameters<React.ComponentProps<typeof AddMemberDialog>["onSubmit"]>[0]) => {
    await createMember.mutateAsync(formData, {
      onSuccess: () => {
        setAddMemberOpen(false)
      },
    })
  }

  return (
    <>
      <PageHeader
        title="Members"
        description="Manage member accounts and approve new signups"
      >
        <CustomButton className="gap-2 shrink-0" onClick={() => setAddMemberOpen(true)}>
          <UserPlus className="size-4" />
          Add Member
        </CustomButton>
      </PageHeader>

      {/* Tabs */}
      <MembersTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeCount={activeMembers.length}
        pendingCount={pendingMembers.length}
      />

      {/* Active Members Table */}
      {activeTab === "active" && (
        <ActiveMembersTable
          members={activeMembers}
          isLoading={loadingActive}
          error={errorActive}
          onRetry={refetchActive}
          onDeactivate={handleDeactivate}
        />
      )}

      {/* Pending Approval Cards */}
      {activeTab === "pending" && (
        <PendingMembersGrid
          members={pendingMembers}
          isLoading={loadingPending}
          error={errorPending}
          onRetry={refetchPending}
          onApprove={handleApprove}
          onReject={(id) => rejectMember.mutate(id)}
        />
      )}

      {/* Modals & Dialogs */}
      <AddMemberDialog
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
        onSubmit={handleAddMemberSubmit}
        isPending={createMember.isPending}
      />

      <ConfirmDialog
        open={isDeactivateOpen}
        onOpenChange={setIsDeactivateOpen}
        title="Deactivate Member"
        description={`Are you sure you want to deactivate ${selectedMember?.name}? They will lose access to all features immediately.`}
        onConfirm={async () => {
          if (selectedMember) {
            await deactivateMember.mutateAsync(selectedMember.id)
          }
          setIsDeactivateOpen(false)
        }}
        confirmText="Deactivate Member"
        variant="destructive"
      />

      <ConfirmDialog
        open={isApproveOpen}
        onOpenChange={setIsApproveOpen}
        title="Approve Member"
        description={`Approving ${selectedMember?.name} will grant them access to the member dashboard.`}
        onConfirm={async () => {
          if (selectedMember) {
            await approveMember.mutateAsync(selectedMember.id)
          }
          setIsApproveOpen(false)
        }}
        confirmText="Approve Member"
        variant="success"
      />
    </>
  )
}
