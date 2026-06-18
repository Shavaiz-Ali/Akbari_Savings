"use client"

import * as React from "react"
import { LucideIcon, AlertTriangle, RefreshCw } from "lucide-react"
import { Loader } from "@/components/ui/Loader"
import { EmptyState } from "@/components/ui/EmptyState"
import { CustomButton } from "@/components/ui/CustomButton"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

interface QueryBoundaryProps {
  /** Whether data is currently loading */
  isLoading: boolean
  /** Error object from TanStack Query (or any truthy error value) */
  error?: unknown
  /** Whether the data array / result is empty after a successful fetch */
  isEmpty?: boolean
  /** Callback to refetch — shown in the error state as "Try Again" */
  onRetry?: () => void

  // ── Empty state customisation ──
  emptyIcon?: LucideIcon
  emptyTitle?: string
  emptyDescription?: string
  /** Optional slot rendered below the empty‑state text (e.g. a CTA button) */
  emptyAction?: React.ReactNode

  // ── Error state customisation ──
  errorTitle?: string
  errorDescription?: string

  /** Optional custom placeholder to show during loading (e.g. Skeletons) */
  loadingPlaceholder?: React.ReactNode

  /** Content to render when there is data */
  children: React.ReactNode

  /** Extra className applied to the loading wrapper */
  loadingClassName?: string
}

/**
 * QueryBoundary — a single component that handles all three states that
 * come out of a TanStack Query `useQuery` call:
 *
 *  1. **Loading** — centred spinner OR custom skeleton
 *  2. **Error**   — error card with a contextual message + "Try Again" button
 *  3. **Empty**   — branded empty state with optional icon / CTA
 *  4. **Success** — renders `children`
 */
export function QueryBoundary({
  isLoading,
  error,
  isEmpty = false,
  onRetry,
  emptyIcon,
  emptyTitle = "No records found",
  emptyDescription = "Nothing here yet. Check back later.",
  emptyAction,
  errorTitle = "Something went wrong",
  errorDescription,
  loadingPlaceholder,
  children,
  loadingClassName,
}: QueryBoundaryProps) {
  // ── 1. Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    if (loadingPlaceholder) return <>{loadingPlaceholder}</>

    return (
      <div className={`flex items-center justify-center py-24 ${loadingClassName ?? ""}`}>
        <div className="flex flex-col items-center gap-4">
          <Loader size="lg" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
        </div>
      </div>
    )
  }

  // ── 2. Error ────────────────────────────────────────────────────────────────
  if (error) {
    const apiMsg =
      (error as any)?.error ||
      (error as any)?.message ||
      "We couldn't load this data. Please try again."

    const displayMsg = errorDescription ?? apiMsg

    return (
      <AnimatedSection delay="200">
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-5 bg-destructive/5 border border-dashed border-destructive/20 rounded-2xl">
          <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="size-8 text-destructive/60" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <p className="font-semibold text-foreground">{errorTitle}</p>
            <p className="text-sm text-muted-foreground">{displayMsg}</p>
          </div>
          {onRetry && (
            <CustomButton
              variant="ghost"
              className="gap-2 border border-destructive/20 hover:bg-destructive/10 text-destructive"
              onClick={onRetry}
            >
              <RefreshCw className="size-4" />
              Try Again
            </CustomButton>
          )}
        </div>
      </AnimatedSection>
    )
  }

  // ── 3. Empty ────────────────────────────────────────────────────────────────
  if (isEmpty) {
    return (
      <EmptyState
        icon={emptyIcon ?? AlertTriangle}
        title={emptyTitle}
        description={emptyDescription}
      >
        {emptyAction}
      </EmptyState>
    )
  }

  // ── 4. Success ──────────────────────────────────────────────────────────────
  return <>{children}</>
}
