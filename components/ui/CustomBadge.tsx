import * as React from "react"
import { cn } from "@/lib/utils"

export interface CustomBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "pending" | "approved" | "rejected"
}

export function CustomBadge({
  variant = "pending",
  className,
  children,
  ...props
}: CustomBadgeProps) {
  const variantStyles = {
    pending: "bg-muted text-muted-foreground",
    approved: "bg-accent text-accent-foreground", // Mapping to requested tokens
    rejected: "bg-destructive/10 text-destructive",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
