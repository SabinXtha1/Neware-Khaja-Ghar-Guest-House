"use client";

import { useEffect, useState } from "react";
import { BedDouble, CalendarCheck, Users, DollarSign, ShoppingBag, Receipt, Percent } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface Stats {
  totalRooms: number; availableRooms: number; occupiedRooms: number;
  totalBookings: number; activeBookings: number; totalCustomers: number;
  pendingOrders: number; totalRevenue: number; unpaidBills: number;
  occupancyRate: number;
  recentBookings: Array<{ _id: string; customer: { name: string }; room: { roomNumber: string; type: string }; status: string; checkIn: string; createdAt: string }>;
  recentOrders: Array<{ _id: string; customer: { name: string }; room?: { roomNumber: string }; totalAmount: number; status: string; createdAt: string }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats").then((r) => r.json()).then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64 mt-2" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!stats) return <p>Failed to load dashboard</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your guest house operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Rooms" value={stats.totalRooms} description={`${stats.availableRooms} available`} icon={BedDouble} />
        <StatsCard title="Active Bookings" value={stats.activeBookings} description={`${stats.totalBookings} total`} icon={CalendarCheck} />
        <StatsCard title="Total Customers" value={stats.totalCustomers} icon={Users} />
        <StatsCard title="Revenue" value={`Rs. ${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} />
        <StatsCard title="Pending Orders" value={stats.pendingOrders} icon={ShoppingBag} />
        <StatsCard title="Unpaid Bills" value={stats.unpaidBills} icon={Receipt} />
        <StatsCard title="Occupancy Rate" value={`${stats.occupancyRate}%`} icon={Percent} />
        <StatsCard title="Available Rooms" value={stats.availableRooms} description={`${stats.occupiedRooms} occupied`} icon={BedDouble} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="p-5 border-b border-border/50">
            <h2 className="font-semibold">Recent Bookings</h2>
          </div>
          <div className="divide-y divide-border/50">
            {stats.recentBookings.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">No bookings yet</p>
            ) : stats.recentBookings.map((b) => (
              <div key={b._id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium text-sm">{b.customer?.name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">Room {b.room?.roomNumber} · {b.room?.type} · {format(new Date(b.checkIn), "MMM dd")}</p>
                </div>
                <StatusBadge status={b.status as "confirmed"} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="p-5 border-b border-border/50">
            <h2 className="font-semibold">Recent Orders</h2>
          </div>
          <div className="divide-y divide-border/50">
            {stats.recentOrders.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">No orders yet</p>
            ) : stats.recentOrders.map((o) => (
              <div key={o._id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium text-sm">{o.customer?.name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.room ? `Room ${o.room.roomNumber} · ` : ""}Rs. {o.totalAmount} · {format(new Date(o.createdAt), "MMM dd HH:mm")}
                  </p>
                </div>
                <StatusBadge status={o.status as "pending"} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
