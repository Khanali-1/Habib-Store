
import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/backend/config/db";
import User from "@/backend/models/User";
import { isAdmin } from "@/backend/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    if (!(await isAdmin())) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "all";

    // Customer filter
    const filter: Record<string, unknown> = {
      role: "customer",
    };

    // Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Active / Blocked filter
    if (status === "active") {
      filter.isBlocked = false;
    } else if (status === "blocked") {
      filter.isBlocked = true;
    }

    // Fetch customers without passwords
    const customers = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // Customer statistics
    const [total, active, blocked] = await Promise.all([
      User.countDocuments({ role: "customer" }),

      User.countDocuments({
        role: "customer",
        isBlocked: false,
      }),

      User.countDocuments({
        role: "customer",
        isBlocked: true,
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Customers fetched successfully",
      stats: {
        total,
        active,
        blocked,
      },
      data: customers,
    });

  } catch (error) {
    console.error("Get Customers API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch customers",
      },
      { status: 500 }
    );
  }
}
