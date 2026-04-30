import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Room from "@/lib/models/Room";
import FoodItem from "@/lib/models/FoodItem";
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
      { roomNumber: "101", type: "single", price: 1500, floor: 1, amenities: ["WiFi", "TV", "Fan"], description: "Cozy single room", imageUrl: "https://images.unsplash.com/photo-1598928506311-c95148c8ab1a?q=80&w=800&auto=format&fit=crop" },
      { roomNumber: "102", type: "single", price: 1500, floor: 1, amenities: ["WiFi", "TV", "Fan"], description: "Comfortable single room", imageUrl: "https://images.unsplash.com/photo-1598928506311-c95148c8ab1a?q=80&w=800&auto=format&fit=crop" },
      { roomNumber: "103", type: "double", price: 2500, floor: 1, amenities: ["WiFi", "TV", "AC", "Hot Water"], description: "Spacious double room", imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop" },
      { roomNumber: "201", type: "double", price: 2500, floor: 2, amenities: ["WiFi", "TV", "AC", "Hot Water"], description: "Double room with garden view", imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop" },
      { roomNumber: "202", type: "double", price: 2800, floor: 2, amenities: ["WiFi", "TV", "AC", "Hot Water", "Balcony"], description: "Double room with balcony", imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800&auto=format&fit=crop" },
      { roomNumber: "203", type: "deluxe", price: 4000, floor: 2, amenities: ["WiFi", "TV", "AC", "Hot Water", "Mini Bar", "Balcony"], description: "Deluxe room with premium amenities", imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop" },
      { roomNumber: "301", type: "deluxe", price: 4500, floor: 3, amenities: ["WiFi", "TV", "AC", "Hot Water", "Mini Bar", "Balcony", "Mountain View"], description: "Deluxe room with mountain view", imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop" },
      { roomNumber: "302", type: "suite", price: 6000, floor: 3, amenities: ["WiFi", "TV", "AC", "Hot Water", "Mini Bar", "Balcony", "Living Area", "Mountain View"], description: "Luxury suite", imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop" },
      { roomNumber: "303", type: "suite", price: 7000, floor: 3, amenities: ["WiFi", "TV", "AC", "Hot Water", "Mini Bar", "Jacuzzi", "Living Area", "Mountain View"], description: "Premium suite with jacuzzi", imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop" },
      { roomNumber: "304", type: "single", price: 1800, floor: 3, amenities: ["WiFi", "TV", "AC"], description: "Single room on top floor", imageUrl: "https://images.unsplash.com/photo-1598928506311-c95148c8ab1a?q=80&w=800&auto=format&fit=crop" },
    ];
    await Room.create(rooms);

    const foodItems = [
      { name: "Dal Bhat Set", price: 250, category: "Food", imageUrl: "https://images.unsplash.com/photo-1542345812-d98b8cd6e864?q=80&w=600&auto=format&fit=crop" },
      { name: "Momo (Steam)", price: 180, category: "Snacks", imageUrl: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?q=80&w=600&auto=format&fit=crop" },
      { name: "Momo (Fried)", price: 200, category: "Snacks", imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004eb?q=80&w=600&auto=format&fit=crop" },
      { name: "Chowmein", price: 150, category: "Snacks", imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop" },
      { name: "Fried Rice", price: 180, category: "Food", imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600&auto=format&fit=crop" },
      { name: "Tea", price: 30, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop" },
      { name: "Coffee", price: 60, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop" },
      { name: "Water Bottle", price: 30, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=600&auto=format&fit=crop" },
      { name: "Soft Drink", price: 80, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop" },
      { name: "Chicken Curry", price: 350, category: "Food", imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&auto=format&fit=crop" },
      { name: "Egg Curry", price: 150, category: "Food", imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=600&auto=format&fit=crop" },
      { name: "Roti", price: 30, category: "Other", imageUrl: "https://images.unsplash.com/photo-1565557612128-498b3c94dce9?q=80&w=600&auto=format&fit=crop" },
    ];
    await FoodItem.create(foodItems);

    return Response.json({ message: "Database seeded successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json({ error: "Seed failed" }, { status: 500 });
  }
}
