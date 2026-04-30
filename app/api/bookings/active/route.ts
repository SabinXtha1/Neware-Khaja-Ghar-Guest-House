import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "customer") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Find any active checked-in booking for this customer
    const activeBooking = await Booking.findOne({
      customer: session.userId,
      status: "checked-in"
    }).populate("room", "roomNumber type");

    if (!activeBooking) {
      return Response.json({ active: false });
    }

    return Response.json({ 
      active: true, 
      bookingId: activeBooking._id,
      room: activeBooking.room 
    });
  } catch (error) {
    console.error("Error fetching active booking:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
