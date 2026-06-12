"use client"

import { Sidebar } from "@/components/layout/Sidebar"
import { adminNavItems } from "@/lib/navigation"

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
