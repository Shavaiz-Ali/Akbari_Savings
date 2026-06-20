import type { Metadata } from "next"
import { DepositsPageClient } from "@/components/admin/deposits/DepositsPageClient"

export const metadata: Metadata = {
  title: "Deposits | Akbari Savings Admin",
  description: "Review and manage member deposit submissions.",
}

export default function AdminDepositsPage() {
  return <DepositsPageClient />
}
