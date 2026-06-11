"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CustomCard } from "@/components/ui/CustomCard"
import { CustomInput } from "@/components/ui/CustomInput"
import { CustomButton } from "@/components/ui/CustomButton"
import { Logo } from "@/components/ui/Logo"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { Mail, Lock } from "lucide-react"
import { toast } from "sonner"

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlError = searchParams.get("error")
  
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  })
  const [formErrors, setFormErrors] = React.useState({
    email: "",
    password: "",
  })

  // Set error from URL if present
  React.useEffect(() => {
    if (urlError) {
      if (urlError === "CredentialsSignin") {
        toast.error("Invalid email or password.")
      } else if (urlError.includes("pending admin approval")) {
         toast.error("Your account is pending admin approval.")
      } else {
        toast.error(urlError)
      }
    }
  }, [urlError])

  const validateForm = () => {
    let isValid = true
    const errors = { email: "", password: "" }

    if (!formData.email) {
      errors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
      isValid = false
    }

    if (!formData.password) {
      errors.password = "Password is required"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Welcome back! Redirecting...")
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      console.error("Login error:", err)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <AnimatedSection className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,var(--muted)_0%,transparent_70%)] opacity-[0.15] dark:opacity-[0.05]" />
      </div>

      {/* Top Header Section */}
      <AnimatedSection direction="down" delay="100" className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
        <Logo size="sm" />
        <ThemeToggle />
      </AnimatedSection>

      <div className="w-full max-w-[420px] z-10 space-y-8">
        <AnimatedSection delay="300">
          <CustomCard
            className="border-border/50 shadow-2xl bg-card/95 backdrop-blur-md"
            body={
              <div className="space-y-8 py-2">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground font-serif">
                    Sign In
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium">
                    Enter your details to access your account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-5">
                    <CustomInput
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={formErrors.email}
                      icon={<Mail />}
                      disabled={isLoading}
                    />

                    <CustomInput
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      error={formErrors.password}
                      icon={<Lock />}
                      disabled={isLoading}
                    />
                  </div>

                  <CustomButton
                    type="submit"
                    className="w-full h-12 text-sm font-bold tracking-wide"
                    isLoading={isLoading}
                  >
                    Sign In
                  </CustomButton>
                </form>

                <div className="space-y-4">
                  <p className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-foreground font-semibold underline underline-offset-4 decoration-primary/30">
                      Create an account
                    </Link>
                  </p>

                  <div className="pt-2 border-t border-border/10">
                    <p className="text-center text-[10px] text-muted-foreground/40 tracking-[0.3em] uppercase font-bold">
                      Akbari Savings &bull; Platform
                    </p>
                  </div>
                </div>
              </div>
            }
          />
        </AnimatedSection>
      </div>
    </AnimatedSection>
  )
}
