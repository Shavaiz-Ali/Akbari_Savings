import * as React from "react"
import { cn } from "@/lib/utils"

export interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode
  body?: React.ReactNode
  footer?: React.ReactNode
}

export function CustomCard({
  header,
  body,
  footer,
  className,
  children,
  ...props
}: CustomCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/40 bg-card text-card-foreground shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-border/60",
        "before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_top_right,oklch(var(--primary)/0.03),transparent_40%)]",
        "dark:shadow-primary/5 dark:bg-card/80 dark:backdrop-blur-sm dark:before:bg-[radial-gradient(circle_at_top_right,oklch(var(--primary)/0.05),transparent_40%)]",
        className
      )}
      {...props}
    >
      {header && (
        <div className="border-b border-border/40 px-6 py-5 sm:px-8">
          {header}
        </div>
      )}
      <div className={cn("px-6 py-6 sm:px-8 sm:py-8", !header && "pt-6 sm:pt-8")}>
        {body || children}
      </div>
      {footer && (
        <div className="border-t border-border/40 bg-muted/20 px-6 py-4 sm:px-8 sm:py-5">
          {footer}
        </div>
      )}
    </div>
  )
}
