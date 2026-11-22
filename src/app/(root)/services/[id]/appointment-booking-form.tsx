
"use client";

import { useState } from "react";

const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
];

interface AppointmentBookingFormProps {
  serviceId: string;
}

export default function AppointmentBookingForm({
  serviceId,
}: AppointmentBookingFormProps) {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    success: false,
    message: "",
  });

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Dhaka",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFeedback({ success: false, message: "" });

    if (!appointmentDate || !timeSlot) {
      setFeedback({
        success: false,
        message: "Please select appointment date and time slot.",
      });
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create Appointment
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          appointmentDate,
          timeSlot,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.data?._id) {
        setFeedback({
          success: false,
          message: result.message || "Appointment booking failed.",
        });
        return;
      }

      const appointmentId = result.data._id;

      // Step 2: Create Stripe Checkout Session
      const checkoutResponse = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId,
        }),
      });

      const checkoutResult = await checkoutResponse.json();

      if (!checkoutResponse.ok || !checkoutResult.url) {
        setFeedback({
          success: false,
          message:
            checkoutResult.message ||
            checkoutResult.error ||
            "Appointment created, but payment session could not be created.",
        });
        return;
      }

      // Step 3: Redirect to Stripe
      window.location.href = checkoutResult.url;
    } catch (error) {
      console.error("Appointment booking error:", error);

      setFeedback({
        success: false,
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="text-2xl font-bold">
        Book Your Appointment
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Choose your preferred date and available time slot.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="space-y-2">
          <label htmlFor="appointmentDate" className="text-sm font-medium">
            Appointment Date
          </label>

          <input
            id="appointmentDate"
            type="date"
            min={today}
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
            className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="timeSlot" className="text-sm font-medium">
            Available Time Slot
          </label>

          <select
            id="timeSlot"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            required
            className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a time slot</option>

            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Additional Message (Optional)
          </label>

          <textarea
            id="message"
            rows={4}
            maxLength={1000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write any additional information..."
            className="w-full resize-none rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {feedback.message && (
          <div
            role="alert"
            className={`rounded-lg p-3 text-sm ${
              feedback.success
                ? "bg-green-500/10 text-green-600"
                : "bg-red-500/10 text-red-600"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary cursor-pointer px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Processing Payment..." : "Book Appointment"}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Your appointment will remain Pending until payment is verified
          and confirmed.
        </p>
      </form>
    </div>
  );
}