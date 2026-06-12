"use client"

import * as React from "react"
import { CustomCard } from "@/components/ui/CustomCard"
import { CustomButton } from "@/components/ui/CustomButton"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { CustomInput } from "@/components/ui/CustomInput"
import { PageHeader } from "@/components/ui/PageHeader"
import { CardTable } from "@/components/ui/CardTable"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Upload,
  Clock,
  CheckCircle2,
  FileText,
  Calendar,
} from "lucide-react"

// ── Mock Data ──
const history = [
  { id: 1, month: "June 2026", amount: "PKR 15,000", status: "pending" as const, date: "Jun 10, 2026" },
  { id: 2, month: "May 2026", amount: "PKR 15,000", status: "approved" as const, date: "May 8, 2026" },
  { id: 3, month: "April 2026", amount: "PKR 15,000", status: "approved" as const, date: "Apr 5, 2026" },
  { id: 4, month: "March 2026", amount: "PKR 15,000", status: "approved" as const, date: "Mar 10, 2026" },
  { id: 5, month: "February 2026", amount: "PKR 15,000", status: "approved" as const, date: "Feb 12, 2026" },
  { id: 6, month: "January 2026", amount: "PKR 15,000", status: "rejected" as const, date: "Jan 10, 2026" },
]

export default function MemberDepositsPage() {
  const [submitOpen, setSubmitOpen] = React.useState(false)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const currentStatus = history[0].status // Using June as current

  const handleSubmit = () => {
    setSubmitOpen(false)
    setConfirmOpen(true)
  }

  const handleConfirmSubmit = async () => {
    toast.success("Deposit submission received. Awaiting admin approval.")
    setConfirmOpen(false)
  }

  return (
    <>
      <PageHeader 
        title="My Deposits" 
        description="Manage your monthly savings and submission history"
      >
        <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
          <DialogTrigger asChild>
            <CustomButton className="gap-2 shrink-0 h-11 px-6 shadow-primary/25 shadow-lg">
              <Plus className="size-4" />
              Submit Deposit
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                Submit Monthly Deposit
              </DialogTitle>
              <DialogDescription>
                Upload your deposit screenshot for the current month.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  label="Amount (PKR)"
                  type="number"
                  placeholder="15000"
                  defaultValue="15000"
                />
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 ml-0.5">
                    Select Month
                  </label>
                  <Select defaultValue="june-2026">
                    <SelectTrigger className="h-12 w-full bg-background/50 border-input transition-all duration-200">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="june-2026">June 2026</SelectItem>
                      <SelectItem value="july-2026">July 2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 ml-0.5">
                  Screenshot / Receipt
                </label>
                <div className="border-2 border-dashed border-border bg-muted/30 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3 hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="size-12 rounded-full bg-background flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    <Upload className="size-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or PDF (max. 5MB)</p>
                  </div>
                </div>
              </div>

              <CustomInput
                label="Note (Optional)"
                placeholder="Any message for the admin..."
                icon={<FileText />}
              />
            </div>
            <DialogFooter className="gap-3">
              <CustomButton
                variant="ghost"
                onClick={() => setSubmitOpen(false)}
                className="flex-1"
              >
                Cancel
              </CustomButton>
              <CustomButton onClick={handleSubmit} className="flex-1">
                Submit Request
              </CustomButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Current Month Status Section */}
      <AnimatedSection delay="200">
        {currentStatus === "pending" && (
           <CustomCard 
             className="bg-amber-500/5 border-amber-500/20 shadow-amber-500/5"
             body={
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="size-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                  <Clock className="size-8" />
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h3 className="text-lg font-bold text-foreground font-serif">Awaiting Admin Approval</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Your deposit for June 2026 has been submitted and is currently being reviewed by an admin.
                  </p>
                </div>
                <CustomBadge variant="pending" className="px-4 py-1 h-fit">Pending Review</CustomBadge>
              </div>
             }
           />
        )}
        {currentStatus === "approved" && (
           <CustomCard 
             className="bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5"
             body={
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="size-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <CheckCircle2 className="size-8" />
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h3 className="text-lg font-bold text-foreground font-serif">Deposit Approved</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Your deposit for the current month has been successfully processed and added to your balance.
                  </p>
                </div>
                <CustomBadge variant="approved" className="px-4 py-1 h-fit bg-emerald-500/10 text-emerald-600">✓ Approved</CustomBadge>
              </div>
             }
           />
        )}
      </AnimatedSection>

      {/* History Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold font-serif text-foreground leading-none">
            Deposit History
          </h2>
          <CustomBadge variant="pending">{history.length}</CustomBadge>
        </div>
        <CardTable>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="pl-6">Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Submitted Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <Calendar className="size-4 text-primary/60" />
                      {item.month}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {item.amount}
                  </TableCell>
                  <TableCell>
                    <CustomBadge variant={item.status}>
                      {item.status}
                    </CustomBadge>
                  </TableCell>
                  <TableCell className="pr-6 text-right text-muted-foreground text-xs">
                    {item.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardTable>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm Submission"
        description="Are you sure you want to submit this deposit request? Please ensure the screenshot clear and the amount is correct."
        onConfirm={handleConfirmSubmit}
        confirmText="Yes, Submit Now"
        variant="default"
      />
    </>
  )
}
