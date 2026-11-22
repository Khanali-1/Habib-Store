import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/backend/config/db";
import Settings from "@/backend/models/Settings";
import { isAdmin } from "@/backend/middleware/auth";



// GET SETTINGS
export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    await connectDB();

    let settings = await Settings.findOne({ key: "main" });

    if (!settings) {
      settings = await Settings.create({ key: "main" });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get Settings Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load settings" },
      { status: 500 }
    );
  }
}

// UPDATE SETTINGS
export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    const allowedFields: Record<string, string[]> = {
      profile: ["name", "email", "phone"],
      store: [
        "name",
        "email",
        "phone",
        "address",
        "currency",
        "tax",
      ],
      notifications: [
        "newOrders",
        "orderUpdates",
        "lowStock",
        "newCustomers",
        "marketing",
      ],
      preferences: ["language", "timezone", "dateFormat"],
    };

    const updateData: Record<string, unknown> = {};

    for (const [section, fields] of Object.entries(allowedFields)) {
      const values = body[section];

      if (
        !values ||
        typeof values !== "object" ||
        Array.isArray(values)
      ) {
        continue;
      }

      for (const field of fields) {
        const value = values[field];

        if (
          typeof value === "string" ||
          typeof value === "boolean" ||
          typeof value === "number"
        ) {
          updateData[`${section}.${field}`] = value;
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid settings provided" },
        { status: 400 }
      );
    }

    if (
      updateData["store.tax"] !== undefined &&
      (
        typeof updateData["store.tax"] !== "number" ||
        updateData["store.tax"] < 0 ||
        updateData["store.tax"] > 100
      )
    ) {
      return NextResponse.json(
        { success: false, message: "Tax must be between 0 and 100" },
        { status: 400 }
      );
    }

    const settings = await Settings.findOneAndUpdate(
      { key: "main" },
      { $set: updateData },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Update Settings Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update settings" },
      { status: 500 }
    );
  }
}
