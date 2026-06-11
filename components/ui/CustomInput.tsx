"use client"

import * as React from "react"
import { Input } from "./input"
import { Label } from "./label"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: React.ReactNode
  showPasswordToggle?: boolean
}

export function CustomInput({
  label,
  error,
  icon,
  showPasswordToggle,
  className,
  id,
  type,
  ...props
}: CustomInputProps) {
  const generatedId = React.useId()
  const inputId = id || generatedId
  const [showPassword, setShowPassword] = React.useState(false)

  const isPassword = type === "password"
  const hasToggle = isPassword || showPasswordToggle
  const inputType = hasToggle && showPassword ? "text" : type

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label
        htmlFor={inputId}
        className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 ml-0.5"
      >
        {label}
      </Label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-primary pointer-events-none flex items-center justify-center">
            {React.isValidElement(icon) ? (
              React.cloneElement(icon as React.ReactElement<{ className?: string }>, { 
                className: cn("size-[18px]", (icon.props as { className?: string })?.className) 
              })
            ) : (
              icon
            )}
          </div>
        )}
        <Input
          id={inputId}
          {...props}
          type={inputType}
          className={cn(
            "h-12 bg-background/50 border-input text-foreground placeholder:text-muted-foreground/40 transition-all duration-200 shadow-sm",
            "focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/10 focus-visible:outline-none",
            icon && "pl-11",
            hasToggle && "pr-11",
            error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/10",
            className
          )}
        />
        {hasToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted/50"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-[11px] font-medium text-destructive mt-0.5 ml-0.5">
          {error}
        </p>
      )}
    </div>
  )
}
