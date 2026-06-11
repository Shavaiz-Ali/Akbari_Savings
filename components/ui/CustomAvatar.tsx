import * as React from "react"
import { cn } from "@/lib/utils"

export interface CustomAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials: string
  size?: "sm" | "md" | "lg"
}

export function CustomAvatar({
  initials,
  size = "md",
  className,
  ...props
}: CustomAvatarProps) {
  const sizeStyles = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-14 text-lg",
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold uppercase",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {initials.slice(0, 2)}
    </div>
  )
}
