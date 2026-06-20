"use client"

import * as React from "react"
import { Upload, X, Coins, MessageSquare, AlertTriangle, CheckCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { CustomInput } from "@/components/ui/CustomInput"
import { FormDialog } from "@/components/ui/FormDialog"
import { useSubmitDeposit } from "@/services/depositService/hooks"
import { cn } from "@/lib/utils"
import { DEFAULT_MONTHLY_TARGET } from "@/lib/constants"

interface SubmitDepositDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubmitDepositDialog({ open, onOpenChange }: SubmitDepositDialogProps) {
  const submitDeposit = useSubmitDeposit()

  // Fetch me endpoint to get recommended target amount
  const { data: meData } = useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me")
      if (!res.ok) throw new Error("Failed to fetch user data")
      const result = await res.json()
      return result.data as { monthlyTarget: number }
    },
    enabled: open, // Only run query when dialog opens
  })

  const monthlyTarget = meData?.monthlyTarget ?? DEFAULT_MONTHLY_TARGET

  const [amount, setAmount] = React.useState("")
  const [note, setNote] = React.useState("")
  const [file, setFile] = React.useState<File | null>(null)
  const [filePreview, setFilePreview] = React.useState<string | null>(null)
  const [dragActive, setDragActive] = React.useState(false)

  // Sync default amount when monthlyTarget is loaded
  React.useEffect(() => {
    if (open && monthlyTarget) {
      setAmount(monthlyTarget.toString())
    }
  }, [open, monthlyTarget])

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setAmount("")
      setNote("")
      setFile(null)
      setFilePreview(null)
    }
  }, [open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      processFile(selected)
    }
  }

  const processFile = (selected: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
      alert("Invalid file type. Only JPG, PNG, and WebP are allowed.")
      return
    }
    if (selected.size > 5 * 1024 * 1024) {
      alert("File size must not exceed 5 MB.")
      return
    }
    setFile(selected)
    const reader = new FileReader()
    reader.onloadend = () => {
      setFilePreview(reader.result as string)
    }
    reader.readAsDataURL(selected)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      processFile(droppedFile)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setFilePreview(null)
  }

  const handleSubmit = async () => {
    if (!file) return

    // Fix month to the first day of current month
    const now = new Date()
    const currentMonthVal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`

    const formData = new FormData()
    formData.append("amount", amount)
    formData.append("month", currentMonthVal)
    formData.append("note", note)
    formData.append("screenshot", file)

    await submitDeposit.mutateAsync(formData, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Submit Monthly Saving"
      description="Upload your savings transfer receipt. The month will automatically be set to the current month."
      onSubmit={handleSubmit}
      submitText="Submit Saving Proof"
      submitPendingText="Submitting..."
      isPending={submitDeposit.isPending}
      className="max-h-[85vh] overflow-y-auto"
    >
      <div className="space-y-4">
        {/* Recommended amount info */}
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-2.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Your Monthly Target:</span>
          <span className="font-bold text-foreground">PKR {monthlyTarget.toLocaleString()}</span>
        </div>

        {/* Amount Input */}
        <CustomInput
          label="Deposit Amount (PKR)"
          type="number"
          placeholder="Enter amount"
          icon={<Coins />}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={1}
          required
        />

        {/* Notes input */}
        <CustomInput
          label="Notes / Reference (Optional)"
          type="text"
          placeholder="E.g., Bank transfer reference"
          icon={<MessageSquare />}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* File upload drag drop zone */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 ml-0.5">
            Proof of Deposit (Receipt Image)
          </label>

          {!filePreview ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer min-h-[160px]",
                dragActive
                  ? "border-primary bg-primary/5 scale-[0.99]"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              )}
              onClick={() => document.getElementById("dialog-receipt-upload")?.click()}
            >
              <input
                id="dialog-receipt-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
                required
              />
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Upload className="size-5" />
              </div>
              <div className="text-center space-y-0.5">
                <p className="text-xs font-semibold text-foreground">
                  Click to upload or drag & drop
                </p>
                <p className="text-[10px] text-muted-foreground">
                  JPG, PNG or WebP up to 5MB
                </p>
              </div>
            </div>
          ) : (
            <div className="relative border border-border rounded-xl p-3 bg-muted/20 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-2.5 right-2.5 p-1 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
              >
                <X className="size-3.5" />
              </button>
              <div className="w-[120px] aspect-[3/4] relative overflow-hidden rounded-lg border border-border shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={filePreview}
                  alt="Receipt preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="size-3.5" />
                <span className="truncate max-w-[150px]">{file?.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 flex items-start gap-2">
          <AlertTriangle className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-800 dark:text-amber-300 leading-relaxed text-left">
            The month is automatically locked to the current calendar month. Double check the transfer screenshot.
          </p>
        </div>
      </div>
    </FormDialog>
  )
}
