"use client"

import { Sidebar } from "@/components/layout/Sidebar"
import {
  LayoutDashboard,
  Wallet,
  Landmark,
} from "lucide-react"

const memberNavItems = [
  {
    label: "Dashboard",
    href: "/member/dashboard",
    icon: <LayoutDashboard className="size-5" />,
  },
  {
    label: "My Deposits",
    href: "/member/deposits",
    icon: <Wallet className="size-5" />,
  },
  {
    label: "Apply for Loan",
    href: "/member/loans",
    icon: <Landmark className="size-5" />,
    badge: "Soon",
  },
]

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Sidebar navItems={memberNavItems} role="member">
      {children}
    </Sidebar>
  )
}
