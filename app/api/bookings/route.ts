import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import Room from "@/lib/models/Room";
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

    // Customers can only see their own bookings
    if (session.role === "customer") {
      filter.customer = session.userId;
    } else if (customerId) {
      filter.customer = customerId;
    }

    const bookings = await Booking.find(filter)
      .populate("customer", "name email phone")
      .populate("room", "roomNumber type price")
      .sort({ createdAt: -1 });

    return Response.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await request.json();

    // If customer is booking, use their ID
    if (session.role === "customer") {
      body.customer = session.userId;
    }

    // Calculate total amount
    const room = await Room.findById(body.room);
    if (!room) return Response.json({ error: "Room not found" }, { status: 404 });

    if (room.status !== "available") {
      return Response.json({ error: "Room is not available" }, { status: 400 });
    }

    const checkIn = new Date(body.checkIn);
    const checkOut = new Date(body.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    body.totalAmount = nights * room.price;

    const booking = await Booking.create(body);

    // Mark room as occupied
    await Room.findByIdAndUpdate(body.room, { status: "occupied" });

    const populated = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("room", "roomNumber type price");

    return Response.json(populated, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
