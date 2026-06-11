"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/Logo"
import { CustomAvatar } from "@/components/ui/CustomAvatar"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { SignOutButton } from "./SignOutButton"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

export interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
}

interface SidebarProps {
  navItems: NavItem[]
  role: "admin" | "member"
  children: React.ReactNode
}

export function Sidebar({ navItems, role, children }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const userName = session?.user?.name || "User"
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-sidebar-border/50 flex items-center justify-between">
        <Logo size="sm" />
        <ThemeToggle />
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <span className="flex items-center justify-center size-5">
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <CustomBadge
                  variant="pending"
                  className="text-[9px] px-1.5 py-0 leading-4"
                >
                  {item.badge}
                </CustomBadge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-sidebar-border/50 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <CustomAvatar initials={initials} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">
              {userName}
            </p>
            <CustomBadge
              variant="approved"
              className="text-[9px] px-1.5 py-0 leading-4 mt-0.5"
            >
              {role}
            </CustomBadge>
          </div>
        </div>
        <SignOutButton />
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 bg-sidebar border-r border-sidebar-border">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <X className="size-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-background">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-foreground hover:bg-accent transition-colors"
          >
            <Menu className="size-5" />
          </button>
          <Logo size="sm" />
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto bg-background">
          {children}
        </div>
      </main>
    </div>
  )
}
