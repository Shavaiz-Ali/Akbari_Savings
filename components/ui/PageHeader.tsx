"use client"

import * as React from "react"
import { AnimatedSection } from "./AnimatedSection"

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
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight font-serif text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-sm">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </AnimatedSection>
  )
}
