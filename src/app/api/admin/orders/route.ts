import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/backend/config/db";
import Order from "@/backend/models/Order";
import { isAdmin } from "@/backend/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    // 1. Admin authentication
    if (!(await isAdmin())) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
        },
        { status: 401 }
      );
    }

    // 2. Database connection
    await connectDB();

    // 3. Query parameters
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = Math.max(
      1,
      Number(searchParams.get("page")) || 1
    );
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 10)
    );

    // 4. Build filter
    const filter: Record<string, unknown> = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search.trim()) {
      const searchRegex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      filter.$or = [
        { orderNumber: searchRegex },
        { status: searchRegex },
      ];
    }

    // 5. Fetch orders
    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Order.countDocuments(filter),
    ]);

    // 6. Response
    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        limit,
      },
    });
  } catch (error) {
    console.error("Fetch Orders Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}
