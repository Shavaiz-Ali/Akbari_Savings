"use client";

import * as React from "react";
import Link from "next/link";
import { CustomCard } from "@/components/ui/CustomCard";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomButton } from "@/components/ui/CustomButton";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Typography } from "@/components/ui/Typography";
import { User, Mail, Lock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = React.useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let isValid = true;
    const errors = { fullName: "", email: "", password: "", confirmPassword: "" };

    if (!formData.fullName) {
      errors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success("Account request submitted successfully!");
      setIsSuccess(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <AnimatedSection className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,var(--muted)_0%,transparent_70%)] opacity-[0.15] dark:opacity-[0.05]" />
      </div>

      {/* Top Header Section */}
      <AnimatedSection direction="down" delay="100" className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
        <Link href="/">
           <Logo size="sm" />
        </Link>
        <ThemeToggle />
      </AnimatedSection>

      <div className="w-full max-w-[480px] z-10 space-y-8">
        <AnimatedSection delay="300">
          <CustomCard
            className="border-border/50 shadow-2xl bg-card/95 backdrop-blur-md"
            body={
              <div className="space-y-8 py-2">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center text-center space-y-6 py-4 animate-in fade-in zoom-in duration-500">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <CheckCircle className="size-10" />
                    </div>
                    <div className="space-y-2">
                      <Typography variant="h1" className="text-2xl">
                        Request submitted!
                      </Typography>
                      <Typography variant="muted">
                        An admin will review your account shortly. You will be able to sign in once approved.
                      </Typography>
                    </div>
                    <Link href="/login" className="w-full">
                      <CustomButton className="w-full">Back to Login</CustomButton>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <Typography variant="h1" className="text-3xl">
                        Create an Account
                      </Typography>
                      <Typography variant="muted" className="text-sm font-medium max-w-[320px]">
                        Your account will be reviewed by an admin before you can sign in
                      </Typography>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-5">
                        <CustomInput
                          label="Full Name"
                          name="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={handleChange}
                          error={formErrors.fullName}
                          icon={<User />}
                          disabled={isLoading}
                        />

                        <CustomInput
                          label="Email Address"
                          name="email"
                          type="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          error={formErrors.email}
                          icon={<Mail />}
                          disabled={isLoading}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <CustomInput
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            error={formErrors.password}
                            icon={<Lock />}
                            disabled={isLoading}
                          />

                          <CustomInput
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={formErrors.confirmPassword}
                            icon={<Lock />}
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <CustomButton
                        type="submit"
                        className="w-full h-12 text-sm font-bold tracking-wide"
                        isLoading={isLoading}
                      >
                        Request Access
                      </CustomButton>
                    </form>

                    <div className="space-y-4">
                      <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-foreground font-semibold underline underline-offset-4 decoration-primary/30">
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </>
                )}
              </div>
            }
          />
        </AnimatedSection>
      </div>
    </AnimatedSection>
  );
}
