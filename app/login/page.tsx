import { Suspense } from "react"
import LoginForm from "./LoginForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Akbari Savings",
  description: "Sign in to your Akbari Savings account to manage your savings and targets.",
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
