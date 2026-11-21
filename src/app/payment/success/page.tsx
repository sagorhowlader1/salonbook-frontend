
import Link from "next/link";
import { chechoutVerify } from "@/lib/actions/payments";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { connection } from "next/server";

function StatusIcon({ success = false }: { success?: boolean }) {
  return (
    <div
      className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
        success ? "bg-emerald-100" : "bg-red-100"
      }`}
    >
      {success ? (
        <svg
          className="h-10 w-10 text-emerald-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            d="M5 12.5 9.5 17 19 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          className="h-10 w-10 text-red-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M12 8v4m0 4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}

function PaymentError({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-10">
        <StatusIcon />

        <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
          {message}
        </p>

        <Link
          href="/dashboard/appointments"
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          View My Appointments
        </Link>
      </div>
    </main>
  );
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  await connection();

  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <PaymentError
        title="Invalid Payment Session"
        message="We could not find a valid payment session. Please check your payment link or contact our support team."
      />
    );
  }

  // Step 1: Retrieve Stripe Session
  let session;

  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch (error) {
    console.error("Stripe Session Retrieval Error:", error);

    return (
      <PaymentError
        title="Unable to Retrieve Payment"
        message="We could not retrieve your payment information. Please try again or contact support."
      />
    );
  }

  if (session.status === "open") {
    redirect("/");
  }

  // Step 2: Check Payment Status
  if (
    session.status !== "complete" ||
    session.payment_status !== "paid"
  ) {
    return (
      <PaymentError
        title="Payment Not Completed"
        message="Your payment has not been completed. No successful payment confirmation was received."
      />
    );
  }

  // Step 3: Verify Payment with Backend
  let result;

  try {
    result = await chechoutVerify(session_id);
  } catch (error) {
    console.error("Backend Payment Verification Error:", error);

    return (
      <PaymentError
        title="Verification Failed"
        message="Your payment was received, but we could not confirm it with our server. Please contact support with your payment reference."
      />
    );
  }

  if (!result.success) {
    return (
      <PaymentError
        title="Payment Verification Failed"
        message={
          result.message ||
          "We could not verify your payment. Please contact our support team."
        }
      />
    );
  }

  // Step 4: Payment Verified Successfully
  const formattedAmount =
    session.amount_total !== null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: session?.currency?.toUpperCase(),
        }).format(session.amount_total / 100)
      : "N/A";

  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 dark:bg-slate-950">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-900/20" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-900/20" />

      <div className="relative w-full max-w-xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          {/* Top Success Header */}
          <div className="px-6 pb-8 pt-10 text-center sm:px-10 sm:pt-12">
            <StatusIcon success />

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Payment Verified
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Payment Successful!
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">
              Your payment has been successfully verified. Your appointment
              is now confirmed.
            </p>
          </div>

          {/* Payment Amount */}
          <div className="mx-6 rounded-2xl bg-emerald-50 px-5 py-6 text-center dark:bg-emerald-950/30 sm:mx-10">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Total Amount Paid
            </p>

            <p className="mt-2 text-4xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
              {formattedAmount}
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  d="m5 12 4 4L19 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Successfully Paid
            </div>
          </div>

          {/* Transaction Details */}
          <div className="px-6 py-7 sm:px-10">
            <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Payment Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Payment Status
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  Paid
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Customer Email
                </span>
                <span className="max-w-[65%] break-all text-right text-sm font-medium text-slate-800 dark:text-slate-200">
                  {session.customer_details?.email ||
                    session.customer_email ||
                    "N/A"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Payment Method
                </span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Stripe Checkout
                </span>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-4 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Transaction Reference
                </p>

                <p className="mt-2 break-all rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {session.id}
                </p>
              </div>
            </div>

            {/* Confirmation Message */}
            <div className="mt-6 flex gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"
                  strokeLinejoin="round"
                />
                <path
                  d="m9 12 2 2 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">
                Your payment has been verified by our server. Keep your
                transaction reference for future inquiries.
              </p>
            </div>

            {/* Action Button */}
            <Link
              href="/dashboard/appointments"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-emerald-600/30"
            >
              View My Appointments

              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M5 12h14m-7-7 7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <p className="mt-5 text-center text-xs text-slate-400">
              Thank you for choosing SalonBook!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
