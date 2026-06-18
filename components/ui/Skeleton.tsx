"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional variant for predefined shapes */
  variant?: "text" | "circular" | "rectangular" | "rounded"
}

/**
 * Branded Professional Skeleton.
 * Incorporates a hint of the Akbari primary color for a cohesive brand experience.
 */
export function Skeleton({
  className,
  variant = "rectangular",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-primary/5 dark:bg-primary/[0.08]",
        {
          "rounded-full": variant === "circular",
          "rounded-xl": variant === "rounded",
          "h-3 w-full rounded-md": variant === "text",
        },
        className
      )}
      {...props}
    >
      {/* Branded Shimmer */}
      <div 
        className="absolute inset-0 -translate-x-full"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--shimmer-color), transparent)',
          animation: 'shimmer 2s infinite ease-in-out'
        }}
      />
    </div>
  )
}

/**
 * Professional Patterns tailored for Akbari Savings Platform
 */
export const SkeletonPatterns = {
  // A professional list item with brand alignment
  Item: () => (
    <div className="flex items-center gap-4 py-4 px-6 border-b border-primary/5 last:border-0 hover:bg-primary/[0.01] transition-colors">
      <Skeleton variant="rounded" className="size-10 shrink-0 opacity-40 shadow-sm" />
      <div className="flex-1 space-y-2.5">
        <Skeleton variant="text" className="w-[35%] h-3.5" />
        <Skeleton variant="text" className="w-[20%] h-2.5 opacity-40" />
      </div>
      <div className="hidden sm:flex gap-8 items-center mr-8">
         <Skeleton variant="text" className="w-24 h-3 opacity-30" />
      </div>
      <Skeleton variant="rounded" className="h-9 w-24 opacity-60 shadow-sm" />
    </div>
  ),

  // Branded Table replacement
  Table: ({ rows = 6 }: { rows?: number }) => (
    <div className="bg-card rounded-2xl border border-primary/10 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="h-14 bg-primary/[0.02] border-b border-primary/5 flex items-center px-6">
          <Skeleton variant="text" className="w-24 h-3 opacity-20" />
      </div>
      <div className="divide-y divide-primary/5">
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonPatterns.Item key={i} />
          ))}
      </div>
    </div>
  ),

  // Branded Card for Members/Approvals
  Card: () => (
    <div className="p-6 bg-card border border-primary/10 rounded-2xl space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
            <Skeleton variant="circular" className="size-12 shadow-sm" />
            <div className="space-y-2">
                <Skeleton variant="text" className="w-32 h-4" />
                <Skeleton variant="text" className="w-24 h-2.5 opacity-40" />
            </div>
        </div>
        <Skeleton variant="rounded" className="h-6 w-20 rounded-full opacity-30" />
      </div>
      
      <div className="space-y-4 py-2">
          <div className="flex items-center gap-2">
              <Skeleton variant="circular" className="size-3 opacity-20" />
              <Skeleton variant="text" className="w-48 h-2.5 opacity-40" />
          </div>
          <div className="flex items-center gap-2">
              <Skeleton variant="circular" className="size-3 opacity-20" />
              <Skeleton variant="text" className="w-40 h-2.5 opacity-40" />
          </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Skeleton variant="rounded" className="h-10 flex-1 shadow-md opacity-80" />
        <Skeleton variant="rounded" className="h-10 flex-1 border border-primary/10 shadow-sm transition-all" />
      </div>
    </div>
  ),

  // Branded Stat Card
  StatCard: () => (
    <div className="p-6 bg-card border border-primary/10 rounded-2xl space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <Skeleton variant="rounded" className="size-12 rounded-xl shadow-sm" />
        <Skeleton variant="circular" className="size-5 opacity-10" />
      </div>
      <div className="space-y-3 pt-2">
        <Skeleton variant="text" className="w-[70%] h-10 shadow-sm" />
        <Skeleton variant="text" className="w-[50%] h-4 opacity-40" />
      </div>
      <div className="pt-2">
        <Skeleton variant="text" className="w-[40%] h-3 opacity-20" />
      </div>
    </div>
  ),
}
