import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import Order from "@/backend/models/Order";
import Product from "@/backend/models/Product";
import { getCurrentUser } from "@/backend/middleware/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    await connectDB();

    const orders = await Order.find({
      customer: user._id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    const {
      productId,
      quantity,
      shippingAddress,
      paymentMethod,
      notes,
      countryCode,
    } = body;

    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid product or quantity" },
        { status: 400 }
      );
    }

    const requiredFields = [
      "fullName",
      "phone",
      "address",
      "city",
      "country",
    ];

    if (
      !shippingAddress ||
      requiredFields.some((field) => !shippingAddress[field]?.trim())
    ) {
      return NextResponse.json(
        { success: false, message: "Please complete your shipping address" },
        { status: 400 }
      );
    }

    const allowedCountries = ["PK", "FR", "US", "IT", "ES", "OM", "SA"];

    if (!allowedCountries.includes(countryCode)) {
      return NextResponse.json(
        { success: false, message: "Invalid country selection" },
        { status: 400 }
      );
    }

    if (
      !["cash_on_delivery", "card", "bank_transfer"].includes(paymentMethod)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid payment method" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);

    if (!product || product.status !== "Active") {
      return NextResponse.json(
        { success: false, message: "Product is not available" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, message: "Not enough stock available" },
        { status: 400 }
      );
    }

   const price =
  product.prices?.[
    countryCode as "PK" | "FR" | "US" | "IT" | "ES" | "OM" | "SA"
  ];

    if (typeof price !== "number" || price <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: `This product is not available in ${countryCode}`,
        },
        { status: 400 }
      );
    }

    const subtotal = price * quantity;
    const shippingFee = 0;
    const tax = 0;
    const totalAmount = subtotal + shippingFee + tax;

    const orderNumber = `HS-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const order = await Order.create({
      orderNumber,
      customer: user._id,
      customerName: user.name,
      customerEmail: user.email,
      items: [
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price,
          quantity,
        },
      ],
      shippingAddress,
      subtotal,
      shippingFee,
      tax,
      totalAmount,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
      notes,
    });

    product.stock -= quantity;
    await product.save();

    return NextResponse.json(
      {
        success: true,
        message: "Your order has been placed successfully",
        data: order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Unable to place your order" },
      { status: 500 }
    );
  }
}