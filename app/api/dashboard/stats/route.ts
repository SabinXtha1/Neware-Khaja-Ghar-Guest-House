import connectDB from "@/lib/db";
import Room from "@/lib/models/Room";
import Booking from "@/lib/models/Booking";
import Order from "@/lib/models/Order";
import Bill from "@/lib/models/Bill";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: "available" });
    const occupiedRooms = await Room.countDocuments({ status: "occupied" });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: { $in: ["confirmed", "checked-in"] } });
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const bills = await Bill.find({ status: "paid" });
    const totalRevenue = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const unpaidBills = await Bill.countDocuments({ status: "unpaid" });
    const recentBookings = await Booking.find()
      .populate("customer", "name email")
      .populate("room", "roomNumber type")
      .sort({ createdAt: -1 }).limit(5);
    const recentOrders = await Order.find()
      .populate("customer", "name")
      .populate("room", "roomNumber")
      .sort({ createdAt: -1 }).limit(5);
    return Response.json({
      totalRooms, availableRooms, occupiedRooms, totalBookings, activeBookings,
      totalCustomers, pendingOrders, totalRevenue, unpaidBills,
      occupancyRate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
      recentBookings, recentOrders,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
