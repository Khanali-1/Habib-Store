
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/backend/config/db";
import Product from "@/backend/models/Product";
import Category from "@/backend/models/Category";
import { isAdmin } from "@/backend/middleware/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type CountryCode = "PK" | "FR" | "US" | "IT" | "ES" | "OM" | "SA";

type CountryPrices = Partial<Record<CountryCode, number>>;

const ALLOWED_COUNTRIES: CountryCode[] = [
  "PK",
  "FR",
  "US",
  "IT",
  "ES",
  "OM",
  "SA",
];

const MAX_IMAGE_LENGTH = 2 * 1024 * 1024;

// UPDATE PRODUCT
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Admin authentication
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await context.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const updateData: {
      name?: string;
      description?: string;
      image?: string;
      category?: mongoose.Types.ObjectId;
      price?: number;
      prices?: CountryPrices;
      stock?: number;
      status?: "Active" | "Inactive";
    } = {};

    // Update name
    if (body.name !== undefined) {
      if (
        typeof body.name !== "string" ||
        !body.name.trim()
      ) {
        return NextResponse.json(
          { success: false, message: "Product name is required" },
          { status: 400 }
        );
      }

      updateData.name = body.name.trim();
    }

    // Update description
    if (body.description !== undefined) {
      if (typeof body.description !== "string") {
        return NextResponse.json(
          { success: false, message: "Invalid description" },
          { status: 400 }
        );
      }

      updateData.description = body.description.trim();
    }

    // Update image
    if (body.image !== undefined) {
      if (
        typeof body.image !== "string" ||
        (
          body.image !== "" &&
          (
            !/^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(body.image) ||
            body.image.length > MAX_IMAGE_LENGTH
          )
        )
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid image or image is too large" },
          { status: 400 }
        );
      }

      updateData.image = body.image;
    }

    // Update category
    if (body.category !== undefined) {
      if (
        typeof body.category !== "string" ||
        !body.category.trim()
      ) {
        return NextResponse.json(
          { success: false, message: "Please select a category" },
          { status: 400 }
        );
      }

      const category = await Category.findOne({
        name: body.category.trim(),
        status: "Active",
      });

      if (!category) {
        return NextResponse.json(
          { success: false, message: "Invalid active category" },
          { status: 400 }
        );
      }

      updateData.category =
        category._id as mongoose.Types.ObjectId;
    }

    // Update country-wise prices
    if (body.prices !== undefined) {
      if (
        typeof body.prices !== "object" ||
        body.prices === null ||
        Array.isArray(body.prices)
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid country prices" },
          { status: 400 }
        );
      }

      const countryPrices: CountryPrices = {};

      for (const [country, value] of Object.entries(body.prices)) {
        if (!ALLOWED_COUNTRIES.includes(country as CountryCode)) {
          return NextResponse.json(
            { success: false, message: `Unsupported country: ${country}` },
            { status: 400 }
          );
        }

        // Empty input means no price for that country
        if (value === "" || value === null || value === undefined) {
          continue;
        }

        const numericPrice = Number(value);

        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
          return NextResponse.json(
            { success: false, message: `Invalid price for ${country}` },
            { status: 400 }
          );
        }

        countryPrices[country as CountryCode] = numericPrice;
      }

      if (countryPrices.PK === undefined) {
        return NextResponse.json(
          { success: false, message: "Pakistan price is required" },
          { status: 400 }
        );
      }

      updateData.prices = countryPrices;
      updateData.price = countryPrices.PK;
    }

    // Backward compatibility with the old single-price form
    else if (body.price !== undefined) {
      if (
        body.price === "" ||
        !Number.isFinite(Number(body.price)) ||
        Number(body.price) < 0
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid price" },
          { status: 400 }
        );
      }

      const pakistanPrice = Number(body.price);

      updateData.price = pakistanPrice;

      const existingPrices =
        (existingProduct.prices as CountryPrices | undefined) || {};

      updateData.prices = {
        ...existingPrices,
        PK: pakistanPrice,
      };
    }

    // Update stock
    if (body.stock !== undefined) {
      const stock = body.stock === "" ? 0 : Number(body.stock);

      if (!Number.isInteger(stock) || stock < 0) {
        return NextResponse.json(
          { success: false, message: "Stock must be a valid whole number" },
          { status: 400 }
        );
      }

      updateData.stock = stock;
    }

    // Update status
    if (body.status !== undefined) {
      if (!["Active", "Inactive"].includes(body.status)) {
        return NextResponse.json(
          { success: false, message: "Invalid product status" },
          { status: 400 }
        );
      }

      updateData.status = body.status;
    }

    // Save updated product
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name");

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });

  } catch (error) {
    console.error("Product update error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE PRODUCT
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Admin authentication
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await context.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Delete product
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error("Product delete error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
