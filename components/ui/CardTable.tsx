import * as React from "react"
import { CustomCard } from "./CustomCard"
import { cn } from "@/lib/utils"
import { AnimatedSection } from "./AnimatedSection"
import { CustomCardProps } from "./CustomCard"

interface CardTableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  delay?: "none" | "100" | "200" | "300" | "400" | "500" | "600" | "700"
}

export function CardTable({ 
  children, 
  className, 
  delay = "300",
  ...props 
}: CardTableProps) {
  return (
    <AnimatedSection delay={delay}>
      <CustomCard
        className={cn("overflow-hidden", className)}
        body={
          <div className="-mx-6 -my-6 sm:-mx-8 sm:-my-8">
            {children}
          </div>
        }
        {...props}
      />
    </AnimatedSection>
  )
}
