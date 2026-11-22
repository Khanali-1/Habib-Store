import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import connectDB from "@/backend/config/db";
import User from "@/backend/models/User";

import {
  successResponse,
  errorResponse,
} from "@/backend/lib/api/api";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return errorResponse("Email and password are required", 400);
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return errorResponse("Invalid email or password", 401);
    }

    // Blocked account check
    if (user.isBlocked) {
      return errorResponse(
        "Your account has been blocked. Please contact support.",
        403
      );
    }

    if (!["admin", "customer"].includes(user.role)) {
      return errorResponse("Invalid user role", 403);
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is missing");
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      secret,
      {
        expiresIn: "7d",
      }
    );

    const response = successResponse(
      "Login successful",
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      200
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error) {
    console.error("Login API Error:", error);

    return errorResponse("Something went wrong during login", 500);
  }
}
