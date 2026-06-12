"use client"

import * as React from "react"
import { Settings as SettingsIcon, Info } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { EmptyState } from "@/components/ui/EmptyState"

export default function AdminSettingsPage() {
  return (
    <>
      <PageHeader 
        title="Settings" 
        description="Platform configurations and admin preferences"
      />

      <EmptyState
        icon={SettingsIcon}
        title="System Settings"
        description="Settings and configurations will be available here soon. We're currently prioritizing the core savings management features."
      >
        <div className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-3 py-1.5 rounded-md border border-amber-200 dark:border-amber-900/50">
          <Info className="size-3.5" />
          Under Development
        </div>
      </EmptyState>
    </>
  )
}
