import { notFound } from "next/navigation"

import { seedServices } from "@/lib/services-data"
import { UpdateServiceClient } from "./update-service-client"

// The form is client-side and the id is resolved per request, so this
// segment opts out of instant-navigation / static-shell validation.
// `instant` is only legal in Server Component modules — hence the
// server wrapper with a colocated client child.
export const instant = false

interface UpdateServicePageProps {
  params: Promise<{ id: string }>
}

export default async function UpdateServicePage({
  params,
}: UpdateServicePageProps) {
  const { id } = await params
  const service = seedServices.find((item) => item.id === id)

  if (!service) {
    notFound()
  }

  return <UpdateServiceClient service={service} />
}
