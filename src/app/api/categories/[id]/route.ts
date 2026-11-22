import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/backend/config/db";
import Category from "@/backend/models/Category";
import Product from "@/backend/models/Product";
import { isAdmin } from "@/backend/middleware/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// PUT: Update category
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
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

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category ID.",
        },
        { status: 400 }
      );
    }

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

    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const duplicateCategory = await Category.findOne({
      _id: { $ne: id },
      name: { $regex: `^${escapedName}$`, $options: "i" },
    });

    if (duplicateCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Another category with this name already exists.",
        },
        { status: 409 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
        description,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category updated successfully.",
      data: updatedCategory,
    });
  } catch (error: any) {
    console.error("PUT category error:", error);

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
        message: "Failed to update category.",
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete category
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
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

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category ID.",
        },
        { status: 400 }
      );
    }

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found.",
        },
        { status: 404 }
      );
    }

    // Do not delete a category that is being used by products
    const linkedProducts = await Product.countDocuments({
      category: category._id,
    });

    if (linkedProducts > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `This category is assigned to ${linkedProducts} product(s). Deactivate it instead of deleting it.`,
        },
        { status: 409 }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE category error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete category.",
      },
      { status: 500 }
    );
  }
}
