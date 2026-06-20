"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CustomButton } from "@/components/ui/CustomButton"
import { Typography } from "@/components/ui/Typography"
import { cn } from "@/lib/utils"

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void | Promise<void>
  submitText?: string
  submitPendingText?: string
  isPending?: boolean
  className?: string
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitText = "Submit",
  submitPendingText = "Submitting...",
  isPending = false,
  className,
}: FormDialogProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isPending) return
    await onSubmit(e)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-md", className)} showCloseButton={!isPending}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle asChild>
              <Typography variant="h4">
                {title}
              </Typography>
            </DialogTitle>
            {description && (
              <DialogDescription>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-4 py-2">
            {children}
          </div>

          <DialogFooter>
            <CustomButton
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              disabled={isPending}
              isLoading={isPending}
            >
              {isPending ? submitPendingText : submitText}
            </CustomButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
