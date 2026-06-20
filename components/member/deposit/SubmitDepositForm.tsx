"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Coins, MessageSquare, Image as ImageIcon, CheckCircle, AlertTriangle } from "lucide-react"
import { CustomInput } from "@/components/ui/CustomInput"
import { CustomButton } from "@/components/ui/CustomButton"
import { CustomCard } from "@/components/ui/CustomCard"
import { useSubmitDeposit } from "@/services/depositService/hooks"
import { cn } from "@/lib/utils"

interface SubmitDepositFormProps {
  user: {
    monthlyTarget: number
  }
}

export function SubmitDepositForm({ user }: SubmitDepositFormProps) {
  const router = useRouter()
  const submitDeposit = useSubmitDeposit()

  const [amount, setAmount] = React.useState(user.monthlyTarget.toString())
  const [note, setNote] = React.useState("")
  const [selectedMonth, setSelectedMonth] = React.useState("")
  const [file, setFile] = React.useState<File | null>(null)
  const [filePreview, setFilePreview] = React.useState<string | null>(null)
  const [dragActive, setDragActive] = React.useState(false)

  // Generate options: past 2 months, current month, and next month
  const monthOptions = React.useMemo(() => {
    const options = []
    const now = new Date()
    // Let's offer past 2 months, current month, and next month
    for (let i = -1; i <= 2; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const value = d.toISOString().slice(0, 10) // "YYYY-MM-01"
      const label = d.toLocaleDateString("en-PK", { month: "long", year: "numeric" })
      options.push({ label, value })
    }
    return options
  }, [])

  // Set default month to current month
  React.useEffect(() => {
    const now = new Date()
    const currentMonthVal = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
    setSelectedMonth(currentMonthVal)
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append("amount", amount)
    formData.append("month", selectedMonth)
    formData.append("note", note)
    formData.append("screenshot", file)

    await submitDeposit.mutateAsync(formData, {
      onSuccess: () => {
        router.push("/member/deposits")
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <CustomCard
        className="border-sidebar-border shadow-xl p-2"
        body={
          <div className="space-y-6 p-4">
            {/* Month & Amount Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
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
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Minimum recommended savings: PKR {user.monthlyTarget.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 ml-0.5 block">
                  Select Saving Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full h-12 px-3 rounded-lg border border-input bg-background/50 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                  required
                >
                  {monthOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Note Field */}
            <div className="space-y-2">
              <CustomInput
                label="Notes / Reference (Optional)"
                type="text"
                placeholder="E.g., paid online, reference number"
                icon={<MessageSquare />}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* Receipt Upload Box */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Upload className="size-4 text-primary" />
                Proof of Deposit (Receipt Image)
              </label>

              {!filePreview ? (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer min-h-[200px]",
                    dragActive
                      ? "border-primary bg-primary/5 scale-[0.99]"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  )}
                  onClick={() => document.getElementById("receipt-upload")?.click()}
                >
                  <input
                    id="receipt-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                    required
                  />
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Upload className="size-6" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      JPG, PNG or WebP up to 5MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative border border-border rounded-xl p-4 bg-muted/20 flex flex-col items-center gap-4">
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                  <div className="w-full max-w-[250px] aspect-[3/4] relative overflow-hidden rounded-lg border border-border shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={filePreview}
                      alt="Receipt preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="size-4" />
                    <span>Selected: {file?.name}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Warning or Tip Box */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2.5">
              <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed text-left">
                Ensure the receipt shows details of the transfer (date, amount, transaction reference, and our bank account). Admin review may take up to 24 hours.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <CustomButton
                type="submit"
                className="w-full justify-center py-6 text-sm font-semibold shadow-lg shadow-primary/20"
                disabled={submitDeposit.isPending || !file}
                isLoading={submitDeposit.isPending}
              >
                Submit Deposit proof
              </CustomButton>
            </div>
          </div>
        }
      />
    </form>
  )
}
