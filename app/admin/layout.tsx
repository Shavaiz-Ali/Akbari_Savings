import type { ReactNode } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { adminNavItems } from "@/lib/navigation"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Sidebar navItems={adminNavItems} role="admin">
      {children}
    </Sidebar>
  )
}
