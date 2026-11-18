"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"
import { cn } from "cn"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import {
  serviceCategories,
  serviceStatuses,
  type Service,
  type ServiceStatus,
} from "@/lib/services-data"

interface ServiceFormProps {
  /** "add" creates a service, "update" edits an existing one. */
  mode?: "add" | "update"
  /** Existing service being edited. */
  service?: Service
}

type ErrorMap = Partial<Record<"name" | "category" | "description" | "price" | "duration" | "image", string>>

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
 * Create / update form for a single service. UI-only: submitting validates
 * the rules (positive price, positive duration, required fields), shows a
 * toast and navigates back to the Manage Services list.
 */
export function ServiceForm({ mode = "add", service }: ServiceFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  const [name, setName] = useState(service?.name ?? "")
  const [category, setCategory] = useState(service?.category ?? "")
  const [description, setDescription] = useState(service?.description ?? "")
  const [price, setPrice] = useState(service ? String(service.price) : "")
  const [duration, setDuration] = useState(service ? String(service.duration) : "")
  const [status, setStatus] = useState<ServiceStatus>(service?.status ?? "Active")
  const [previewUrl, setPreviewUrl] = useState<string | null>(service?.image ?? null)
  const [imageFile, setImageFile] = useState<File | null>(null)
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
    setImageFile(file)
    setPreviewUrl(url)
    clearError("image")
  }

  const handleRemoveImage = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setImageFile(null)
    setPreviewUrl(service?.image ?? null)
    clearError("image")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const validate = (): ErrorMap => {
    const next: ErrorMap = {}

    if (!name.trim()) next.name = "Service name is required."
    if (!category) next.category = "Please select a service category."
    if (!description.trim()) next.description = "Description is required."

    const priceValue = Number(price)
    if (!price.trim() || Number.isNaN(priceValue) || priceValue <= 0) {
      next.price = "Price must be a positive number."
    }

    const durationValue = Number(duration)
    if (!duration.trim() || Number.isNaN(durationValue) || durationValue <= 0) {
      next.duration = "Duration must be a positive number."
    }

    if (!previewUrl) next.image = "Please upload a service image."

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
      title: mode === "add" ? "Service created" : "Service updated",
      description:
        mode === "add"
          ? `"${name.trim()}" has been added to your catalogue.`
          : `"${name.trim()}" has been saved.`,
      type: "success",
    })

    router.push("/admin/services")
  }

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <CardHeader className="pt-6">
          <CardTitle>Service Details</CardTitle>
          <CardDescription>
            Fill in the information below. Fields marked with * are required.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Name + category */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="service-name">
                Service Name <RequiredMark />
              </Label>
              <Input
                id="service-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  clearError("name")
                }}
                placeholder="e.g. Signature Haircut"
                aria-invalid={Boolean(errors.name)}
                className={cn(errors.name && "border-destructive")}
              />
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-category">
                Service Category <RequiredMark />
              </Label>
              <Select
                value={category || null}
                onValueChange={(value) => {
                  setCategory(value ?? "")
                  clearError("category")
                }}
              >
                <SelectTrigger
                  id="service-category"
                  aria-invalid={Boolean(errors.category)}
                  className={cn(
                    "h-9 w-full",
                    errors.category && "border-destructive"
                  )}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <FieldError>{errors.category}</FieldError>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="service-description">
              Description <RequiredMark />
            </Label>
            <Textarea
              id="service-description"
              rows={4}
              value={description}
              onChange={(event) => {
                setDescription(event.target.value)
                clearError("description")
              }}
              placeholder="Describe what's included in this service…"
              aria-invalid={Boolean(errors.description)}
              className={cn(errors.description && "border-destructive")}
            />
            {errors.description && (
              <FieldError>{errors.description}</FieldError>
            )}
          </div>

          {/* Price + duration */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="service-price">
                Price <RequiredMark />
              </Label>
              <div className="relative">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground"
                >
                  $
                </span>
                <Input
                  id="service-price"
                  type="number"
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  value={price}
                  onChange={(event) => {
                    setPrice(event.target.value)
                    clearError("price")
                  }}
                  placeholder="0.00"
                  aria-invalid={Boolean(errors.price)}
                  className={cn(
                    "pl-7",
                    errors.price && "border-destructive"
                  )}
                />
              </div>
              {errors.price && <FieldError>{errors.price}</FieldError>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-duration">
                Estimated Duration (in minutes) <RequiredMark />
              </Label>
              <div className="relative">
                <Input
                  id="service-duration"
                  type="number"
                  min={0}
                  step="1"
                  inputMode="numeric"
                  value={duration}
                  onChange={(event) => {
                    setDuration(event.target.value)
                    clearError("duration")
                  }}
                  placeholder="e.g. 45"
                  aria-invalid={Boolean(errors.duration)}
                  className={cn(
                    "pr-12",
                    errors.duration && "border-destructive"
                  )}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground"
                >
                  min
                </span>
              </div>
              {errors.duration && <FieldError>{errors.duration}</FieldError>}
            </div>
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <Label>
              Service Image <RequiredMark />
            </Label>
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
                "flex min-h-44 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-6 text-center transition-colors",
                dragging
                  ? "border-gold bg-gold/5"
                  : "border-border bg-muted/30",
                errors.image && "border-destructive/60"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                aria-label="Upload service image"
                className="sr-only"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />

              {previewUrl ? (
                <>
                  {/* Blob previews can't go through next/image. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Service image preview"
                    className="h-36 w-full max-w-sm rounded-xl border border-border object-cover"
                  />
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      nativeButton={false}
                      size="sm"
                      className="rounded-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Replace image
                    </Button>
                    <Button
                      type="button"
                      nativeButton={false}
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="max-w-full truncate text-xs text-muted-foreground">
                    {imageFile
                      ? `${imageFile.name} · ${Math.max(1, Math.round(imageFile.size / 1024))} KB`
                      : "Current service image"}
                  </p>
                </>
              ) : (
                <>
                  <span className="flex size-11 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <Upload className="size-5" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Drag & drop your image here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG or WEBP
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    nativeButton={false}
                    size="sm"
                    className="rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse files
                  </Button>
                </>
              )}
            </div>
            {errors.image && <FieldError>{errors.image}</FieldError>}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Service Status</Label>
            <div
              role="radiogroup"
              aria-label="Service status"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted p-1"
            >
              {serviceStatuses.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={status === option}
                  onClick={() => setStatus(option)}
                  className={cn(
                    "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    status === option
                      ? "bg-linear-to-r from-gold-light to-gold text-black shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {status === "Active"
                ? "Active services are visible to customers."
                : "Inactive services are hidden from customers."}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col-reverse gap-2 border-t border-border pt-6 pb-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            nativeButton={false}
            variant="outline"
            className="rounded-full px-5"
            onClick={() => router.push("/admin/services")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            nativeButton={false}
            className="rounded-full bg-linear-to-r from-gold-light to-gold px-6 font-semibold text-black hover:brightness-105"
          >
            {mode === "add" ? "Add Service" : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
