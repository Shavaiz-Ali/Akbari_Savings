"use client"

import { signOut } from "next-auth/react"
import { CustomButton } from "@/components/ui/CustomButton"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  return (
    <CustomButton
      variant="ghost"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
    >
      <LogOut className="size-4" />
      Sign Out
    </CustomButton>
  )
}
