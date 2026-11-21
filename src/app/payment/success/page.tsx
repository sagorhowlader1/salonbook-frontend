
import { chechoutVerify } from "@/lib/actions/payments";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  await connection();

  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <section className="mx-auto max-w-xl p-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Invalid Payment Session
        </h1>
        <p className="mt-3 text-muted-foreground">
          Please provide a valid payment session ID.
        </p>
      </section>
    );
  }

  try {
    // Step 1: Retrieve Stripe Session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.status === "open") {
      redirect("/");
    }

    // Step 2: Check Payment Status
    if (
      session.status !== "complete" ||
      session.payment_status !== "paid"
    ) {
      return (
        <section className="mx-auto max-w-xl p-10 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Payment Not Completed
          </h1>
          <p className="mt-3 text-muted-foreground">
            Your payment has not been completed. Please try again.
          </p>
        </section>
      );
    }

    // Step 3: Verify Payment with Backend
    const result = await chechoutVerify(session_id);

    if (!result.success) {
      return (
        <section className="mx-auto max-w-xl p-10 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Payment Verification Failed
          </h1>
          <p className="mt-3 text-muted-foreground">
            {result.message || "We could not verify your payment."}
          </p>
        </section>
      );
    }

    // Step 4: Payment Verified Successfully
    return (
      <section className="mx-auto max-w-xl p-10 text-center">
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-green-600">
            Payment Successful!
          </h1>

          <p className="mt-4 text-muted-foreground">
            Your payment has been verified successfully.
          </p>

          <p className="mt-3 text-sm text-muted-foreground">
            A confirmation email will be sent to {session.customer_email}.
          </p>

          <a
            href="/dashboard/appointments"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            View My Appointments
          </a>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Payment Success Page Error:", error);

    return (
      <section className="mx-auto max-w-xl p-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Something Went Wrong
        </h1>
        <p className="mt-3 text-muted-foreground">
          We could not verify your payment. Please contact support.
        </p>
      </section>
    );
  }
}





// import { chechoutVerify } from '@/lib/actions/payments'
// import { stripe } from '@/lib/stripe'
// import { redirect } from 'next/navigation'
// import { connection } from 'next/server'



// export default async function PaymentSuccessPage({ searchParams }: { searchParams: Promise<{session_id?: string}> } ) {
  
//     await connection()

//     const { session_id } = await searchParams
//     console.log(session_id)

//   if (!session_id){
//       throw new Error('Please provide a valid session_id (`cs_test_...`)')
//   }

//   const {
//     status,
//     payment_status,
//     customer_email,
//     metadata,
//     payment_intent,
//   } = await stripe.checkout.sessions.retrieve(session_id, {
//     expand: ['line_items', 'payment_intent']
//   })

//   if (status === 'open') {
//     return redirect('/')
//   }

  

//   if (status === 'complete' && payment_status === 'paid') {

//     console.log({status,
//     payment_status,
//     customer_email,
//     metadata,
//     payment_intent,})


//     const result = await chechoutVerify(session_id)
//     console.log(result);

//     return (
//       <section id="success">
//         <p>
//           We appreciate your business! A confirmation email will be sent to{' '}
//           {customer_email}. If you have any questions, please email{' '}
//           <a href="mailto:orders@example.com">orders@example.com</a>.
//         </p>
//       </section>
//     )
//   }
// }

