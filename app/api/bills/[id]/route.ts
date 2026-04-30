import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Bill from "@/lib/models/Bill";
import { getSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const bill = await Bill.findById(id)
      .populate("customer", "name email phone address")
      .populate({
        path: "booking",
        populate: { path: "room", select: "roomNumber type price" },
      })
      .populate("orders");
    if (!bill) return Response.json({ error: "Bill not found" }, { status: 404 });
    return Response.json(bill);
  } catch (error) {
    console.error("Error fetching bill:", error);
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

    if (body.status === "paid") {
      body.paidAt = new Date();
    }

    const bill = await Bill.findByIdAndUpdate(id, body, { new: true })
      .populate("customer", "name email phone")
      .populate("booking", "checkIn checkOut")
      .populate("orders");
    if (!bill) return Response.json({ error: "Bill not found" }, { status: 404 });
    return Response.json(bill);
  } catch (error) {
    console.error("Error updating bill:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
