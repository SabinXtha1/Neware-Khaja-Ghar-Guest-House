import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import FoodItem from "@/lib/models/FoodItem";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const available = searchParams.get("available");

    const filter: Record<string, boolean> = {};
    if (available === "true") {
      filter.isAvailable = true;
    }

    const items = await FoodItem.find(filter).sort({ category: 1, name: 1 });
    return Response.json(items);
  } catch (error) {
    console.error("Error fetching food items:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const item = await FoodItem.create(body);
    return Response.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating food item:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
