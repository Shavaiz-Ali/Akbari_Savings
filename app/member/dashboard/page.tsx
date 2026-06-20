import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/user"
import { MemberDashboardClient } from "@/components/member/dashboard/MemberDashboardClient"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Dashboard | Akbari Savings",
  description: "View your savings summary and account activity.",
}

export default async function MemberDashboardPage() {
  await connectDB()

  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  const userDoc = await User.findById(session.user.id)
  if (!userDoc) {
    redirect("/login")
  }

  const user = {
    fullName: userDoc.fullName,
    email: userDoc.email,
    totalBalance: userDoc.totalBalance,
    monthlyTarget: userDoc.monthlyTarget,
    createdAt: userDoc.createdAt.toISOString(),
  }

  return <MemberDashboardClient user={user} />
}
