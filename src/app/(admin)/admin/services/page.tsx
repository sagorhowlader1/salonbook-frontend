

"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Clock, DollarSign, Pencil, Plus, Trash2 } from "lucide-react"
import { cn } from "cn"


import { PageHeader } from "@/components/dashboard/shared/PageHeader"
import { StateBlock } from "@/components/shared/state-block"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import type { Service } from "@/lib/services-data"

// const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/service/`
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/service`;

type BackendService = Omit<Service, "id"> & {
  _id: string
}

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error("Failed to fetch services")
        }

        const data: BackendService[] = await response.json()

        const formattedServices: Service[] = data.map((service) => ({
          ...service,
          id: service._id,
        }))

        setServices(formattedServices)
      } catch (error) {
        // console.error("Fetch services error:", error)
        setError("Unable to load services. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Delete service (local state only for now)

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const handleDelete = async (service: Service) => {

    const toastId = toast.add({
    title: "Delete Service?",
    description: `Are you sure you want to delete "${service.name}"? This action cannot be undone.`,
    type: "warning",
    timeout: 0,

    actionProps: {
      children: "Delete",
      onClick: () => {
        toast.close(toastId)
        void deleteService(service)
      },
    },
  })

    const deleteService = async (service: Service) => {
      try {
        setDeletingId(service.id)

        const response = await fetch(`${API_URL}/${service.id}`, {
          method: "DELETE",
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Failed to delete service")
        }

        setServices((current) =>
          current.filter((item) => item.id !== service.id)
        )

        toast.add({
          title: "Service deleted",
          description: `"${service.name}" has been deleted successfully.`,
          type: "success",
        })
      } catch (error) {
        toast.add({
          title: "Delete failed",
          description: "Unable to delete this service. Please try again.",
          type: "error",
        })
      } finally {
        setDeletingId(null)
      }
    }

  }

  const getImageUrl = (image: string) => {
    if (/^https?:\/\//.test(image)) return image

    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

    return `${baseUrl}${image}`
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-20 pb-14 lg:pt-14">
      <PageHeader
        eyebrow="Catalogue"
        title="Manage Services"
        description="Create, update and remove the services your salon offers."
        action={
          <Button
            nativeButton={false}
            render={<Link href="/admin/services/new" />}
            className="rounded-full bg-linear-to-r from-gold-light to-gold font-semibold text-black hover:brightness-105"
          >
            <Plus />
            Add Service
          </Button>
        }
      />

      <div className="mt-8">
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading services...
          </p>
        ) : error ? (
          <div className="py-10 text-center">
            <p className="text-sm text-destructive">{error}</p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : services.length === 0 ? (
          <StateBlock
            state="empty"
            title="No services yet"
            description="Add your first service and it will show up here."
          />
        ) : (
          <Card className="gap-0 overflow-hidden py-0">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={cn(
                  "flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5",
                  index > 0 && "border-t border-border"
                )}
              >
                {service.image ? (
                  <Image
                    src={getImageUrl(service.image)}
                    alt={service.name}
                    width={72}
                    height={72}
                    unoptimized
                    className="size-16 shrink-0 rounded-xl border border-border object-cover sm:size-[4.5rem]"
                  />
                ) : (
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-xs text-muted-foreground">
                    No Image
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-heading text-base font-semibold text-foreground">
                      {service.name}
                    </h2>

                    <Badge
                      variant="outline"
                      className="border-gold/30 bg-gold/10 text-gold"
                    >
                      {service.category}
                    </Badge>
                  </div>

                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="size-3.5 text-gold" />
                      {Number(service.price).toFixed(2)}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-gold" />
                      {service.duration} min
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <StatusBadge status={service.status} />

                  <div className="flex items-center gap-1.5">
                    <Button
                      nativeButton={false}
                      variant="outline"
                      size="icon-sm"
                      aria-label={`Edit ${service.name}`}
                      render={
                        <Link href={`/admin/services/${service.id}`} />
                      }
                      className="rounded-full"
                    >
                      <Pencil />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${service.name}`}
                      disabled={deletingId === service.id}
                      onClick={() => handleDelete(service)}
                      className="rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      {deletingId === service.id ? (
                        <span className="text-xs">...</span>
                      ) : (
                        <Trash2 />
                      )}
                    </Button>

                    {/* <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${service.name}`}
                      onClick={() => handleDelete(service)}
                      className="rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 />
                    </Button> */}
                  </div>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  )
}
