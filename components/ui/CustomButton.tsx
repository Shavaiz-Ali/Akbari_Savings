"use client"

import * as React from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { Loader } from "./Loader"

export interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function CustomButton({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  leftIcon,
  rightIcon,
  children,
  ...props
}: CustomButtonProps) {
  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "bg-transparent hover:bg-accent text-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  }

  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  }

  const loaderVariant = variant === "primary" ? "white" : "primary"

  return (
    <Button
      className={cn(
        "font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader size="sm" variant={loaderVariant} />
      ) : (
        <>
          {leftIcon && <span>{leftIcon}</span>}
          {children}
          {rightIcon && <span>{rightIcon}</span>}
        </>
      )}
    </Button>
  )
}
