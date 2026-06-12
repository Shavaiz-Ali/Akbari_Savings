import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Wallet,
  Landmark,
  Settings,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: string // We'll store icon name or component
  badge?: string
}

export const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "Members",
    href: "/admin/members",
    icon: "Users",
  },
  {
    label: "Deposits",
    href: "/admin/deposits",
    icon: "Wallet",
  },
  {
    label: "Loans",
    href: "/admin/loans",
    icon: "Landmark",
    badge: "Soon",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "Settings",
  },
]

export const memberNavItems = [
  {
    label: "Dashboard",
    href: "/member/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "My Deposits",
    href: "/member/deposits",
    icon: "Wallet",
  },
  {
    label: "Apply for Loan",
    href: "/member/loans",
    icon: "Landmark",
    badge: "Soon",
  },
]

export const getPageTitle = (path: string) => {
  // Admin routes
  if (path.startsWith("/admin/dashboard")) return "Admin Dashboard"
  if (path.startsWith("/admin/members")) return "Member Management"
  if (path.startsWith("/admin/deposits")) return "Deposit Records"
  if (path.startsWith("/admin/loans")) return "Loan Requests"
  if (path.startsWith("/admin/settings")) return "System Settings"
  
  // Member routes
  if (path.startsWith("/member/dashboard")) return "My Portfolio"
  if (path.startsWith("/member/deposits")) return "My Deposits"
  if (path.startsWith("/member/loans")) return "My Loans"
  
  // Default
  const segments = path.split("/").filter(Boolean)
  if (segments.length === 0) return "Akbari Savings"
  const lastSegment = segments[segments.length - 1]
  return lastSegment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

export const getIconComponent = (name: string) => {
  switch (name) {
    case "LayoutDashboard": return LayoutDashboard
    case "Users": return Users
    case "Wallet": return Wallet
    case "Landmark": return Landmark
    case "Settings": return Settings
    default: return LayoutDashboard
  }
}
