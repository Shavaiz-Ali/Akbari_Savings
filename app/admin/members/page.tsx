"use client"

import * as React from "react"
import { CustomCard } from "@/components/ui/CustomCard"
import { CustomButton } from "@/components/ui/CustomButton"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { CustomInput } from "@/components/ui/CustomInput"
import { CustomAvatar } from "@/components/ui/CustomAvatar"
import { QueryBoundary } from "@/components/ui/QueryBoundary"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { PageHeader } from "@/components/ui/PageHeader"
import { CardTable } from "@/components/ui/CardTable"
import { EmptyState } from "@/components/ui/EmptyState"
import { SkeletonPatterns } from "@/components/ui/Skeleton"
import { Typography } from "@/components/ui/Typography"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  UserPlus,
  Check,
  X,
  Mail,
  Calendar,
  Pencil,
  UserX,
  User as UserIcon,
  Lock,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useActiveMembers, usePendingMembers, useCreateMember, useDeactivateMember, useApproveMember, useRejectMember } from "@/services/memberService/hooks"
import { IMemberUser } from "@/services/memberService/api"

type Tab = "active" | "pending"

export default function AdminMembersPage() {
  const [activeTab, setActiveTab] = React.useState<Tab>("active")
  const [addMemberOpen, setAddMemberOpen] = React.useState(false)

  // Form fields
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [monthlyTarget, setMonthlyTarget] = React.useState("")

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

  const clearForm = () => {
    setFullName("")
    setEmail("")
    setPassword("")
    setMonthlyTarget("")
  }

  const handleAddMemberSubmit = () => {
    createMember.mutate(
      {
        fullName,
        email,
        password,
        monthlyTarget: Number(monthlyTarget),
      },
      {
        onSuccess: () => {
          setAddMemberOpen(false)
          clearForm()
        },
      }
    )
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-PK", { month: "short", day: "numeric", year: "numeric" })

  return (
    <>
      <PageHeader
        title="Members"
        description="Manage member accounts and approve new signups"
      >
        <Dialog
          open={addMemberOpen}
          onOpenChange={(open) => {
            setAddMemberOpen(open)
            if (!open) clearForm()
          }}
        >
          <DialogTrigger asChild>
            <CustomButton className="gap-2 shrink-0">
              <UserPlus className="size-4" />
              Add Member
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle asChild>
                <Typography variant="h4">
                  Add New Member
                </Typography>
              </DialogTitle>
              <DialogDescription>
                Create a new member account. They will be automatically approved.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <CustomInput
                label="Full Name"
                placeholder="Enter full name"
                icon={<UserIcon />}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <CustomInput
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                icon={<Mail />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <CustomInput
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <CustomInput
                label="Monthly Target (PKR)"
                type="number"
                placeholder="15000"
                icon={<Target />}
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(e.target.value)}
              />
            </div>
            <DialogFooter>
              <CustomButton
                variant="ghost"
                onClick={() => setAddMemberOpen(false)}
              >
                Cancel
              </CustomButton>
              <CustomButton
                onClick={handleAddMemberSubmit}
                disabled={createMember.isPending}
              >
                {createMember.isPending ? "Creating…" : "Create Member"}
              </CustomButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Tabs */}
      <AnimatedSection delay="200" className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("active")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
            activeTab === "active"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Active Members
          <span className="ml-2 text-xs opacity-60">
            ({activeMembers.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
            activeTab === "pending"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Pending Approval
          <span className="ml-2 text-xs opacity-60">
            ({pendingMembers.length})
          </span>
        </button>
      </AnimatedSection>

      {/* Active Members Table */}
      {activeTab === "active" && (
        <QueryBoundary
          isLoading={loadingActive}
          loadingPlaceholder={<SkeletonPatterns.Table rows={8} />}
          error={errorActive}
          onRetry={refetchActive}
          isEmpty={!loadingActive && activeMembers.length === 0}
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
                {activeMembers.map((member) => (
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
                      {formatDate(member.createdAt)}
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
                          onClick={() => handleDeactivate({ id: member._id, name: member.fullName })}
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
      )}

      {/* Pending Approval Cards */}
      {activeTab === "pending" && (
        <QueryBoundary
          isLoading={loadingPending}
          loadingPlaceholder={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <SkeletonPatterns.Card />
              <SkeletonPatterns.Card />
              <SkeletonPatterns.Card />
            </div>
          }
          error={errorPending}
          onRetry={refetchPending}
          isEmpty={!loadingPending && pendingMembers.length === 0}
          emptyIcon={Users}
          emptyTitle="No pending approvals"
          emptyDescription="All signup requests have been reviewed"
        >
          <AnimatedSection delay="300" className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pendingMembers.map((user) => (
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
                          <span>Signed up {formatDate(user.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <CustomButton
                          size="sm"
                          className="flex-1 gap-1 shadow-md"
                          onClick={() => handleApprove({ id: user._id, name: user.fullName })}
                        >
                          <Check className="size-3.5" />
                          Approve
                        </CustomButton>
                        <CustomButton
                          variant="ghost"
                          size="sm"
                          className="flex-1 gap-1 text-destructive hover:bg-destructive/10"
                          onClick={() => rejectMember.mutate(user._id)}
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
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={isDeactivateOpen}
        onOpenChange={setIsDeactivateOpen}
        title="Deactivate Member"
        description={`Are you sure you want to deactivate ${selectedMember?.name}? They will lose access to all features immediately.`}
        onConfirm={async () => {
          if (selectedMember) deactivateMember.mutate(selectedMember.id)
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
          if (selectedMember) approveMember.mutate(selectedMember.id)
          setIsApproveOpen(false)
        }}
        confirmText="Approve Member"
        variant="success"
      />
    </>
  )
}
