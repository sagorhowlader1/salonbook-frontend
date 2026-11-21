
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";

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

interface BrowseServicesProps {
  services: Service[];
  initialCategory?: string;
}

export default function BrowseServices({
  services,
  initialCategory = "",
}: BrowseServicesProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("default");

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(services.map((service) => service.category).filter(Boolean))];
  }, [services]);

  // Search, Filter and Sorting
  const filteredServices = useMemo(() => {
    let result = services.filter((service) => {
      const matchesSearch = service.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        !category || service.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low-to-high") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "high-to-low") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [services, search, category, sort]);

  return (
    <section>
      {/* Search and Filters */}
      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* Search */}
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="text"
            placeholder="Search services by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border bg-card pl-11 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <SlidersHorizontal
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 w-full appearance-none rounded-xl border bg-card px-11 text-sm outline-none focus:border-primary"
          >
            <option value="">All Categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Price Sorting */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-12 w-full rounded-xl border bg-card px-4 text-sm outline-none focus:border-primary"
        >
          <option value="default">Sort by Price</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing {filteredServices.length} of {services.length} services
        </p>

        {(search || category || sort !== "default") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("");
              setSort("default");
            }}
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Service Cards */}
      {filteredServices.length === 0 ? (
        <div className="py-20 text-center">
          <h2 className="text-xl font-semibold">
            No Services Found
          </h2>

          <p className="mt-2 text-muted-foreground">
            Try another search or category.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("");
              setSort("default");
            }}
            className="mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <div
              key={service._id}
              className="overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-lg"
            >
              <div className="h-56 overflow-hidden bg-muted">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No Image Available
                  </div>
                )}
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <p className="text-sm text-primary">
                    {service.category}
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    {service.name}
                  </h2>
                </div>

                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {service.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">
                    ${service.price}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    {service.duration} min
                  </span>
                </div>

                <Link
                  href={`/services/${service._id}`}
                  className="block rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
