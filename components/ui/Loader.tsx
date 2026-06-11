"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "white"
}

export function Loader({ size = "md", variant = "primary", className, ...props }: LoaderProps) {
  const sizeStyles = {
    sm: "size-4 border-2",
    md: "size-6 border-2",
    lg: "size-8 border-3",
  }

  const variantStyles = {
    primary: "border-primary/30 border-t-primary",
    secondary: "border-secondary/30 border-t-secondary",
    white: "border-white/30 border-t-white",
  }

  return (
    <div
      className={cn(
        "rounded-full animate-spin",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}
