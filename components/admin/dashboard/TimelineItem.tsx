import * as React from "react"
import { cn } from "@/lib/utils"

interface TimelineItemProps {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  name: string
  detail: string
  meta: string
  badge?: React.ReactNode
  isLast?: boolean
}

export function TimelineItem({
  icon: Icon,
  iconBg,
  iconColor,
  name,
  detail,
  meta,
  badge,
  isLast,
}: TimelineItemProps) {
  return (
    <div className="flex gap-3 group">
      {/* timeline line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "size-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110",
            iconBg
          )}
        >
          <Icon className={cn("size-3.5", iconColor)} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-border/40 mt-1" />}
      </div>
      {/* content */}
      <div className="pb-4 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">{name}</span>
          {badge}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{detail}</p>
        <p className="text-[11px] text-muted-foreground/50 mt-0.5">{meta}</p>
      </div>
    </div>
  )
}
