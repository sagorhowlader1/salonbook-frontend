
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getSession } from "@/lib/core/server";

export async function POST(request: Request) {
  try {
    // 1. Verify logged-in user
    const userSession = await getSession();

    if (!userSession?.user) {
      return NextResponse.json(
        { success: false, message: "Please login first." },
        { status: 401 }
      );
    }

    // 2. Get Appointment ID
    const { appointmentId } = await request.json();

    if (!appointmentId) {
      return NextResponse.json(
        { success: false, message: "Appointment ID is required." },
        { status: 400 }
      );
    }

    // 3. Backend configuration
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const secret = process.env.INTERNAL_API_SECRET;

    if (!secret) {
      throw new Error("INTERNAL_API_SECRET is missing");
    }

    // 4. Verify appointment belongs to this customer
    const appointmentResponse = await fetch(
      `${backendUrl}/appointments/${appointmentId}`,
      {
        method: "GET",
        headers: {
          "x-customer-id": userSession.user.id,
          "x-internal-api-secret": secret,
        },
        cache: "no-store",
      }
    );

    const appointmentResult = await appointmentResponse.json();

    if (!appointmentResponse.ok || !appointmentResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: appointmentResult.message || "Appointment not found.",
        },
        { status: appointmentResponse.status || 404 }
      );
    }

    const appointment = appointmentResult.data;

    // 5. Check appointment payment status
    if (
      appointment.appointmentStatus !== "Pending" ||
      appointment.paymentStatus !== "Unpaid"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "This appointment cannot be paid.",
        },
        { status: 409 }
      );
    }

    // 6. Get price from database
    const price = Number(appointment.servicePrice);

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid service price." },
        { status: 400 }
      );
    }

    // 7. Get website URL
    const headersList = await headers();
    const origin =
      headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    if (!origin) {
      throw new Error("Website URL is not configured");
    }

    // 8. Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: appointment.serviceName,
              description: `Appointment on ${appointment.appointmentDate}, ${appointment.timeSlot}`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],

      customer_email: userSession.user.email,

      client_reference_id: appointment._id,

      metadata: {
        appointmentId: appointment._id,
        userId: userSession.user.id,
      },

      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${origin}/services/${appointment.serviceId}?booking=cancelled`,
    });

    // 9. Return Checkout URL
    return NextResponse.json({
      success: true,
      url: checkoutSession.url,
    });

  } catch (error) {
    console.error("Stripe Checkout Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Payment session creation failed.",
      },
      { status: 500 }
    );
  }
}












// import { NextResponse } from 'next/server'
// import { headers } from 'next/headers'
// import { stripe } from '@/lib/stripe';
// import { getSession } from '@/lib/core/server';



// export async function POST() {

//     const userSession = await getSession()

//     try {
//         const headersList = await headers()
//         const origin = headersList.get('origin')

//         // Create Checkout Sessions from body params.
//         const session = await stripe.checkout.sessions.create({
//             line_items: [
//                 {
//                     // Provide the exact Price ID (for example, price_1234) of the product you want to sell
//                     price: 'price_1Ue9GACuRlxksatSK5C8G68X',
//                     quantity: 1,
//                 },
//             ],
//             mode: 'payment',
//             customer_email: userSession?.user.email,
//             metadata: {
//                 userId: userSession?.user.id || "",

//             },
//             success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
//             // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
//             integration_identifier: 'salon_book_web_001',
//         });
//         return NextResponse.redirect(session.url as string, 303)
//     } catch (err) {
//         const error = err instanceof Error ? err : new Error(String(err))
//         return NextResponse.json(
//             { error: error.message },
//             { status: 500 }
//         )
//     }
// }