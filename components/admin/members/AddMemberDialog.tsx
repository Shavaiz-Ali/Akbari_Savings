"use client"

import * as React from "react"
import { Mail, Lock, Target, User as UserIcon } from "lucide-react"
import { CustomInput } from "@/components/ui/CustomInput"
import { FormDialog } from "@/components/ui/FormDialog"

interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { fullName: string; email: string; password: string; monthlyTarget: number }) => void | Promise<void>
  isPending: boolean
}

export function AddMemberDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: AddMemberDialogProps) {
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [monthlyTarget] = React.useState("500")

  // Reset fields when dialog changes open state
  React.useEffect(() => {
    if (!open) {
      setFullName("")
      setEmail("")
      setPassword("")
    }
  }, [open])

  const handleSubmit = async () => {
    await onSubmit({
      fullName,
      email,
      password,
      monthlyTarget: Number(monthlyTarget),
    })
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Member"
      description="Create a new member account. They will be automatically approved."
      onSubmit={handleSubmit}
      submitText="Create Member"
      submitPendingText="Creating..."
      isPending={isPending}
    >
      <CustomInput
        label="Full Name"
        placeholder="Enter full name"
        icon={<UserIcon />}
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <CustomInput
        label="Email Address"
        type="email"
        placeholder="name@example.com"
        icon={<Mail />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <CustomInput
        label="Password"
        type="password"
        placeholder="••••••••"
        icon={<Lock />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <CustomInput
        label="Monthly Target (PKR) - only member himself can update his monthly target"
        type="number"
        placeholder="min 500"
        icon={<Target />}
        value={monthlyTarget}
        disabled
      />
    </FormDialog>
  )
}
