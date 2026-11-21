
import { NextResponse } from "next/server";
import { getSession } from "@/lib/core/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verify user session
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first.",
        },
        { status: 401 }
      );
    }

    // 2. Verify Admin role
    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Admin only.",
        },
        { status: 403 }
      );
    }

    // 3. Get appointment ID
    const { id } = await params;

    // 4. Get requested status
    const { status } = await request.json();

    if (!["Confirmed", "Cancelled"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid appointment status.",
        },
        { status: 400 }
      );
    }

    // 5. Backend configuration
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const secret = process.env.INTERNAL_API_SECRET;

    if (!secret) {
      throw new Error("INTERNAL_API_SECRET is missing.");
    }

    // 6. Update appointment status in Backend
    const response = await fetch(
      `${backendUrl}/admin/appointments/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-internal-api-secret": secret,
        },
        body: JSON.stringify({ status }),
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to update appointment.",
        },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("Admin Update Appointment API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
