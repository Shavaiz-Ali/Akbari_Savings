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
import { AlertCircle, HelpCircle, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void | Promise<void>
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive" | "success" | "warning"
  isLoading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmDialogProps) {
  const icons = {
    default: <HelpCircle className="size-6 text-primary" />,
    destructive: <AlertCircle className="size-6 text-destructive" />,
    warning: <AlertTriangle className="size-6 text-amber-500" />,
    success: <CheckCircle2 className="size-6 text-emerald-500" />,
  }

  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="flex flex-col items-center gap-4 text-center sm:text-center">
          <div className={cn(
            "flex size-12 items-center justify-center rounded-full transition-all duration-500",
            variant === "default" && "bg-primary/10",
            variant === "destructive" && "bg-destructive/10 animate-pulse",
            variant === "warning" && "bg-amber-100",
            variant === "success" && "bg-emerald-100"
          )}>
            {icons[variant]}
          </div>
          <div className="space-y-1.5">
            <DialogTitle className="text-xl font-bold font-serif">{title}</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-2 flex-row gap-3 sm:flex-row sm:justify-center">
          <CustomButton
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </CustomButton>
          <CustomButton
            variant={variant === "destructive" ? "destructive" : "primary"}
            onClick={handleConfirm}
            isLoading={isLoading}
            className={cn(
              "flex-1 shadow-lg",
              variant === "success" && "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
            )}
          >
            {confirmText}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
