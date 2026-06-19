import * as React from "react"
import { Activity, Clock } from "lucide-react"
import { Typography } from "@/components/ui/Typography"
import { CustomCard } from "@/components/ui/CustomCard"
import { CustomBadge } from "@/components/ui/CustomBadge"
import { EmptyState } from "@/components/ui/EmptyState"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { SkeletonPatterns } from "@/components/ui/Skeleton"
import { TimelineItem } from "./TimelineItem"

interface ActivityFeedProps {
  unifiedFeedEvents: any[]
  loadingEvents: boolean
  className?: string
}

export function ActivityFeed({
  unifiedFeedEvents,
  loadingEvents,
  className,
}: ActivityFeedProps) {
  return (
    <AnimatedSection delay="500" className={className}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="size-8 rounded-lg bg-chart-4/20 flex items-center justify-center">
          <Activity className="size-4 text-chart-4" />
        </div>
        <Typography variant="h4" className="text-base font-semibold">
          Recent Activity Feed
        </Typography>
      </div>

      <CustomCard
        body={
          loadingEvents ? (
            <SkeletonPatterns.Table rows={5} />
          ) : unifiedFeedEvents.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No activity yet"
              description="Deposit and member status updates will appear here."
            />
          ) : (
            <div className="space-y-0">
              {unifiedFeedEvents.map((evt, i) => (
                <TimelineItem
                  key={evt.id}
                  icon={evt.icon}
                  iconBg={evt.iconBg}
                  iconColor={evt.iconColor}
                  name={evt.name}
                  detail={evt.detail}
                  meta={evt.meta}
                  badge={
                    <CustomBadge variant={evt.badgeVariant} className="text-[9px] px-1.5 py-0">
                      {evt.badgeText}
                    </CustomBadge>
                  }
                  isLast={i === unifiedFeedEvents.length - 1}
                />
              ))}
            </div>
          )
        }
      />
    </AnimatedSection>
  )
}
