
import { notFound } from "next/navigation";
import Link from "next/link";
import AppointmentBookingForm from "./appointment-booking-form";

interface Service {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "Active" | "Inactive";
}

interface ServiceDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getService(id: string): Promise<Service | null> {
  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const response = await fetch(`${API_URL}/service/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Service details fetch error:", error);
    return null;
  }
}

export default async function ServiceDetailsPage({
  params,
}: ServiceDetailsPageProps) {
  const { id } = await params;

  const service = await getService(id);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background px-5 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Back Button */}
        <Link
          href="/services"
          className="mb-8 inline-flex text-sm font-medium text-muted-foreground hover:text-primary"
        >
          ← Back to Services
        </Link>

        {/* Service Details */}
        <div className="grid gap-10 lg:grid-cols-2">

          {/* Service Image */}
          <div className="overflow-hidden rounded-2xl border bg-muted">
            {service.image ? (
              <img
                src={service.image}
                alt={service.name}
                className="h-[350px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                No Image Available
              </div>
            )}
          </div>

          {/* Service Information */}
          <div className="flex flex-col justify-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              {service.category}
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              {service.name}
            </h1>

            <p className="mt-5 leading-7 text-muted-foreground">
              {service.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">

              <div className="rounded-xl border bg-card p-5">
                <p className="text-sm text-muted-foreground">
                  Service Price
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  ${service.price}
                </h2>
              </div>

              <div className="rounded-xl border bg-card p-5">
                <p className="text-sm text-muted-foreground">
                  Duration
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {service.duration} min
                </h2>
              </div>

            </div>

            <div className="mt-6">
              <span
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  service.status === "Active"
                    ? "bg-green-500/10 text-green-600"
                    : "bg-red-500/10 text-red-600"
                }`}
              >
                {service.status}
              </span>
            </div>

          </div>
        </div>

        {/* Appointment Booking */}
        <div className="mx-auto mt-16 max-w-2xl">

          {service.status === "Active" ? (
            <AppointmentBookingForm serviceId={service._id} />
          ) : (
            <div className="rounded-2xl border bg-card p-8 text-center">
              <h2 className="text-xl font-bold">
                Service Currently Unavailable
              </h2>

              <p className="mt-3 text-muted-foreground">
                Sorry, this service is currently inactive.
                You cannot book an appointment right now.
              </p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
