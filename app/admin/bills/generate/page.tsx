"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Customer { _id: string; name: string; email: string }
interface Booking { _id: string; room: { roomNumber: string }; checkIn: string; checkOut: string; totalAmount: number; status: string }

export default function GenerateBillPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ customer: "", bookingId: "", discount: 0, taxRate: 13 });

  useEffect(() => {
    fetch("/api/customers").then((r) => r.json()).then(setCustomers);
  }, []);

  useEffect(() => {
    if (form.customer) {
      fetch(`/api/bookings?customerId=${form.customer}`).then((r) => r.json()).then(setBookings);
    }
  }, [form.customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer) { toast.error("Select a customer"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/bills", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); toast.error(d.error); return; }
      toast.success("Bill generated!");
      router.push("/admin/bills");
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Bill</h1>
        <p className="text-muted-foreground mt-1">Create a bill for a customer</p>
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
        {bookings.length > 0 && (
          <div className="space-y-2">
            <Label>Booking (Optional)</Label>
            <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={form.bookingId} onChange={(e) => setForm({ ...form, bookingId: e.target.value })}>
              <option value="">All orders (no specific booking)</option>
              {bookings.map((b) => (
                <option key={b._id} value={b._id}>
                  Room {b.room?.roomNumber} · {b.status} · Rs. {b.totalAmount?.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tax Rate (%)</Label>
            <Input type="number" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label>Discount (Rs.)</Label>
            <Input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} />
          </div>
        </div>
        <Button type="submit" className="w-full gradient-primary text-white border-0" disabled={loading}>
          {loading ? "Generating..." : "Generate Bill"}
        </Button>
      </form>
    </div>
  );
}
