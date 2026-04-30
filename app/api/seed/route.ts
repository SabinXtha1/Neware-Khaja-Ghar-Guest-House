import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Room from "@/lib/models/Room";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    await connectDB();

    // Check if already seeded
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return Response.json({ message: "Database already seeded" });
    }

    const hashedPassword = await bcrypt.hash("admin123", 12);
    const customerPassword = await bcrypt.hash("customer123", 12);

    // Create admin
    await User.create({
      name: "Admin", email: "admin@neware.com",
      password: hashedPassword, phone: "9800000000",
      role: "admin", address: "Neware Khaja Ghar",
    });

    // Create sample customers
    await User.create([
      { name: "Ram Sharma", email: "ram@example.com", password: customerPassword, phone: "9801111111", role: "customer", address: "Kathmandu" },
      { name: "Sita Thapa", email: "sita@example.com", password: customerPassword, phone: "9802222222", role: "customer", address: "Pokhara" },
      { name: "Hari Gurung", email: "hari@example.com", password: customerPassword, phone: "9803333333", role: "customer", address: "Chitwan" },
    ]);

    // Create rooms
    const rooms = [
      { roomNumber: "101", type: "single", price: 1500, floor: 1, amenities: ["WiFi", "TV", "Fan"], description: "Cozy single room" },
      { roomNumber: "102", type: "single", price: 1500, floor: 1, amenities: ["WiFi", "TV", "Fan"], description: "Comfortable single room" },
      { roomNumber: "103", type: "double", price: 2500, floor: 1, amenities: ["WiFi", "TV", "AC", "Hot Water"], description: "Spacious double room" },
      { roomNumber: "201", type: "double", price: 2500, floor: 2, amenities: ["WiFi", "TV", "AC", "Hot Water"], description: "Double room with garden view" },
      { roomNumber: "202", type: "double", price: 2800, floor: 2, amenities: ["WiFi", "TV", "AC", "Hot Water", "Balcony"], description: "Double room with balcony" },
      { roomNumber: "203", type: "deluxe", price: 4000, floor: 2, amenities: ["WiFi", "TV", "AC", "Hot Water", "Mini Bar", "Balcony"], description: "Deluxe room with premium amenities" },
      { roomNumber: "301", type: "deluxe", price: 4500, floor: 3, amenities: ["WiFi", "TV", "AC", "Hot Water", "Mini Bar", "Balcony", "Mountain View"], description: "Deluxe room with mountain view" },
      { roomNumber: "302", type: "suite", price: 6000, floor: 3, amenities: ["WiFi", "TV", "AC", "Hot Water", "Mini Bar", "Balcony", "Living Area", "Mountain View"], description: "Luxury suite" },
      { roomNumber: "303", type: "suite", price: 7000, floor: 3, amenities: ["WiFi", "TV", "AC", "Hot Water", "Mini Bar", "Jacuzzi", "Living Area", "Mountain View"], description: "Premium suite with jacuzzi" },
      { roomNumber: "304", type: "single", price: 1800, floor: 3, amenities: ["WiFi", "TV", "AC"], description: "Single room on top floor" },
    ];
    await Room.create(rooms);

    return Response.json({ message: "Database seeded successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json({ error: "Seed failed" }, { status: 500 });
  }
}
