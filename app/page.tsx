import Link from "next/link";
import { Hotel, ArrowRight, BedDouble, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import connectDB from "@/lib/db";
import Room from "@/lib/models/Room";
import FoodItem from "@/lib/models/FoodItem";
import { HeroSection } from "@/components/landing/hero-section";
import { AnimatedSection } from "@/components/landing/animated-section";
import { RoomCard, FoodCard } from "@/components/landing/feature-card";
import { WhyChooseUs } from "@/components/landing/why-choose-us";

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

      <HeroSection />

      {/* Featured Rooms */}
      {rooms.length > 0 && (
        <AnimatedSection className="py-24 px-6 relative">
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
              {rooms.map((room: any, index: number) => (
                <RoomCard key={room._id.toString()} room={JSON.parse(JSON.stringify(room))} index={index} />
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Featured Food */}
      {foodItems.length > 0 && (
        <AnimatedSection className="py-24 px-6 bg-muted/20 border-y border-border/50">
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
              {foodItems.map((item: any, index: number) => (
                <FoodCard key={item._id.toString()} item={JSON.parse(JSON.stringify(item))} index={index} />
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      <WhyChooseUs />
    </div>
  );
}
