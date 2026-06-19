import * as React from "react"
import { cn } from "@/lib/utils"

type TypographyVariant = "h1" | "h2" | "h3" | "h4" | "body" | "bodySmall" | "muted" | "label"

type DefaultTag = {
  h1: "h1"
  h2: "h2"
  h3: "h3"
  h4: "h4"
  body: "p"
  bodySmall: "p"
  muted: "p"
  label: "span"
}

const defaultTags: DefaultTag = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  bodySmall: "p",
  muted: "p",
  label: "span",
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: "font-mono text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground",
  h2: "font-mono text-2xl md:text-3xl font-bold tracking-tight text-foreground",
  h3: "font-mono text-xl md:text-2xl font-bold text-foreground",
  h4: "font-mono text-lg md:text-xl font-semibold text-foreground",
  body: "font-mono text-base text-foreground",
  bodySmall: "font-mono text-sm text-foreground",
  muted: "font-mono text-sm text-muted-foreground",
  label: "font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground",
}

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant
  /** Override the rendered HTML element — useful for semantic correctness */
  as?: React.ElementType
}

export function Typography({
  variant = "body",
  as,
  className,
  children,
  ...props
}: TypographyProps) {
  const Tag = (as ?? defaultTags[variant]) as React.ElementType
  return (
    <Tag
      className={cn(variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
