"use client"

import * as React from "react"
import { CustomCard } from "@/components/ui/CustomCard"
import { Settings as SettingsIcon, Info } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

export default function AdminSettingsPage() {
  return (
    <AnimatedSection className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <AnimatedSection direction="right" delay="100" className="space-y-1">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight font-serif text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Platform configurations and admin preferences
        </p>
      </AnimatedSection>

      <AnimatedSection delay="300">
        <CustomCard
          body={
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center">
                <SettingsIcon className="size-8 text-muted-foreground/30" />
              </div>
              <div className="space-y-2 max-w-xs">
                <h2 className="text-xl font-semibold text-foreground font-serif">
                  System Settings
                </h2>
                <p className="text-sm text-muted-foreground">
                  Settings and configurations will be available here soon. We're currently prioritizing the core savings management features.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-3 py-1.5 rounded-md border border-amber-200 dark:border-amber-900/50">
                <Info className="size-3.5" />
                Under Development
              </div>
            </div>
          }
        />
      </AnimatedSection>
    </AnimatedSection>
  )
}
