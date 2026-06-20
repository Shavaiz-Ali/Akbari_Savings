export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: string
}

export const adminNavItems: NavItem[] = [
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
    label: "Submit My Deposit",
    href: "?deposit=true",
    icon: "Coins",
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

export const memberNavItems: NavItem[] = [
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
