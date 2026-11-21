
import { NextResponse } from "next/server";
import { getSession } from "@/lib/core/server";

export async function GET() {
  try {
    // 1. Verify logged-in user
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please login first." },
        { status: 401 }
      );
    }

    // 2. Verify Admin role
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    // 3. Verify backend configuration
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const secret = process.env.INTERNAL_API_SECRET;

    if (!secret) {
      throw new Error("INTERNAL_API_SECRET is missing.");
    }

    // 4. Fetch transactions from backend
    const response = await fetch(
      `${backendUrl}/admin/transactions`,
      {
        method: "GET",
        headers: {
          "x-internal-api-secret": secret,
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to fetch transactions.",
        },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("Admin Transactions API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
