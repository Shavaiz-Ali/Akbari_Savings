"use client"

import { Sidebar } from "@/components/layout/Sidebar"
import { memberNavItems } from "@/lib/navigation"

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
