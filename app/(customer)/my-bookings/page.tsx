"use client";

import { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { format } from "date-fns";

interface Booking {
  _id: string; room: { roomNumber: string; type: string; price: number };
  checkIn: string; checkOut: string; guests: number;
  status: string; totalAmount: number; notes: string; createdAt: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings").then((r) => r.json()).then(setBookings).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground mt-1">Your booking history</p>
      </div>
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <CalendarCheck className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No bookings yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="rounded-2xl border border-border/50 bg-card p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold">Room {b.room?.roomNumber}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize">{b.room?.type}</span>
                    <StatusBadge status={b.status as "confirmed"} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(b.checkIn), "MMM dd, yyyy")} — {format(new Date(b.checkOut), "MMM dd, yyyy")} · {b.guests} guest(s)
                  </p>
                  {b.notes && <p className="text-sm text-muted-foreground italic">&quot;{b.notes}&quot;</p>}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">Rs. {b.totalAmount?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Booked {format(new Date(b.createdAt), "MMM dd, yyyy")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
