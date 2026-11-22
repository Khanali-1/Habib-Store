import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import Category from "@/backend/models/Category";
import { isAdmin } from "@/backend/middleware/auth";

// GET: Fetch all categories
export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("GET categories error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories.",
      },
      { status: 500 }
    );
  }
}

// POST: Create category
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const status = body.status || "Active";

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required.",
        },
        { status: 400 }
      );
    }

    if (!["Active", "Inactive"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category status.",
        },
        { status: 400 }
      );
    }

    // Prevent duplicate category names (case-insensitive)
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const existingCategory = await Category.findOne({
      name: { $regex: `^${escapedName}$`, $options: "i" },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "This category already exists.",
        },
        { status: 409 }
      );
    }

    const category = await Category.create({
      name,
      description,
      status,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully.",
        data: category,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST category error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "This category already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create category.",
      },
      { status: 500 }
    );
  }
}
