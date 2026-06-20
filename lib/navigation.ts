import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Wallet,
  Landmark,
  Settings,
  Coins,
} from "lucide-react"

export { adminNavItems, memberNavItems } from "./nav-config"
export type { NavItem } from "./nav-config"

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
  if (path.startsWith("/member/deposit")) return "Submit Deposit"
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
    case "Coins": return Coins
    case "Landmark": return Landmark
    case "Settings": return Settings
    default: return LayoutDashboard
  }
}

