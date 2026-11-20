
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    // 1. Verify Better Auth session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    // 2. Backend configuration
    const backendUrl =
      process.env.BACKEND_API_URL || "http://localhost:5000";

    const secret = process.env.INTERNAL_API_SECRET;

    if (!secret) {
      throw new Error("INTERNAL_API_SECRET is not configured");
    }

    // 3. Fetch logged-in customer's appointments
    const response = await fetch(
      `${backendUrl}/appointments/my`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-customer-id": session.user.id,
          "x-internal-api-secret": secret,
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("My Appointments API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch appointments",
      },
      { status: 500 }
    );
  }
}
