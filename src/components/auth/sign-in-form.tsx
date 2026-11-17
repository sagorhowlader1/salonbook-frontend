"use client"

import Link from "next/link"
import { GoogleIcon } from "@/components/auth/google-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "../ui/toast"
import { authClient } from "@/lib/auth-client"
import { redirect, useRouter } from "next/navigation"


export function SignInForm() {
  const router = useRouter()
  const handleEmailSignIp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const user = Object.fromEntries(formData.entries()) as { email: string, password: string }
    console.log(user)

    const { data, error } = await authClient.signIn.email(user)

    if (error) {
      toast.add({
        title: "Signin Failed",
        description: "Something went wrong. Please try again.",
      })
    }

    if (data) {
      toast.add({
        title: "Signin Successful.",
        description: "Welcome to SalonBook! You have signed in successful..",
      })
    }
    router.replace('/')
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to book and manage your salon appointments.
        </p>
      </div>

      <Button variant="outline" size="lg" className="mt-6 w-full rounded-full">
        <GoogleIcon />
        Continue with Google
      </Button>

      <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or sign in with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleEmailSignIp} noValidate className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            name="email"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            name="password"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/80"
        >
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  )
}
