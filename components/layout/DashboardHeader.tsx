"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { CustomAvatar } from "@/components/ui/CustomAvatar"
import { Typography } from "@/components/ui/Typography"
import { Bell, Search } from "lucide-react"
import { getPageTitle } from "@/lib/navigation"

export function DashboardHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const title = getPageTitle(pathname)
  const userName = session?.user?.name || "User"
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 transition-all">
      {/* Title on the Left */}
      <div className="flex items-center gap-4">
        <Typography
          variant="h3"
          as="h1"
          className="text-xl tracking-tight text-foreground/90 akbari-animate akbari-right"
        >
          {title}
        </Typography>
      </div>

      {/* Icons Group on the Right */}
      <div className="flex items-center gap-2 sm:gap-4 akbari-animate akbari-left">
        <ThemeToggle />
        
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-all rounded-xl hover:bg-accent/50 group">
          <Bell className="size-5" />
          <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-background animate-pulse" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-border/40 ml-1 group cursor-pointer hover:bg-accent/30 py-1 px-2 rounded-xl transition-colors">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-foreground leading-tight">{userName}</p>
            <p className="text-[10px] text-muted-foreground capitalize">{session?.user?.role || "Member"}</p>
          </div>
          <div className="p-0.5 rounded-full border border-primary/20 group-hover:border-primary/50 transition-colors">
            <CustomAvatar initials={initials} size="sm" className="bg-primary/5 border-none" />
          </div>
        </div>
      </div>
    </header>
  )
}
