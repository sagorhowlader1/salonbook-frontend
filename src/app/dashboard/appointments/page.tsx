
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Eye,
  CreditCard,
  XCircle,
  RefreshCw,
} from "lucide-react";

import {
  Appointment,
  getMyAppointments,
  cancelAppointment,
} from "@/lib/api/appointment-api";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function MyAppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyAppointments();
      setAppointments(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

 const handleCancel = async (id: string) => {
  try {
    setDeletingId(id);

    await cancelAppointment(id);

    toast.add({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled successfully.",
    });

    await fetchAppointments();
  } catch (error) {
    toast.add({
      title: "Cancellation Failed",
      description:
        error instanceof Error
          ? error.message
          : "Failed to cancel appointment. Please try again.",
    });
  } finally {
    setDeletingId(null);
  }
};

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <RefreshCw className="animate-spin" />
        <span className="ml-2">Loading appointments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border p-8 text-center">
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchAppointments} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 space-y-6 px-4 pb-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            My Appointments
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and track your appointments.
          </p>
        </div>

        <Button onClick={() => router.push("/services")}>
          Book Appointment
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: "Total",
            value: appointments.length,
          },
          {
            label: "Pending",
            value: appointments.filter(
              (a) => a.appointmentStatus === "Pending"
            ).length,
          },
          {
            label: "Confirmed",
            value: appointments.filter(
              (a) => a.appointmentStatus === "Confirmed"
            ).length,
          },
          {
            label: "Cancelled",
            value: appointments.filter(
              (a) => a.appointmentStatus === "Cancelled"
            ).length,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border bg-card p-4"
          >
            <p className="text-sm text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-1 text-2xl font-bold">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Appointment List */}
      {appointments.length === 0 ? (
        <div className="rounded-xl border p-12 text-center">
          <CalendarDays className="mx-auto mb-4 size-10 text-muted-foreground" />

          <h2 className="text-lg font-semibold">
            No appointments yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            You haven't booked any services yet.
          </p>

          <Button
            className="mt-5"
            onClick={() => router.push("/services")}
          >
            Explore Services
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="rounded-xl border bg-card p-4 sm:p-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Service Image */}
                <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg sm:aspect-square sm:h-28 sm:w-28 md:h-32 md:w-32">
                  <Image
                    src={
                      appointment.serviceImage ||
                      "/images/service-placeholder.png"
                    }
                    alt={appointment.serviceName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Information */}
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h2 className="font-semibold">
                        {appointment.serviceName}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {appointment.serviceCategory}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${appointment.appointmentStatus === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : appointment.appointmentStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {appointment.appointmentStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-4" />
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()}
                    </p>

                    <p className="flex items-center gap-2">
                      <Clock className="size-4" />
                      {appointment.timeSlot}
                    </p>

                    <p className="font-semibold">
                      ${appointment.servicePrice}
                    </p>

                    <p>
                      Payment:{" "}
                      <span
                        className={
                          appointment.paymentStatus === "Paid"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {appointment.paymentStatus}
                      </span>
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Requested:{" "}
                    {new Date(
                      appointment.createdAt
                    ).toLocaleString()}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setSelectedAppointment(appointment)
                      }
                    >
                      <Eye className="mr-1 size-4" />
                      Details
                    </Button>

                    {appointment.appointmentStatus ===
                      "Pending" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={deletingId === appointment._id}
                          onClick={() =>
                            handleCancel(appointment._id)
                          }
                        >
                          <XCircle className="mr-1 size-4" />
                          {deletingId === appointment._id
                            ? "Cancelling..."
                            : "Cancel"}
                        </Button>
                      )}

                    {appointment.appointmentStatus ===
                      "Confirmed" &&
                      appointment.paymentStatus === "Unpaid" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/appointments/${appointment._id}/payment`
                            )
                          }
                        >
                          <CreditCard className="mr-1 size-4" />
                          Pay Now
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointment Details */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md space-y-4 rounded-xl bg-background p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                Appointment Details
              </h2>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSelectedAppointment(null)}
              >
                <XCircle />
              </Button>
            </div>

            <div className="space-y-3 text-sm">
              <p>
                <strong>Service:</strong>{" "}
                {selectedAppointment.serviceName}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {selectedAppointment.serviceCategory}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  selectedAppointment.appointmentDate
                ).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {selectedAppointment.timeSlot}
              </p>
              <p>
                <strong>Price:</strong> $
                {selectedAppointment.servicePrice}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedAppointment.appointmentStatus}
              </p>
              <p>
                <strong>Payment:</strong>{" "}
                {selectedAppointment.paymentStatus}
              </p>
              <p>
                <strong>Request Date:</strong>{" "}
                {new Date(
                  selectedAppointment.createdAt
                ).toLocaleString()}
              </p>
            </div>

            <Button
              className="w-full"
              onClick={() => setSelectedAppointment(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
