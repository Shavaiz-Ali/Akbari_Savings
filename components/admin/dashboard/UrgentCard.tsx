import * as React from "react"
import { cn } from "@/lib/utils"

interface UrgentCardProps {
  children: React.ReactNode
  accentClass: string
  className?: string
}

export function UrgentCard({
  children,
  accentClass,
  className,
}: UrgentCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-border/40 bg-card shadow-sm transition-all duration-300",
        "hover:shadow-md hover:-translate-y-0.5 overflow-hidden",
        className
      )}
    >
      {/* Left accent stripe */}
      <span
        className={cn("absolute inset-y-0 left-0 w-1 rounded-l-xl", accentClass)}
      />
      <div className="pl-5 pr-5 py-4">{children}</div>
    </div>
  )
}
