"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Receipt, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/stats-card";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState<Array<{ _id: string; room: { roomNumber: string; type: string }; checkIn: string; checkOut: string; status: string; totalAmount: number }>>([]);
  const [bills, setBills] = useState<Array<{ _id: string; totalAmount: number; status: string; createdAt: string }>>([]);
  const [orders, setOrders] = useState<Array<{ _id: string; totalAmount: number; status: string; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/bookings").then((r) => r.json()),
      fetch("/api/bills").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ]).then(([b, bi, o]) => {
      setBookings(b);
      setBills(bi);
      setOrders(o);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
      </div>
    </div>
  );

  const activeBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "checked-in");
  const unpaidBills = bills.filter((b) => b.status === "unpaid");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Active Bookings" value={activeBookings.length} description={`${bookings.length} total`} icon={CalendarCheck} />
        <StatsCard title="Pending Orders" value={orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled").length} description={`${orders.length} total`} icon={ShoppingBag} />
        <StatsCard title="Unpaid Bills" value={unpaidBills.length} description={`${bills.length} total`} icon={Receipt} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="p-5 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-semibold">Recent Bookings</h2>
            <Link href="/my-bookings"><Button variant="ghost" size="sm">View All <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button></Link>
          </div>
          <div className="divide-y divide-border/50">
            {bookings.length === 0 ? <p className="p-5 text-sm text-muted-foreground">No bookings yet</p> :
              bookings.slice(0, 5).map((b) => (
                <div key={b._id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium text-sm">Room {b.room?.roomNumber} <span className="text-muted-foreground capitalize">({b.room?.type})</span></p>
                    <p className="text-xs text-muted-foreground">{format(new Date(b.checkIn), "MMM dd")} — {format(new Date(b.checkOut), "MMM dd")}</p>
                  </div>
                  <StatusBadge status={b.status as "confirmed"} />
                </div>
              ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="p-5 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-semibold">Recent Bills</h2>
            <Link href="/my-bills"><Button variant="ghost" size="sm">View All <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button></Link>
          </div>
          <div className="divide-y divide-border/50">
            {bills.length === 0 ? <p className="p-5 text-sm text-muted-foreground">No bills yet</p> :
              bills.slice(0, 5).map((b) => (
                <div key={b._id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium text-sm">Rs. {b.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(b.createdAt), "MMM dd, yyyy")}</p>
                  </div>
                  <StatusBadge status={b.status as "unpaid"} />
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl gradient-primary p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Ready to book your next stay?</h2>
        <p className="text-white/80 mb-4">Browse our available rooms and book instantly.</p>
        <Link href="/book-room">
          <Button className="bg-white text-primary hover:bg-white/90 border-0">Browse Rooms <ArrowRight className="h-4 w-4 ml-2" /></Button>
        </Link>
      </div>
    </div>
  );
}
