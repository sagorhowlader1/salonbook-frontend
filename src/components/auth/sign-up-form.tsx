"use client"

import * as React from "react"

import Link from "next/link"
import { Check, ImagePlus, Link2, Upload, X } from "lucide-react"
import { cn } from "cn"
import { GoogleIcon } from "@/components/auth/google-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { toast } from "../ui/toast"
import { redirect } from "next/navigation"

const passwordRules = [
  { label: "At least 6 characters", test: (v: string) => v.length >= 6 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
] as const

export function SignUpForm() {

  const handleEmailSignUp = async (e: React.SubmitEvent<HTMLElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const user = Object.fromEntries(formData.entries()) as { name: string, imageUrl: string, imageMode: string, email: string, password: string }
    console.log(user)

    const { data, error } = await authClient.signUp.email({
      ...user,

    })

    if (error) {
      toast.add({
        title: "Signup Failed",
        description: "Failed to create your account!",
      })
    }

    if (data) {
      toast.add({
        title: "Signup Successful.",
        description: "Welcome to SalonBook! Your Account is ready.",
      })
    }

    redirect('/')
  }


  const [password] = React.useState("")
  const [imageMode, setImageMode] = React.useState<"upload" | "url">("upload")
  const [imageUrl, setImageUrl] = React.useState("")
  const [preview, setPreview] = React.useState<string | null>(null)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  const avatarSrc = imageMode === "url" ? imageUrl.trim() : preview

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Join SalonBook to book salon appointments online.
        </p>
      </div>

      <Button variant="outline" size="lg" className="mt-6 w-full rounded-full">
        <GoogleIcon />
        Continue with Google
      </Button>

      <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or sign up with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleEmailSignUp} noValidate className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Full Name
          </label>
          <Input
            id="name"
            placeholder="Jane Doe"
            type="text"
            name="name"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
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
          <ul className="space-y-1 pt-0.5">
            {passwordRules.map((rule) => {
              const passed = rule.test(password)
              return (
                <li
                  key={rule.label}
                  className={cn(
                    "flex items-center gap-1.5 text-xs text-muted-foreground",
                    password && passed && "text-emerald-600 dark:text-emerald-400"
                  )}
                >
                  {passed ? <Check className="size-3" /> : <X className="size-3" />}
                  {rule.label}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="space-y-1.5">
          <span className="text-sm font-medium text-foreground">Profile Image</span>
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setImageMode("upload")}
                aria-pressed={imageMode === "upload"}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
                  imageMode === "upload"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Upload className="size-3.5" />
                Upload Image
              </button>
              <button
                type="button"
                onClick={() => setImageMode("url")}
                aria-pressed={imageMode === "url"}
                className={cn(
                  "flex items-center gap-1.5 border-l border-border px-3 py-1.5 text-xs font-medium transition-colors",
                  imageMode === "url"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Link2 className="size-3.5" />
                Image URL
              </button>
            </div>

            {avatarSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarSrc}
                alt="Profile preview"
                className="size-9 rounded-full border border-border object-cover"
              />
            )}
          </div>

          {imageMode === "upload" ? (
            <label
              htmlFor="profile-image"
              className="flex h-20 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-muted/40 text-xs text-muted-foreground transition-colors hover:bg-muted"
            >
              <ImagePlus className="size-4" />
              {preview ? "Change image" : "Click to upload an image"}
            </label>
          ) : (
            <Input
              type="url"
              placeholder="https://example.com/avatar.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          )}
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full bg-primary cursor-pointer text-primary-foreground hover:bg-primary/80"
        >
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/signin" className="font-medium text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  )
}
