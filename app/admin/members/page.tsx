"use client"

import * as React from "react"
import { CustomCard } from "@/components/ui/CustomCard"
import { CustomButton } from "@/components/ui/CustomButton"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { CustomInput } from "@/components/ui/CustomInput"
import { CustomAvatar } from "@/components/ui/CustomAvatar"
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

// ── Mock Data ──
const activeMembers = [
  { id: "1", name: "Ahmed Raza", email: "ahmed@email.com", target: "PKR 15,000", balance: "PKR 97,500", joined: "Jan 15, 2025" },
  { id: "2", name: "Fatima Noor", email: "fatima@email.com", target: "PKR 12,000", balance: "PKR 84,000", joined: "Feb 3, 2025" },
  { id: "3", name: "Hassan Ali", email: "hassan@email.com", target: "PKR 20,000", balance: "PKR 1,40,000", joined: "Dec 8, 2024" },
  { id: "4", name: "Sana Malik", email: "sana@email.com", target: "PKR 10,000", balance: "PKR 60,000", joined: "Mar 22, 2025" },
  { id: "5", name: "Usman Sheikh", email: "usman@email.com", target: "PKR 18,000", balance: "PKR 1,08,000", joined: "Jan 1, 2025" },
  { id: "6", name: "Zainab Iqbal", email: "zainab@email.com", target: "PKR 15,000", balance: "PKR 45,000", joined: "Apr 10, 2025" },
]

const pendingMembers = [
  { id: "p1", name: "Bilal Khan", email: "bilal@email.com", date: "Jun 10, 2026" },
  { id: "p2", name: "Ayesha Siddiqui", email: "ayesha@email.com", date: "Jun 9, 2026" },
]

type Tab = "active" | "pending"

export default function AdminMembersPage() {
  const [activeTab, setActiveTab] = React.useState<Tab>("active")
  const [addMemberOpen, setAddMemberOpen] = React.useState(false)
  
  // Confirmation states
  const [isDeactivateOpen, setIsDeactivateOpen] = React.useState(false)
  const [isApproveOpen, setIsApproveOpen] = React.useState(false)
  const [selectedMember, setSelectedMember] = React.useState<{id: string, name: string} | null>(null)

  const handleDeactivate = (member: {id: string, name: string}) => {
    setSelectedMember(member)
    setIsDeactivateOpen(true)
  }

  const handleApprove = (member: {id: string, name: string}) => {
    setSelectedMember(member)
    setIsApproveOpen(true)
  }

  const handleAddMemberSubmit = () => {
    setAddMemberOpen(false)
    toast.success("New member account created successfully")
  }

  return (
    <AnimatedSection className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <AnimatedSection direction="right" delay="100" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight font-serif text-foreground">
            Members
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage member accounts and approve new signups
          </p>
        </div>

        <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
          <DialogTrigger asChild>
            <CustomButton className="gap-2 shrink-0">
              <UserPlus className="size-4" />
              Add Member
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-lg">
                Add New Member
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
              />
              <CustomInput
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                icon={<Mail />}
              />
              <CustomInput
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock />}
              />
              <CustomInput
                label="Monthly Target (PKR)"
                type="number"
                placeholder="15000"
                icon={<Target />}
              />
            </div>
            <DialogFooter>
              <CustomButton
                variant="ghost"
                onClick={() => setAddMemberOpen(false)}
              >
                Cancel
              </CustomButton>
              <CustomButton onClick={handleAddMemberSubmit}>
                Create Member
              </CustomButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AnimatedSection>

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
        <AnimatedSection delay="300">
          <CustomCard
          className="overflow-hidden"
          body={
            <div className="-mx-8 -my-8">
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
                    <TableRow key={member.id}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <CustomAvatar
                            initials={member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                            size="sm"
                          />
                          <span className="font-medium text-foreground">
                            {member.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {member.email}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {member.target}
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        {member.balance}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {member.joined}
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
                            onClick={() => handleDeactivate({ id: member.id, name: member.name })}
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
            </div>
          }
        />
        </AnimatedSection>
      )}

      {/* Pending Approval Cards */}
      {activeTab === "pending" && (
        <AnimatedSection delay="300" className="space-y-5">
          {pendingMembers.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20 border border-dashed border-border rounded-2xl">
              <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center">
                <Users className="size-8 text-muted-foreground/30" />
              </div>
              <div className="space-y-1">
                <p className="text-foreground font-semibold">
                  No pending approvals
                </p>
                <p className="text-sm text-muted-foreground">
                  All signup requests have been reviewed
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pendingMembers.map((user) => (
                <CustomCard
                  key={user.id}
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
                        <h3 className="font-bold text-foreground">{user.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="size-3" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="size-3" />
                          <span>Signed up {user.date}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <CustomButton 
                          size="sm" 
                          className="flex-1 gap-1 shadow-md"
                          onClick={() => handleApprove({ id: user.id, name: user.name })}
                        >
                          <Check className="size-3.5" />
                          Approve
                        </CustomButton>
                        <CustomButton
                          variant="ghost"
                          size="sm"
                          className="flex-1 gap-1 text-destructive hover:bg-destructive/10"
                          onClick={() => toast.error(`Rejected signup for ${user.name}`)}
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
          )}
        </AnimatedSection>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={isDeactivateOpen}
        onOpenChange={setIsDeactivateOpen}
        title="Deactivate Member"
        description={`Are you sure you want to deactivate ${selectedMember?.name}? They will lose access to all features immediately.`}
        onConfirm={async () => {
          toast.warning(`${selectedMember?.name} has been deactivated`)
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
          toast.success(`${selectedMember?.name} is now an active member`)
          setIsApproveOpen(false)
        }}
        confirmText="Approve Member"
        variant="success"
      />
    </AnimatedSection>
  )
}
