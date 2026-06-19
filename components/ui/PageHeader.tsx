import * as React from "react"
import { AnimatedSection } from "./AnimatedSection"
import { Typography } from "./Typography"

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <AnimatedSection
      direction="right"
      delay="100"
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div className="space-y-1">
        <Typography variant="h1" className="text-3xl lg:text-4xl">
          {title}
        </Typography>
        {description && (
          <Typography variant="muted" className="text-sm">
            {description}
          </Typography>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </AnimatedSection>
  )
}
