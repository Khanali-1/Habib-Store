import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import Product from "@/backend/models/Product";
import Category from "@/backend/models/Category";
import { isAdmin } from "@/backend/middleware/auth";

const MAX_IMAGE_LENGTH = 2 * 1024 * 1024;

const ALLOWED_COUNTRIES = ["PK", "FR", "US", "IT", "ES", "OM", "SA"];

// GET ALL PRODUCTS
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Fetch products error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// CREATE PRODUCT
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();

    const {
      name,
      description = "",
      image = "",
      category,
      price,
      prices,
      stock = 0,
      status = "Active",
    } = body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !category.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide product name and category",
        },
        { status: 400 }
      );
    }

    // Prepare country-wise prices
    const countryPrices: Record<string, number> = {};

    // Validate prices object
    if (
      prices !== undefined &&
      (typeof prices !== "object" ||
        prices === null ||
        Array.isArray(prices))
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid country prices" },
        { status: 400 }
      );
    }

    // Read country-wise prices
    if (prices) {
      for (const [country, value] of Object.entries(prices)) {
        if (!ALLOWED_COUNTRIES.includes(country)) {
          return NextResponse.json(
            {
              success: false,
              message: `Unsupported country code: ${country}`,
            },
            { status: 400 }
          );
        }

        // Empty country price means not configured
        if (value === "" || value === null || value === undefined) {
          continue;
        }

        const numericPrice = Number(value);

        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
          return NextResponse.json(
            {
              success: false,
              message: `Invalid price for country ${country}`,
            },
            { status: 400 }
          );
        }

        countryPrices[country] = numericPrice;
      }
    }

    // Backward compatibility with the old Add Product form
    if (
      countryPrices.PK === undefined &&
      price !== undefined &&
      price !== ""
    ) {
      const pakistanPrice = Number(price);

      if (!Number.isFinite(pakistanPrice) || pakistanPrice < 0) {
        return NextResponse.json(
          { success: false, message: "Invalid Pakistan price" },
          { status: 400 }
        );
      }

      countryPrices.PK = pakistanPrice;
    }

    // Pakistan price is required for every product
    if (countryPrices.PK === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide the Pakistan product price",
        },
        { status: 400 }
      );
    }

    // Validate stock
    const stockValue = stock === "" ? 0 : Number(stock);

    if (!Number.isInteger(stockValue) || stockValue < 0) {
      return NextResponse.json(
        { success: false, message: "Invalid stock quantity" },
        { status: 400 }
      );
    }

    // Validate description
    if (typeof description !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid description" },
        { status: 400 }
      );
    }

    // Validate image
    if (
      typeof image !== "string" ||
      (image !== "" &&
        (!/^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(image) ||
          image.length > MAX_IMAGE_LENGTH))
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid image or image is too large" },
        { status: 400 }
      );
    }

    // Validate status
    if (!["Active", "Inactive"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid product status" },
        { status: 400 }
      );
    }

    // Find active category
    const categoryDoc = await Category.findOne({
      name: category.trim(),
      status: "Active",
    });

    if (!categoryDoc) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a valid active category",
        },
        { status: 400 }
      );
    }

    // Create product
    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      image,
      category: categoryDoc._id,

      // Keep old price field compatible with existing pages
      price: countryPrices.PK,

      // Save country-wise prices
      prices: countryPrices,

      stock: stockValue,
      status,
    });

    const savedProduct = await Product.findById(product._id)
      .populate("category", "name");

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: savedProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}
