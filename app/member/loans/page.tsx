import type { Metadata } from "next"
import { Lock, Construction } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { EmptyState } from "@/components/ui/EmptyState"

export const metadata: Metadata = {
  title: "Loans | Akbari Savings",
  description: "Apply for saving-backed loans.",
}

export default function MemberLoansPage() {
  return (
    <>
      <PageHeader
        title="Loans"
        description="Apply for low-interest saving-backed loans"
      />

      <EmptyState
        icon={Lock}
        title="Loans Module Coming Soon"
        description="The loan request and tracking system is currently under development. This feature will be available in a future update."
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/60 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
          <Construction className="size-4" />
          Under Construction
        </div>
      </EmptyState>
    </>
  )
}
