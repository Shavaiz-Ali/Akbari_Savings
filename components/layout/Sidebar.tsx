"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/Logo"
import { CustomAvatar } from "@/components/ui/CustomAvatar"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { SignOutButton } from "./SignOutButton"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { DashboardHeader } from "./DashboardHeader"

import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { getIconComponent } from "@/lib/navigation"
import { SubmitDepositDialog } from "../member/deposit/SubmitDepositDialog"

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: string
}

interface SidebarProps {
  navItems: NavItem[]
  role: "admin" | "member"
  children: React.ReactNode
}

function DepositDialogSync() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const showDepositDialog = searchParams.get("deposit") === "true"

  const handleCloseDepositDialog = (open: boolean) => {
    if (!open) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("deposit")
      const query = params.toString() ? `?${params.toString()}` : ""
      router.replace(`${pathname}${query}`)
    }
  }

  return (
    <SubmitDepositDialog open={showDepositDialog} onOpenChange={handleCloseDepositDialog} />
  )
}

export function Sidebar({ navItems, role, children }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const userName = session?.user?.name || "User"

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-sidebar-border/50 flex items-center justify-between">
        <Logo size="sm" />
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = getIconComponent(item.icon)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <span className="flex items-center justify-center size-5">
                <Icon className="size-5" />
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

      {/* User section (Simplified) */}
      <div className="px-4 py-4 border-t border-sidebar-border/50">
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
        {/* Unified Header */}
        <div className="flex flex-col border-b border-border/50 bg-background/50 backdrop-blur-sm relative z-30">
          <div className="lg:hidden flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              <Menu className="size-5" />
            </button>
            <Logo size="sm" />
          </div>
          <DashboardHeader />
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto bg-background p-4 lg:p-6 pb-12 pb-12">
          <div className="max-w-screen-2xl mx-auto h-full">
            <AnimatedSection direction="none" className="space-y-10">
              {children}
            </AnimatedSection>
          </div>
        </div>
      </main>

      <React.Suspense fallback={null}>
        <DepositDialogSync />
      </React.Suspense>
    </div>
  )
}
