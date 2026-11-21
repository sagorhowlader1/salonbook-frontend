
"use client";

import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/shared/section-heading";
import { StateBlock } from "@/components/shared/state-block";
import {
  getMyAppointments,
  type Appointment,
} from "@/lib/api/appointment-api";
import {
  CalendarDays,
  Clock,
  CalendarCheck,
  CalendarX,
} from "lucide-react";

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyAppointments();
        setAppointments(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load appointments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (a) => a.appointmentStatus === "Pending"
  ).length;

  const confirmedAppointments = appointments.filter(
    (a) => a.appointmentStatus === "Confirmed"
  ).length;

  const cancelledAppointments = appointments.filter(
    (a) => a.appointmentStatus === "Cancelled"
  ).length;

  const stats = [
    {
      title: "Total Requests",
      value: totalAppointments,
      icon: CalendarDays,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Pending Appointments",
      value: pendingAppointments,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50 dark:bg-yellow-950/30",
    },
    {
      title: "Confirmed Appointments",
      value: confirmedAppointments,
      icon: CalendarCheck,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "Cancelled Appointments",
      value: cancelledAppointments,
      icon: CalendarX,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/30",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <SectionHeading
        align="left"
        eyebrow="Customer Dashboard"
        title="Welcome to your dashboard"
        description="Track your appointments and manage your salon bookings."
      />

      {loading ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="h-36 animate-pulse rounded-2xl border bg-muted/50"
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-10">
          <StateBlock
            state="error"
            title="Failed to load dashboard"
            description={error}
          />
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>

                    <div className={`rounded-xl p-3 ${stat.bg}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>

                  <h3 className="mt-5 text-3xl font-bold tracking-tight">
                    {stat.value}
                  </h3>
                </div>
              );
            })}
          </div>

          {appointments.length === 0 && (
            <div className="mt-8">
              <StateBlock
                state="empty"
                title="No appointments yet"
                description="Book your first appointment and your booking statistics will appear here."
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
