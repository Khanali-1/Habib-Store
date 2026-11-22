import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import connectDB from "@/backend/config/db";
import User from "@/backend/models/User";
import Product from "@/backend/models/Product";
import Wishlist from "@/backend/models/Wishlist";

interface TokenPayload {
  userId: string;
}

async function getLoggedInUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token || !process.env.JWT_SECRET) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as TokenPayload;

    if (!decoded.userId) return null;

    await connectDB();

    const user = await User.findById(decoded.userId).select(
      "_id isBlocked"
    );

    if (!user || user.isBlocked) return null;

    return user;
  } catch {
    return null;
  }
}

// GET: Load user's wishlist
export async function GET() {
  try {
    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    const wishlist = await Wishlist.findOne({
      user: user._id,
    }).populate({
      path: "products",
      select: "name image description price stock status category",
      populate: {
        path: "category",
        select: "name",
      },
    });

    return NextResponse.json({
      success: true,
      data: wishlist?.products || [],
    });
  } catch (error) {
    console.error("Wishlist GET error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to load wishlist" },
      { status: 500 }
    );
  }
}

// POST: Add product to wishlist
export async function POST(request: NextRequest) {
  try {
    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await Product.findOne({
      _id: productId,
      status: "Active",
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: user._id },
      {
        $addToSet: {
          products: product._id,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Product added to wishlist",
      data: wishlist,
    });
  } catch (error) {
    console.error("Wishlist POST error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to add product" },
      { status: 500 }
    );
  }
}

// DELETE: Remove product from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    await Wishlist.findOneAndUpdate(
      { user: user._id },
      {
        $pull: {
          products: productId,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("Wishlist DELETE error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to remove product" },
      { status: 500 }
    );
  }
}