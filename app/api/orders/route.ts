import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const customerId = searchParams.get("customerId");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (session.role === "customer") {
      filter.customer = session.userId;
    } else if (customerId) {
      filter.customer = customerId;
    }

    const orders = await Order.find(filter)
      .populate("customer", "name email")
      .populate("room", "roomNumber")
      .populate("booking", "checkIn checkOut")
      .sort({ createdAt: -1 });

    return Response.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await request.json();

    if (session.role === "customer") {
      // Find active booking for customer
      const Booking = (await import("@/lib/models/Booking")).default;
      const activeBooking = await Booking.findOne({
        customer: session.userId,
        status: "checked-in"
      });

      if (!activeBooking) {
        return Response.json({ error: "You must be checked into a room to order room service" }, { status: 403 });
      }

      body.customer = session.userId;
      body.booking = activeBooking._id;
      body.room = activeBooking.room;
    }

    // Calculate total
    const totalAmount = body.items.reduce(
      (sum: number, item: { quantity: number; price: number }) => sum + item.quantity * item.price,
      0
    );
    body.totalAmount = totalAmount;

    const order = await Order.create(body);
    const populated = await Order.findById(order._id)
      .populate("customer", "name email")
      .populate("room", "roomNumber");

    return Response.json(populated, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
