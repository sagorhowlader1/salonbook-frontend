
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Service = {
  _id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description: string;
  image: string;
  status: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/service`);

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data: Service[] = await response.json();

        setServices(
          data.filter((service) => service.status === "Active").slice(0, 6)
        );
      } catch (error) {
        console.error("Featured services error:", error);
        setError("Unable to load services right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Our Services
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            Featured Salon Services
          </h2>

          <p className="text-muted-foreground mt-3">
            Discover our professional beauty and salon services.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            Loading services...
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : services.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No active services available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {services.map((service) => (
              <div
                key={service._id}
                className="rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <div className="relative h-56 bg-muted">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-primary font-medium">
                      {service.category}
                    </span>

                    <span className="text-sm text-muted-foreground">
                      {service.duration} min
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mt-3">
                    {service.name}
                  </h3>

                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between mt-5">
                    <span className="text-xl font-bold">
                      ${service.price}
                    </span>

                    <Link
                      href={`/services/${service._id}`}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
