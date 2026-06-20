import type { Metadata } from "next"
import { MemberDepositsClient } from "@/components/member/deposits/MemberDepositsClient"

export const metadata: Metadata = {
  title: "My Deposits | Akbari Savings",
  description: "View history of your monthly savings deposits.",
}

export default function MemberDepositsPage() {
  return <MemberDepositsClient />
}
