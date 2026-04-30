import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import Room from "@/lib/models/Room";
import { getSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const booking = await Booking.findById(id)
      .populate("customer", "name email phone")
      .populate("room", "roomNumber type price");
    if (!booking) return Response.json({ error: "Booking not found" }, { status: 404 });
    return Response.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const booking = await Booking.findById(id);
    if (!booking) return Response.json({ error: "Booking not found" }, { status: 404 });

    // If status changed to checked-out or cancelled, free the room
    if (body.status && (body.status === "checked-out" || body.status === "cancelled")) {
      await Room.findByIdAndUpdate(booking.room, { status: "available" });
    }

    const updated = await Booking.findByIdAndUpdate(id, body, { new: true })
      .populate("customer", "name email phone")
      .populate("room", "roomNumber type price");

    return Response.json(updated);
  } catch (error) {
    console.error("Error updating booking:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const booking = await Booking.findById(id);
    if (!booking) return Response.json({ error: "Booking not found" }, { status: 404 });

    // Free the room
    await Room.findByIdAndUpdate(booking.room, { status: "available" });
    await Booking.findByIdAndDelete(id);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
