"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Clock, DollarSign, Pencil, Plus, Trash2 } from "lucide-react"
import { cn } from "cn"

import { PageHeader } from "@/components/dashboard/shared/PageHeader"
import { StateBlock } from "@/components/shared/state-block"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import { seedServices, type Service } from "@/lib/services-data"

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>(seedServices)

  const handleDelete = (service: Service) => {
    setServices((current) =>
      current.filter((item) => item.id !== service.id)
    )
    toast.add({
      title: "Service deleted",
      description: `"${service.name}" has been removed from your catalogue.`,
      type: "success",
    })
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
        {services.length === 0 ? (
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
                <Image
                  src={service.image}
                  alt={service.name}
                  width={72}
                  height={72}
                  className="size-16 shrink-0 rounded-xl border border-border object-cover sm:size-[4.5rem]"
                />

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
                      {service.price.toFixed(2)}
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
                      render={<Link href={`/admin/services/${service.id}`} />}
                      className="rounded-full"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${service.name}`}
                      onClick={() => handleDelete(service)}
                      className="rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 />
                    </Button>
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
