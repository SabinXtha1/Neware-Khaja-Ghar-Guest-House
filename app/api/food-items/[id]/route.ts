import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import FoodItem from "@/lib/models/FoodItem";
import { getSession } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const item = await FoodItem.findByIdAndUpdate(id, body, { new: true });
    if (!item) return Response.json({ error: "Item not found" }, { status: 404 });
    return Response.json(item);
  } catch (error) {
    console.error("Error updating food item:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const item = await FoodItem.findByIdAndDelete(id);
    if (!item) return Response.json({ error: "Item not found" }, { status: 404 });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting food item:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
