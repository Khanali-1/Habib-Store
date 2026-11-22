import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import Order from "@/backend/models/Order";
import { getCurrentUser } from "@/backend/middleware/auth";


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;

    const order = await Order.findOne({
      _id: id,
      customer: user._id,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("GET SINGLE ORDER ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch order" },
      { status: 500 }
    );
  }
}