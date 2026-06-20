"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

type Tab = "active" | "pending"

interface MembersTabsProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  activeCount: number
  pendingCount: number
}

export function MembersTabs({
  activeTab,
  onTabChange,
  activeCount,
  pendingCount,
}: MembersTabsProps) {
  return (
    <AnimatedSection delay="200" className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
      <button
        onClick={() => onTabChange("active")}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
          activeTab === "active"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Active Members
        <span className="ml-2 text-xs opacity-60">
          ({activeCount})
        </span>
      </button>
      <button
        onClick={() => onTabChange("pending")}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
          activeTab === "pending"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Pending Approval
        <span className="ml-2 text-xs opacity-60">
          ({pendingCount})
        </span>
      </button>
    </AnimatedSection>
  )
}
