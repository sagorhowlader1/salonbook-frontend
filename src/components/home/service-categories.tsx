
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Scissors,
  Palette,
  Sparkles,
  Heart,
  Brush,
  Hand,
  Flower2,
  ArrowRight,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type Service = {
  _id: string;
  category: string;
  status: string;
};

const categoryIcons: Record<string, React.ElementType> = {
  "Haircut & Styling": Scissors,
  "Hair Coloring": Palette,
  "Hair Treatment": Sparkles,
  "Facial & Skincare": Heart,
  Makeup: Brush,
  "Manicure & Pedicure": Hand,
  "Spa & Massage": Flower2,
};

export function ServiceCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/service`);

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const services: Service[] = await response.json();

        const uniqueCategories = [
          ...new Set(
            services
              .filter((service) => service.status === "Active")
              .map((service) => service.category)
              .filter(Boolean)
          ),
        ];

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Category fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-20 px-4 md:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Explore Our Services
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            Browse by Category
          </h2>

          <p className="text-muted-foreground mt-3">
            Find the perfect beauty service for your needs.
          </p>
        </div>

        {loading ? (
          <p className="text-center py-10">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-center py-10 text-muted-foreground">
            No categories available.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.map((category) => {
              const Icon = categoryIcons[category] || Sparkles;

              return (
                <Link
                  key={category}
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="group rounded-2xl border bg-card p-6 hover:border-primary hover:shadow-lg transition"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <Icon size={27} />
                  </div>

                  <h3 className="font-semibold text-base md:text-lg">
                    {category}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-primary mt-4">
                    Explore Services
                    <ArrowRight size={16} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
