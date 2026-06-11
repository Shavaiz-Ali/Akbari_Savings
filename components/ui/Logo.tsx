import * as React from "react"
import { cn } from "@/lib/utils"

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export function Logo({ size = "md", className, ...props }: LogoProps) {
  const sizeStyles = {
    sm: {
      container: "gap-2.5",
      icon: "size-7", // 28px
    },
    md: {
      container: "gap-3",
      icon: "size-10", // 40px
    },
    lg: {
      container: "gap-5",
      icon: "size-20", // 80px
    },
  }

  return (
    <div
      className={cn("flex items-center select-none group", sizeStyles[size].container, className)}
      {...props}
    >
      <div className={cn("relative flex items-center justify-center shrink-0 text-primary", sizeStyles[size].icon)}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full transition-all duration-500 group-hover:scale-110 group-hover:rotate-[5deg]"
        >
          {/* Custom 'Grand Shield' Mark */}
          <path
            d="M16 2L28 7V16C28 23 23 29 16 31C9 29 4 23 4 16V7L16 2Z"
            fill="url(#shield-grad)"
            className="drop-shadow-sm"
          />
          {/* Iconic 'A' cut-out / growth motif */}
          <path
            d="M11 22L16 10L21 22"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 18H18.5"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Inner focus point */}
          <circle cx="16" cy="16" r="1.5" fill="white" className="animate-pulse" />
          
          <defs>
            <linearGradient id="shield-grad" x1="4" y1="2" x2="28" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--primary)" />
              <stop offset="1" stopColor="oklch(from var(--primary) calc(l - 0.15) c h)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-full scale-110" />
      </div>
      
      <div className="flex flex-col justify-center -space-y-1">
        <div className="flex items-center">
          <span
            className={cn(
              "font-sans font-black tracking-tight text-foreground uppercase",
              size == "sm" ? "text-base" : size == "md" ? "text-2xl" : "text-5xl"
            )}
          >
            Akbari
          </span>
          <span
            className={cn(
              "font-sans font-light text-primary uppercase ml-1",
              size == "sm" ? "text-base" : size == "md" ? "text-2xl" : "text-5xl"
            )}
          >
            Savings
          </span>
        </div>
        <div className="h-0.5 w-full bg-linear-to-r from-primary/60 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
      </div>
    </div>
  )
}
