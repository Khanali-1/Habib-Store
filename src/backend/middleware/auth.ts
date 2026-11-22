import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/backend/config/db";
import User from "@/backend/models/User";

interface TokenPayload {
  userId: string;
  email?: string;
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return null;
    }

    const decoded = jwt.verify(token, secret) as TokenPayload;

    if (!decoded.userId) {
      return null;
    }

    await connectDB();

    const user = await User.findById(decoded.userId)
      .select("-password");

    if (!user || user.isBlocked) {
      return null;
    }

    return user;

  } catch {
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser();

    return user?.role === "admin";

  } catch {
    return false;
  }
}