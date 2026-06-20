import type { Metadata } from "next"
import { MembersPageClient } from "@/components/admin/members/MembersPageClient"

export const metadata: Metadata = {
  title: "Members | Akbari Savings Admin",
  description: "Manage member accounts and signup requests.",
}

export default function AdminMembersPage() {
  return <MembersPageClient />
}
