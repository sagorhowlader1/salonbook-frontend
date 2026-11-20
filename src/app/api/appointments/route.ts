
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // 1. Verify Better Auth Session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to book an appointment.",
        },
        { status: 401 }
      );
    }

    // 2. Only customers can book appointments
    if (session.user.role !== "customer") {
      return NextResponse.json(
        {
          success: false,
          message: "Only customers can book appointments.",
        },
        { status: 403 }
      );
    }

    // 3. Read request body
    const body = await request.json();

    const {
      serviceId,
      appointmentDate,
      timeSlot,
      message,
    } = body;

    // 4. Backend configuration
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5000";

    const secret = process.env.INTERNAL_API_SECRET;

    if (!secret) {
      throw new Error("INTERNAL_API_SECRET is not configured");
    }

    // 5. Send request to Express Backend
    const response = await fetch(
      `${backendUrl}/appointments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-customer-id": session.user.id,
          "x-internal-api-secret": secret,
        },
        body: JSON.stringify({
          serviceId,
          appointmentDate,
          timeSlot,
          message,
        }),
        cache: "no-store",
      }
    );

    const result = await response.json();

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("Create Appointment API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to book appointment.",
      },
      { status: 500 }
    );
  }
}
