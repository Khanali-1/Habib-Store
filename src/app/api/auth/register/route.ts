import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/backend/config/db";
import User from "@/backend/models/User";

import {
  successResponse,
  errorResponse,
} from "@/backend/lib/api/api";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return errorResponse("All fields are required", 400);
    }

    if (password.length < 6) {
      return errorResponse("Password must be at least 6 characters", 400);
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return errorResponse("Email already registered", 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    return successResponse(
      "Registration successful",
      {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      201
    );

  } catch (error) {
    console.error("Register API Error:", error);

    return errorResponse("Something went wrong during registration", 500);
  }
}