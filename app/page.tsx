import Link from "next/link";
import { Hotel, CalendarCheck, Receipt, Users, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
              <Hotel className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Neware Khaja Ghar</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gradient-primary text-white border-0 hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Star className="h-4 w-4" /> Premium Guest House Experience
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary to-chart-5 bg-clip-text text-transparent">
              Neware Khaja Ghar
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience comfort and hospitality at its finest. Book rooms, manage orders, and enjoy seamless service with our modern management system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gradient-primary text-white border-0 hover:opacity-90 h-12 px-8 text-base">
                Book Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need</h2>
            <p className="text-muted-foreground text-lg">Complete hotel management at your fingertips</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Hotel, title: "Room Booking", desc: "Browse and book from our range of comfortable rooms" },
              { icon: CalendarCheck, title: "Easy Check-in", desc: "Seamless check-in and check-out process" },
              { icon: Receipt, title: "Bill Management", desc: "Transparent billing with detailed breakdowns" },
              { icon: Users, title: "Guest Profiles", desc: "Complete booking history and preferences" },
            ].map((f, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                <div className="rounded-xl bg-primary/10 p-3 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Hotel className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">Neware Khaja Ghar</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Neware Khaja Ghar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
