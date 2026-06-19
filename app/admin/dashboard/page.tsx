import type { Metadata } from "next"
import { DashboardClient } from "@/components/admin/dashboard/DashboardClient"

export const metadata: Metadata = {
  title: "Dashboard | Akbari Savings",
}

export default function AdminDashboardPage() {
  return <DashboardClient />
}
