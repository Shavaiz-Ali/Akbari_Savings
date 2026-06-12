import * as React from "react"
import { LucideIcon } from "lucide-react"
import { AnimatedSection } from "./AnimatedSection"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  children?: React.ReactNode
  delay?: "none" | "100" | "200" | "300" | "400" | "500" | "600" | "700"
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  delay = "300",
}: EmptyStateProps) {
  return (
    <AnimatedSection delay={delay}>
      <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20 border border-dashed border-border rounded-2xl">
        <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center">
          <Icon className="size-8 text-muted-foreground/30" />
        </div>
        <div className="space-y-1 max-w-xs mx-auto">
          <p className="text-foreground font-semibold">
            {title}
          </p>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </AnimatedSection>
  )
}
