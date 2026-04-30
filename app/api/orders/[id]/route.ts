import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import { getSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const order = await Order.findById(id)
      .populate("customer", "name email phone")
      .populate("room", "roomNumber")
      .populate("booking", "checkIn checkOut");
    if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
    return Response.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const order = await Order.findByIdAndUpdate(id, body, { new: true })
      .populate("customer", "name email")
      .populate("room", "roomNumber");
    if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
    return Response.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
