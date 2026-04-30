import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Bill from "@/lib/models/Bill";
import Order from "@/lib/models/Order";
import Booking from "@/lib/models/Booking";
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

    const bills = await Bill.find(filter)
      .populate("customer", "name email phone")
      .populate("booking", "checkIn checkOut")
      .populate("orders")
      .sort({ createdAt: -1 });

    return Response.json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
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
    const { customer, bookingId, discount = 0, taxRate = 13 } = body;

    let roomCharges = 0;
    let orderCharges = 0;
    const orderIds: string[] = [];

    // Calculate room charges from booking
    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (booking) {
        roomCharges = booking.totalAmount;
      }
    }

    // Calculate order charges
    const orders = await Order.find({
      customer,
      status: { $ne: "cancelled" },
      ...(bookingId ? { booking: bookingId } : {}),
    });

    orders.forEach((order) => {
      orderCharges += order.totalAmount;
      orderIds.push(order._id.toString());
    });

    const subtotal = roomCharges + orderCharges;
    const tax = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + tax - discount;

    const bill = await Bill.create({
      customer,
      booking: bookingId || undefined,
      orders: orderIds,
      roomCharges,
      orderCharges,
      tax,
      discount,
      totalAmount,
    });

    const populated = await Bill.findById(bill._id)
      .populate("customer", "name email phone")
      .populate("booking", "checkIn checkOut")
      .populate("orders");

    return Response.json(populated, { status: 201 });
  } catch (error) {
    console.error("Error creating bill:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
