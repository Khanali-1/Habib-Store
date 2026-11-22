
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/backend/config/db";
import User from "@/backend/models/User";
import { isAdmin } from "@/backend/middleware/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid customer ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const customer = await User.findOne({
      _id: id,
      role: "customer",
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }

    if (!customer.isBlocked) {
      return NextResponse.json(
        { success: false, message: "Customer is already active" },
        { status: 400 }
      );
    }

    customer.isBlocked = false;
    customer.blockedAt = null;

    await customer.save();

    return NextResponse.json({
      success: true,
      message: "Customer unblocked successfully",
      data: {
        id: customer._id.toString(),
        isBlocked: customer.isBlocked,
        blockedAt: customer.blockedAt,
      },
    });

  } catch (error) {
    console.error("Unblock Customer API Error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
