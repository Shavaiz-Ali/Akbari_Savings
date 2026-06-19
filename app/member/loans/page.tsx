import type { Metadata } from "next"
import { Lock, Construction } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { EmptyState } from "@/components/ui/EmptyState"

export const metadata: Metadata = {
  title: "Loans | Akbari Savings",
  description: "Apply for interest-free loans and track your repayment progress.",
}

export default function MemberLoansPage() {
  return (
    <>
      <PageHeader
        title="Loans"
        description="Apply for interest-free loans and track your repayment progress"
      />

      <EmptyState
        icon={Lock}
        title="Loan Module Coming Soon"
        description="The loan application system is currently under development. You will be able to apply for interest-free loans once the module is released."
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/60 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
          <Construction className="size-4" />
          Under Construction
        </div>
      </EmptyState>
    </>
  )
}
