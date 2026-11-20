import { PageHeader } from "@/components/dashboard/shared/PageHeader"
import { ServiceForm } from "@/components/dashboard/shared/ServiceForm"
import { Suspense } from "react"
export const instant = false

export default function NewServicePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-20 pb-14 lg:pt-14">
      {/* <PageHeader
        backHref="/admin/services"
        backLabel="Back to services"
        eyebrow="Catalogue"
        title="Add Service"
        description="Fill in the details below to publish a new service to your catalogue."
      /> */}


      <div className="mt-8">
        <ServiceForm mode="add" />
      </div>

    </div>
  )
}
