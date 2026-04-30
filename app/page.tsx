import Link from "next/link";
import { Hotel, ArrowRight, Star, UtensilsCrossed, BedDouble, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import connectDB from "@/lib/db";
import Room from "@/lib/models/Room";
import FoodItem from "@/lib/models/FoodItem";

export const dynamic = "force-dynamic";

export default async function Home() {
  await connectDB();
  
  const rooms = await Room.find({ status: "available" }).limit(3).lean();
  const foodItems = await FoodItem.find({ isAvailable: true }).limit(6).lean();

  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 bg-background/60 backdrop-blur-md border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Hotel className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Neware Khaja Ghar</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="font-semibold">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="gradient-primary text-white border-0 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                Book a Stay
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-6">
        <div className="absolute inset-0 -z-10">
          <img 
            src="https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?auto=format&fit=crop&q=80" 
            alt="Luxury Hotel" 
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold backdrop-blur-sm">
            <Star className="h-4 w-4 fill-primary" /> Premium Guest House & Restaurant
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Experience the True Taste of <br/>
            <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
              Authentic Hospitality
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover a perfect blend of comfort and culinary excellence. Book our luxurious rooms and indulge in our exquisite restaurant menu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/register">
              <Button size="lg" className="group gradient-primary text-white border-0 h-14 px-8 text-lg rounded-xl shadow-xl shadow-primary/20 hover:scale-105 hover:shadow-primary/40 transition-all duration-300">
                Explore Rooms <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl border-2 hover:bg-muted/50 transition-all duration-300 hover:scale-105">
                View Restaurant Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      {rooms.length > 0 && (
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
                  <BedDouble className="h-8 w-8 text-primary" /> Our Featured Rooms
                </h2>
                <p className="text-muted-foreground text-lg">Handpicked accommodations for your perfect stay.</p>
              </div>
              <Link href="/register">
                <Button variant="ghost" className="group font-semibold text-primary hover:text-primary/80 transition-colors">
                  View All Rooms <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room: any) => (
                <div key={room._id} className="group rounded-3xl overflow-hidden border border-border/50 bg-card shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                  <div className="h-64 w-full relative overflow-hidden bg-muted">
                    {room.imageUrl ? (
                      <img src={room.imageUrl} alt={`Room ${room.roomNumber}`} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <BedDouble className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50">
                      <span className="text-sm font-bold capitalize text-primary">{room.type}</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-bold">Room {room.roomNumber}</h3>
                      <p className="text-xl font-bold text-primary">Rs. {room.price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/night</span></p>
                    </div>
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.slice(0, 3).map((a: string, i: number) => (
                          <span key={i} className="text-xs bg-muted/50 border border-border/50 px-2.5 py-1 rounded-md text-muted-foreground flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> {a}
                          </span>
                        ))}
                        {room.amenities.length > 3 && <span className="text-xs text-muted-foreground pl-1">+{room.amenities.length - 3} more</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Food */}
      {foodItems.length > 0 && (
        <section className="py-24 px-6 bg-muted/20 border-y border-border/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
                  <UtensilsCrossed className="h-8 w-8 text-amber-500" /> Culinary Delights
                </h2>
                <p className="text-muted-foreground text-lg">Savor our chef's special creations and authentic flavors.</p>
              </div>
              <Link href="/register">
                <Button variant="ghost" className="group font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-500 transition-colors">
                  View Full Menu <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodItems.map((item: any) => (
                <div key={item._id} className="group flex gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:bg-muted/30 transition-colors">
                  <div className="h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-muted">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UtensilsCrossed className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-lg leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{item.name}</h3>
                      <span className="font-bold text-primary whitespace-nowrap">Rs. {item.price}</span>
                    </div>
                    <span className="text-sm text-muted-foreground mt-1">{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Stay With Us?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We provide everything you need for an unforgettable stay in the heart of the city.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="group space-y-3 p-8 rounded-3xl bg-primary/5 border border-primary/10 hover:-translate-y-3 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 cursor-default">
              <div className="h-14 w-14 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold">Prime Location</h3>
              <p className="text-muted-foreground leading-relaxed">Easily accessible from all major landmarks and transit points.</p>
            </div>
            <div className="group space-y-3 p-8 rounded-3xl bg-amber-500/5 border border-amber-500/10 hover:-translate-y-3 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-500 cursor-default">
              <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <UtensilsCrossed className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold">In-house Restaurant</h3>
              <p className="text-muted-foreground leading-relaxed">Authentic flavors and 24/7 room service delivered to your door.</p>
            </div>
            <div className="group space-y-3 p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 hover:-translate-y-3 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 cursor-default">
              <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Hotel className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold">Premium Comfort</h3>
              <p className="text-muted-foreground leading-relaxed">Spacious rooms equipped with modern amenities and fast WiFi.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
