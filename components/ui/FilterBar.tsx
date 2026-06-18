"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { CustomInput } from "./CustomInput"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./select"
import { AnimatedSection } from "./AnimatedSection"
import { cn } from "@/lib/utils"

export interface FilterOption {
  label: string
  value: string
}

export interface FilterConfig {
  label: string
  value: string
  onValueChange: (value: string) => void
  options: FilterOption[]
  placeholder?: string
}

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  searchPlaceholder?: string
  searchLabel?: string
  filters?: FilterConfig[]
  className?: string
}

/**
 * A professional, branded FilterBar component for tables and lists.
 * Standardizes sizes, spacing, and layout across the platform.
 */
export function FilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  searchLabel = "Search Items",
  filters = [],
  className
}: FilterBarProps) {
  return (
    <AnimatedSection
      delay="200"
      className={cn("flex flex-col md:flex-row gap-4 items-end justify-between w-full mb-8", className)}
    >
      {/* Search Input */}
      <div className="w-full md:w-80">
        <CustomInput
          label={searchLabel}
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<Search />}
        />
      </div>

      {/* Dynamic Filters */}
      {filters.length > 0 && (
        <div className="flex gap-3 w-full md:w-auto">
          {filters.map((filter) => (
            <div key={filter.label} className="flex flex-col gap-2 flex-1 md:w-52 shrink-0">
              <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 ml-0.5">
                {filter.label}
              </label>
              <Select value={filter.value} onValueChange={filter.onValueChange}>
                <SelectTrigger className="h-12 min-h-[48px] w-full bg-background/50 border-input transition-all duration-200 shadow-sm focus-visible:ring-ring/10">
                  <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </AnimatedSection>
  )
}
