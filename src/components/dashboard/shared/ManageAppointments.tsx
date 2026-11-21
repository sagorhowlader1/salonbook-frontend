
"use client";

import { useEffect, useMemo, useState } from "react";

interface Appointment {
  _id: string;
  customer: {
    name: string;
    email: string;
  };
  service: {
    name: string;
    category: string;
    image: string;
    price: number;
    duration: number;
  };
  appointmentDate: string;
  timeSlot: string;
  message: string;
  appointmentStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [updatingId, setUpdatingId] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/appointments", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load appointments.");
      }

      setAppointments(result.data || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (
    id: string,
    status: "Confirmed" | "Cancelled"
  ) => {
    const action = status === "Confirmed" ? "confirm" : "cancel";

    if (!window.confirm(`Are you sure you want to ${action} this appointment?`)) {
      return;
    }

    try {
      setUpdatingId(id);

      const response = await fetch(
        `/api/admin/appointments/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update appointment.");
      }

      await fetchAppointments();

      setSelected((previous) =>
        previous?._id === id
          ? { ...previous, appointmentStatus: status }
          : previous
      );

    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        appointment.customer.name.toLowerCase().includes(searchText) ||
        appointment.customer.email.toLowerCase().includes(searchText) ||
        appointment.service.name.toLowerCase().includes(searchText);

      const matchesFilter =
        filter === "All" ||
        appointment.appointmentStatus === filter;

      return matchesSearch && matchesFilter;
    });
  }, [appointments, search, filter]);

  const formatDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-50 text-emerald-700";
      case "Pending":
        return "bg-amber-50 text-amber-700";
      case "Cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const paidStyle = (status: string) =>
    status === "Paid"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-gray-100 text-gray-600";

  const pendingCount = appointments.filter(
    (item) => item.appointmentStatus === "Pending"
  ).length;

  const confirmedCount = appointments.filter(
    (item) => item.appointmentStatus === "Confirmed"
  ).length;

  const cancelledCount = appointments.filter(
    (item) => item.appointmentStatus === "Cancelled"
  ).length;

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Manage Appointments
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all customer appointment requests.
          </p>
        </div>

        <button
          onClick={fetchAppointments}
          disabled={loading}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Appointments",
            value: appointments.length,
            color: "text-gray-900",
          },
          {
            label: "Pending Requests",
            value: pendingCount,
            color: "text-amber-600",
          },
          {
            label: "Confirmed Appointments",
            value: confirmedCount,
            color: "text-emerald-600",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">
              {item.label}
            </p>
            <p className={`mt-2 text-3xl font-bold ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search customer, email or service..."
          className="min-w-0 flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
        >
          <option value="All">All Appointments</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Appointment List */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Appointment Requests
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            {filteredAppointments.length} appointments found
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Loading appointments...
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchAppointments}
              className="mt-3 text-sm font-semibold text-emerald-700"
            >
              Try again
            </button>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No appointments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Appointment Date</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Appointment Status</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {appointment.customer.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {appointment.customer.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-800">
                      {appointment.service.name}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-gray-800">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {appointment.timeSlot}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      ${Number(appointment.service.price).toFixed(2)}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(appointment.appointmentStatus)}`}>
                        {appointment.appointmentStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${paidStyle(appointment.paymentStatus)}`}>
                        {appointment.paymentStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelected(appointment)}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                        >
                          Details
                        </button>

                        {appointment.appointmentStatus === "Pending" && (
                          <button
                            disabled={updatingId === appointment._id}
                            onClick={() => updateStatus(appointment._id, "Confirmed")}
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Confirm
                          </button>
                        )}

                        {["Pending", "Confirmed"].includes(appointment.appointmentStatus) && (
                          <button
                            disabled={updatingId === appointment._id}
                            onClick={() => updateStatus(appointment._id, "Cancelled")}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Appointment Details
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Booking reference: {selected._id}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-lg px-3 py-2 text-xl text-gray-500 hover:bg-gray-100"
                aria-label="Close details"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-gray-500">Customer Name</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selected.customer.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">Customer Email</p>
                <p className="mt-1 break-all font-semibold text-gray-900">
                  {selected.customer.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">Service</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selected.service.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">Service Category</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selected.service.category || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">Appointment Date</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {formatDate(selected.appointmentDate)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">Appointment Time</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selected.timeSlot}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">Service Price</p>
                <p className="mt-1 font-semibold text-gray-900">
                  ${Number(selected.service.price).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">Duration</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selected.service.duration} minutes
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">Appointment Status</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selected.appointmentStatus}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">Payment Status</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selected.paymentStatus}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">Booking Request Date</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {formatDate(selected.createdAt)}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-medium text-gray-500">Customer Message</p>
                <p className="mt-2 rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                  {selected.message || "No message provided."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 px-6 py-4">
              {selected.appointmentStatus === "Pending" && (
                <button
                  disabled={updatingId === selected._id}
                  onClick={() => updateStatus(selected._id, "Confirmed")}
                  className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  Confirm Appointment
                </button>
              )}

              {["Pending", "Confirmed"].includes(selected.appointmentStatus) && (
                <button
                  disabled={updatingId === selected._id}
                  onClick={() => updateStatus(selected._id, "Cancelled")}
                  className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {cancelledCount > 0 && (
        <p className="text-xs text-gray-500">
          {cancelledCount} appointment(s) cancelled.
        </p>
      )}
    </div>
  );
}
