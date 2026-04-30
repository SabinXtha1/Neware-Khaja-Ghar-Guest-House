import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Room from "@/lib/models/Room";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const filter: Record<string, string> = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const rooms = await Room.find(filter).sort({ roomNumber: 1 });
    return Response.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
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
    const room = await Room.create(body);
    return Response.json(room, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
