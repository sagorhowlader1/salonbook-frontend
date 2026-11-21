
"use client";

import { useEffect, useState } from "react";

interface DashboardStats {
  totalCustomers: number;
  totalActiveServices: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  totalSuccessfulPayments: number;
}

const statsConfig = [
  {
    key: "totalCustomers",
    title: "Registered Customers",
    description: "Total registered customers",
    icon: "👥",
    color: "blue",
  },
  {
    key: "totalActiveServices",
    title: "Active Services",
    description: "Currently available services",
    icon: "✂️",
    color: "purple",
  },
  {
    key: "totalAppointments",
    title: "Appointment Requests",
    description: "All appointment requests",
    icon: "📅",
    color: "indigo",
  },
  {
    key: "pendingAppointments",
    title: "Pending Appointments",
    description: "Waiting for confirmation",
    icon: "⏳",
    color: "amber",
  },
  {
    key: "confirmedAppointments",
    title: "Confirmed Appointments",
    description: "Successfully confirmed bookings",
    icon: "✓",
    color: "green",
  },
  {
    key: "totalSuccessfulPayments",
    title: "Successful Payments",
    description: "Total successful transactions",
    icon: "$",
    color: "emerald",
  },
] as const;

const colorStyles: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
  indigo: "bg-indigo-50 text-indigo-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-green-50 text-green-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

const OverViewPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/dashboard/stats", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load dashboard statistics."
          );
        }

        setStats(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to your admin dashboard. Here&apos;s what&apos;s happening
          with your salon.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {statsConfig.map((item) => (
            <div
              key={item.key}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="h-10 w-10 rounded-xl bg-gray-200" />
              <div className="mt-5 h-4 w-32 rounded bg-gray-200" />
              <div className="mt-3 h-8 w-20 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-700">
            Unable to load dashboard statistics
          </p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      {!loading && !error && stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {statsConfig.map((item) => (
            <div
              key={item.key}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${colorStyles[item.color]}`}
                >
                  {item.icon}
                </div>

                <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
                  Overview
                </span>
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-gray-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                  {stats[item.key].toLocaleString()}
                </h2>

                <p className="mt-2 text-xs text-gray-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OverViewPage;
