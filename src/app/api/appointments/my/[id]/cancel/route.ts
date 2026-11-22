
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // 2. Get appointment ID
    const { id } = await params;

    // 3. Backend configuration
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const secret = process.env.INTERNAL_API_SECRET;

    if (!secret) {
      throw new Error("INTERNAL_API_SECRET is not configured");
    }

    // 4. Cancel appointment in Backend
    const response = await fetch(
      `${backendUrl}/appointments/${id}/cancel`,
      {
        method: "PATCH",
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
    console.error("Cancel Appointment API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to cancel appointment",
      },
      { status: 500 }
    );
  }
}
