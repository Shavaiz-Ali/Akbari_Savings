"use client"

import { Sidebar } from "@/components/layout/Sidebar"
import {
  LayoutDashboard,
  Users,
  Wallet,
  Landmark,
  Settings,
} from "lucide-react"

const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="size-5" />,
  },
  {
    label: "Members",
    href: "/admin/members",
    icon: <Users className="size-5" />,
  },
  {
    label: "Deposits",
    href: "/admin/deposits",
    icon: <Wallet className="size-5" />,
  },
  {
    label: "Loans",
    href: "/admin/loans",
    icon: <Landmark className="size-5" />,
    badge: "Soon",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings className="size-5" />,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Sidebar navItems={adminNavItems} role="admin">
      {children}
    </Sidebar>
  )
}
