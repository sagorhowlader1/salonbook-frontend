
import { notFound } from "next/navigation";

import type { Service } from "@/lib/services-data";
import { UpdateServiceClient } from "./update-service-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/service`;

interface UpdateServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateServicePage({
  params,
}: UpdateServicePageProps) {
  const { id } = await params;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      notFound();
    }

    const data = await response.json();

    const service: Service = {
      ...data,
      id: data._id,
    };

    return <UpdateServiceClient service={service} />;
  } catch {
    notFound();
  }
}
