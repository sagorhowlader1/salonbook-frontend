"use client";

import {
  LockKeyhole,
  CreditCard,
  CalendarDays,
  Clock,
  Scissors,
  ShieldCheck,
} from "lucide-react";

import { useEffect } from "react";
import { toast } from "@/components/ui/toast";


export default function PaymentClient({
  canceled,
}: {
  canceled: boolean;
}) {
  

  // Show toast when payment is canceled
  useEffect(() => {
    if (canceled) {
      toast.add({
        title: "Order canceled",
        description:
          "Continue to shop around and check out when you're ready.",
          type: "info",
      });
    }
  }, [canceled, toast]);

  // Temporary appointment data
  const appointment = {
    service: "Premium Haircut",
    salon: "SalonBook Studio",
    date: "November 25, 2026",
    time: "04:00 PM",
    duration: "45 minutes",
    price: 20,
    tax: 0,
  };

  const total = appointment.price + appointment.tax;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Your Payment
          </h1>

          <p className="mt-2 text-gray-500">
            Review your appointment details before proceeding.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">

          {/* Payment Information */}
          <div className="space-y-6 lg:col-span-3">

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-gray-100 p-3">
                  <CreditCard className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Payment Method
                  </h2>

                  <p className="text-sm text-gray-500">
                    Secure online payment
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-50 p-3">
                    <CreditCard className="h-5 w-5 text-indigo-600" />
                  </div>

                  <div>
                    <p className="font-medium">
                      Credit / Debit Card
                    </p>

                    <p className="text-sm text-gray-500">
                      Powered by Stripe
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Coming Soon
                </span>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                You'll be redirected to Stripe's secure checkout
                page when online payments are enabled.
              </p>
            </div>

            {/* Security */}
            <div className="flex gap-4 rounded-2xl border bg-white p-5">
              <ShieldCheck className="h-7 w-7 shrink-0 text-green-600" />

              <div>
                <h3 className="font-semibold text-gray-900">
                  Secure Checkout
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Your payment information will be securely
                  processed through Stripe.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 rounded-2xl border bg-white p-6 shadow-sm">

              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Appointment Summary
              </h2>

              <div className="mb-5 flex gap-4">
                <div className="rounded-xl bg-gray-100 p-4">
                  <Scissors className="h-7 w-7 text-gray-700" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    {appointment.service}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {appointment.salon}
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-y py-5 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <CalendarDays className="h-4 w-4" />
                  {appointment.date}
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="h-4 w-4" />
                  {appointment.time} · {appointment.duration}
                </div>
              </div>

              <div className="space-y-3 py-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Service Price
                  </span>

                  <span>${appointment.price.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>

                  <span>${appointment.tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between border-t pt-5">
                <span className="font-semibold text-gray-900">
                  Total Amount
                </span>

                <span className="text-2xl font-bold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Stripe Checkout */}
              <form
                action="/api/checkout_sessions"
                method="POST"
              >
                <button
                  type="submit"
                  className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-4 font-semibold text-white transition hover:bg-gray-700"
                >
                  <LockKeyhole className="h-4 w-4" />
                  Proceed to Payment
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-gray-400">
                By proceeding, you agree to our payment terms.
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}