"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Room { _id: string; roomNumber: string; type: string; price: number; status: string }
interface Customer { _id: string; name: string; email: string }

export default function NewBookingPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ customer: "", room: "", checkIn: "", checkOut: "", guests: 1, notes: "" });

  useEffect(() => {
    fetch("/api/rooms?status=available").then((r) => r.json()).then(setRooms);
    fetch("/api/customers").then((r) => r.json()).then(setCustomers);
  }, []);

  const selectedRoom = rooms.find((r) => r._id === form.room);
  const nights = form.checkIn && form.checkOut
    ? Math.max(1, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
    : 0;
  const total = selectedRoom ? nights * selectedRoom.price : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, guests: Number(form.guests) }),
      });
      if (!res.ok) { const d = await res.json(); toast.error(d.error); return; }
      toast.success("Booking created!");
      router.push("/admin/bookings");
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Booking</h1>
        <p className="text-muted-foreground mt-1">Create a new room booking</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border/50 bg-card p-6">
        <div className="space-y-2">
          <Label>Customer</Label>
          <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} required>
            <option value="">Select customer</option>
            {customers.map((c) => <option key={c._id} value={c._id}>{c.name} ({c.email})</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Room</Label>
          <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} required>
            <option value="">Select room</option>
            {rooms.map((r) => <option key={r._id} value={r._id}>Room {r.roomNumber} - {r.type} (Rs. {r.price}/night)</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Check In</Label>
            <Input type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Check Out</Label>
            <Input type="date" value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Guests</Label>
          <Input type="number" min="1" value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} required />
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
        </div>
        {total > 0 && (
          <div className="p-4 bg-primary/5 rounded-xl">
            <p className="text-sm text-muted-foreground">{nights} night(s) × Rs. {selectedRoom?.price.toLocaleString()}</p>
            <p className="text-xl font-bold mt-1">Total: Rs. {total.toLocaleString()}</p>
          </div>
        )}
        <Button type="submit" className="w-full gradient-primary text-white border-0" disabled={loading}>
          {loading ? "Creating..." : "Create Booking"}
        </Button>
      </form>
    </div>
  );
}
