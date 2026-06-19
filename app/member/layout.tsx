import type { ReactNode } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { memberNavItems } from "@/lib/navigation"

export default function MemberLayout({ children }: { children: ReactNode }) {
  return (
    <Sidebar navItems={memberNavItems} role="member">
      {children}
    </Sidebar>
  )
}
