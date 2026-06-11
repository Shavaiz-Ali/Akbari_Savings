"use client"

import * as React from "react"
import { Logo } from "@/components/ui/Logo"
import { Lock, Construction } from "lucide-react"
import { AnimatedSection } from "@/components/ui/AnimatedSection"

export default function AdminLoansPage() {
  return (
    <AnimatedSection className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-6">
      <AnimatedSection delay="100" className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <div className="relative size-24 rounded-2xl bg-card border border-border shadow-2xl flex items-center justify-center text-primary animate-pulse">
           <Lock className="size-10" />
        </div>
      </AnimatedSection>

      <AnimatedSection delay="300" className="space-y-2 max-w-sm">
        <Logo size="md" className="justify-center mb-6" />
        <h1 className="text-3xl font-bold font-serif text-foreground">
          Loan Module Coming Soon
        </h1>
        <p className="text-muted-foreground">
          The loan application and management system is currently under development. This feature will be available in a future update.
        </p>
      </AnimatedSection>

      <AnimatedSection delay="500" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/60 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
        <Construction className="size-4" />
        Under Construction
      </AnimatedSection>
    </AnimatedSection>
  )
}
