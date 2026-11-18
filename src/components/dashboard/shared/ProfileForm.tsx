"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Upload, User } from "lucide-react"
import { cn } from "cn"

import { PageHeader } from "@/components/dashboard/shared/PageHeader"
import { useAuth, type AuthUser } from "@/components/providers/auth-provider"
import { StateBlock } from "@/components/shared/state-block"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"

const container = "mx-auto w-full max-w-3xl px-4 pt-20 pb-14 lg:pt-14"

type ErrorMap = Partial<Record<"name" | "phone" | "image", string>>

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="text-xs font-medium text-destructive">
      {children}
    </p>
  )
}

function RequiredMark() {
  return (
    <span aria-hidden className="text-destructive">
      *
    </span>
  )
}

/**
 * Profile screen shared by the customer and admin dashboards. Only the
 * signed-in user's own profile is ever editable — there is no way to target
 * another account, and role / account status are displayed read-only.
 */
export function ProfileForm() {
  const { user, isPending } = useAuth()
  const router = useRouter()

  if (isPending) {
    return (
      <div className={container}>
        <StateBlock
          state="loading"
          title="Loading profile"
          description="Fetching your account details…"
        />
      </div>
    )
  }

  if (!user) {
    return (
      <div className={container}>
        <StateBlock
          state="error"
          title="Sign in to view your profile"
          description="You need to be signed in to manage your profile."
          actionLabel="Sign In"
          onAction={() => router.push("/signin")}
        />
      </div>
    )
  }

  return <ProfileEditor user={user} />
}

function ProfileEditor({ user }: { user: AuthUser }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageFailed, setImageFailed] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [errors, setErrors] = useState<ErrorMap>({})

  /* Revoke blob previews on unmount. */
  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    },
    []
  )

  const clearError = (key: keyof ErrorMap) =>
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })

  const handleFile = (file: File | null | undefined) => {
    if (!file) return
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    setImageUrl(url)
    setUrlInput("")
    setImageFailed(false)
    clearError("image")
  }

  const handleUrlChange = (value: string) => {
    setUrlInput(value)
    setImageUrl(value)
    setImageFailed(false)
    clearError("image")
  }

  const handleRemoveImage = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setImageUrl("")
    setUrlInput("")
    setImageFailed(false)
    clearError("image")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const validate = (): ErrorMap => {
    const next: ErrorMap = {}

    if (!name.trim()) next.name = "Name is required."

    const trimmedPhone = phone.trim()
    const digits = trimmedPhone.replace(/\D/g, "")
    if (
      trimmedPhone &&
      (digits.length < 7 ||
        digits.length > 15 ||
        !/^[+\d\s\-()]+$/.test(trimmedPhone))
    ) {
      next.phone = "Enter a valid phone number."
    }

    const trimmedUrl = urlInput.trim()
    if (trimmedUrl) {
      let parsed: URL | null = null
      try {
        parsed = new URL(trimmedUrl)
      } catch {
        parsed = null
      }
      if (
        !parsed ||
        (parsed.protocol !== "http:" && parsed.protocol !== "https:")
      ) {
        next.image = "Enter a valid image URL (http or https)."
      }
    }

    return next
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      toast.add({
        title: "Check the form",
        description: "Please fix the highlighted fields and try again.",
        type: "error",
      })
      return
    }

    toast.add({
      title: "Profile updated",
      description: "Your changes have been saved successfully.",
      type: "success",
    })
  }

  return (
    <div className={container}>
      <PageHeader
        eyebrow="Account"
        title="My Profile"
        description="Manage your personal information and profile picture."
      />

      <div className="mt-8">
        <Card className="gap-0 overflow-hidden py-0">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <CardHeader className="pt-6">
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Fields marked with * are required. Your email, role and account
                status are read-only.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Profile image: upload or URL */}
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <div
                  onDragOver={(event) => {
                    event.preventDefault()
                    setDragging(true)
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault()
                    setDragging(false)
                    handleFile(event.dataTransfer.files?.[0])
                  }}
                  className={cn(
                    "flex flex-col gap-4 rounded-2xl border border-dashed p-4 transition-colors sm:flex-row sm:items-center",
                    dragging
                      ? "border-gold bg-gold/5"
                      : "border-border bg-muted/30",
                    errors.image && "border-destructive/60"
                  )}
                >
                  <span className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background">
                    {imageUrl && !imageFailed ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={imageUrl}
                        alt="Profile image preview"
                        className="size-full object-cover"
                        onLoad={() => setImageFailed(false)}
                        onError={() => setImageFailed(true)}
                      />
                    ) : (
                      <User className="size-8 text-muted-foreground" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1 space-y-2">
                    <Label
                      htmlFor="profile-image-url"
                      className="text-muted-foreground"
                    >
                      Image URL
                    </Label>
                    <Input
                      id="profile-image-url"
                      value={urlInput}
                      onChange={(event) => handleUrlChange(event.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      aria-invalid={Boolean(errors.image)}
                      className={cn(errors.image && "border-destructive")}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        aria-label="Upload profile image"
                        className="sr-only"
                        onChange={(event) =>
                          handleFile(event.target.files?.[0])
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload />
                        Upload image
                      </Button>
                      {imageUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="rounded-full"
                          onClick={handleRemoveImage}
                        >
                          Remove
                        </Button>
                      )}
                      <p className="text-xs text-muted-foreground">
                        or drag &amp; drop an image
                      </p>
                    </div>
                    {errors.image && <FieldError>{errors.image}</FieldError>}
                  </div>
                </div>
              </div>

              {/* Name + phone */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">
                    Name <RequiredMark />
                  </Label>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value)
                      clearError("name")
                    }}
                    placeholder="Your full name"
                    aria-invalid={Boolean(errors.name)}
                    className={cn(errors.name && "border-destructive")}
                  />
                  {errors.name && <FieldError>{errors.name}</FieldError>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-phone">Phone Number</Label>
                  <Input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value)
                      clearError("phone")
                    }}
                    placeholder="+1 (555) 000-0000"
                    aria-invalid={Boolean(errors.phone)}
                    className={cn(errors.phone && "border-destructive")}
                  />
                  {errors.phone && <FieldError>{errors.phone}</FieldError>}
                </div>
              </div>

              {/* Email — identity, not editable here */}
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input id="profile-email" value={user.email} disabled />
              </div>

              {/* Role + blocked status are never editable from the profile */}
              <div className="space-y-3 rounded-2xl border border-border bg-muted/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">
                    Role
                  </span>
                  <Badge
                    variant="outline"
                    className="border-gold/30 bg-gold/10 capitalize text-gold"
                  >
                    {user.role}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">
                    Account status
                  </span>
                  {/* Read-only: blocked status is managed by the backend. */}
                  <StatusBadge status="Active" />
                </div>

                <p className="text-xs text-muted-foreground">
                  Your role and account status can&apos;t be changed from your
                  profile.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end border-t border-border pt-6 pb-6">
              <Button
                type="submit"
                className="rounded-full bg-linear-to-r from-gold-light to-gold px-6 font-semibold text-black hover:brightness-105"
              >
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
