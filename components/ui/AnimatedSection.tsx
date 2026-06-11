"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AnimatedSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  delay?: "none" | "100" | "200" | "300" | "400" | "500" | "600" | "700"
  direction?: "up" | "down" | "left" | "right" | "none"
  duration?: "300" | "500" | "700" | "1000"
}

export function AnimatedSection({
  children,
  delay = "none",
  direction = "up",
  duration = "700",
  className,
  style,
  ...props
}: AnimatedSectionProps) {
  const delayMs = delay === "none" ? 0 : parseInt(delay);
  const durationMs = parseInt(duration);

  const animationClass = direction === "none" 
    ? "akbari-fade" 
    : direction === "up" ? "akbari-up"
    : direction === "down" ? "akbari-down"
    : direction === "left" ? "akbari-left"
    : "akbari-right";

  return (
    <div
      className={cn(
        "akbari-animate",
        animationClass,
        className
      )}
      style={{
        ...style,
        animationDelay: `${delayMs}ms`,
        animationDuration: `${durationMs}ms`,
        animationFillMode: 'both',
      }}
      {...props}
    >
      {children}
    </div>
  )
}
