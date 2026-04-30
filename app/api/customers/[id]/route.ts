import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Booking from "@/lib/models/Booking";
import Order from "@/lib/models/Order";
import Bill from "@/lib/models/Bill";
import { getSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const customer = await User.findById(id).select("-password");
    if (!customer) return Response.json({ error: "Customer not found" }, { status: 404 });

    const bookings = await Booking.find({ customer: id })
      .populate("room", "roomNumber type price")
      .sort({ createdAt: -1 });

    const orders = await Order.find({ customer: id })
      .populate("room", "roomNumber")
      .sort({ createdAt: -1 });

    const bills = await Bill.find({ customer: id })
      .populate("booking", "checkIn checkOut")
      .sort({ createdAt: -1 });

    return Response.json({
      customer,
      bookings,
      orders,
      bills,
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
