"use client"

import { PageHeader } from "@/components/dashboard/shared/PageHeader"
import { ServiceForm } from "@/components/dashboard/shared/ServiceForm"
import type { Service } from "@/lib/services-data"

interface UpdateServiceClientProps {
  service: Service
}

/** Client shell for the update form (keeps `page.tsx` a Server Component). */
export function UpdateServiceClient({ service }: UpdateServiceClientProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-20 pb-14 lg:pt-14">
      <PageHeader
        backHref="/admin/services"
        backLabel="Back to services"
        eyebrow="Catalogue"
        title="Update Service"
        description="Edit the details, pricing and status of this service."
      />

      <div className="mt-8">
        <ServiceForm mode="update" service={service} />
      </div>
    </div>
  )
}
