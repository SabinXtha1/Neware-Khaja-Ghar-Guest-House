import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import Room from "@/lib/models/Room";
import Bill from "@/lib/models/Bill";
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

    // Handle Early Checkout Billing Logic
    if (body.status === "checked-out" && booking.status !== "checked-out") {
      const checkIn = new Date(booking.checkIn);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkInDate = new Date(checkIn);
      checkInDate.setHours(0, 0, 0, 0);
      
      let actualNights = Math.ceil((today.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      if (actualNights < 1) actualNights = 1;
      
      const bookedNights = Math.ceil((new Date(booking.checkOut).getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (actualNights < bookedNights) {
        const room = await Room.findById(booking.room);
        const newTotal = actualNights * room.price;
        
        body.totalAmount = newTotal;
        body.checkOut = today;

        // Update any associated bills
        const bill = await Bill.findOne({ booking: booking._id });
        if (bill) {
            const diff = booking.totalAmount - newTotal;
            bill.roomCharges = newTotal;
            bill.totalAmount = bill.totalAmount - diff;
            await bill.save();
        }
      }
    } else if (body.checkIn || body.checkOut || body.room) {
      // Handle Admin Edit Recalculation
      const newCheckIn = body.checkIn ? new Date(body.checkIn) : booking.checkIn;
      const newCheckOut = body.checkOut ? new Date(body.checkOut) : booking.checkOut;
      const roomId = body.room || booking.room;
      
      const nights = Math.ceil((newCheckOut.getTime() - newCheckIn.getTime()) / (1000 * 60 * 60 * 24));
      if (nights >= 1) {
        const room = await Room.findById(roomId);
        if (room) {
          body.totalAmount = nights * room.price;
        }
      }
    }

    // Room status management based on booking status
    if (body.status && (body.status === "checked-out" || body.status === "cancelled")) {
      await Room.findByIdAndUpdate(body.room || booking.room, { status: "available" });
    } else if (body.status === "checked-in") {
      await Room.findByIdAndUpdate(body.room || booking.room, { status: "occupied" });
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
