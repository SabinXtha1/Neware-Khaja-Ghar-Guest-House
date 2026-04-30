import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Room from "@/lib/models/Room";
import { getSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const room = await Room.findById(id);
    if (!room) return Response.json({ error: "Room not found" }, { status: 404 });
    return Response.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
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
    const room = await Room.findByIdAndUpdate(id, body, { new: true });
    if (!room) return Response.json({ error: "Room not found" }, { status: 404 });
    return Response.json(room);
  } catch (error) {
    console.error("Error updating room:", error);
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
    const room = await Room.findByIdAndDelete(id);
    if (!room) return Response.json({ error: "Room not found" }, { status: 404 });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting room:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
