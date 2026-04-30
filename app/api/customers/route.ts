import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const customers = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });

    return Response.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
