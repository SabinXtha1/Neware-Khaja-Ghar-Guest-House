"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, CalendarCheck, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Booking {
  _id: string;
  customer: { _id: string; name: string; email: string };
  room: { _id?: string; roomNumber: string; type: string; price: number };
  checkIn: string; checkOut: string; guests: number;
  status: string; totalAmount: number; createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [rooms, setRooms] = useState<Array<{_id: string; roomNumber: string; type: string}>>([]);
  const [form, setForm] = useState({ checkIn: "", checkOut: "", guests: 1, room: "", status: "" });

  const fetchBookings = () => {
    const url = filter ? `/api/bookings?status=${filter}` : "/api/bookings";
    fetch(url).then((r) => r.json()).then(setBookings).finally(() => setLoading(false));
  };

  useEffect(() => { 
    fetchBookings(); 
    fetch("/api/rooms").then(r => r.json()).then(setRooms).catch(() => {});
  }, [filter]);

  const openEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setForm({
      checkIn: new Date(booking.checkIn).toISOString().split('T')[0],
      checkOut: new Date(booking.checkOut).toISOString().split('T')[0],
      guests: booking.guests,
      room: booking.room?._id || (booking.room as any) || "",
      status: booking.status,
    });
    setDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    const res = await fetch(`/api/bookings/${editingBooking._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Booking updated");
      setDialogOpen(false);
      fetchBookings();
    } else {
      toast.error("Update failed");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) { toast.success(`Booking ${status}`); fetchBookings(); }
    else toast.error("Update failed");
  };

  const statuses = ["", "confirmed", "checked-in", "checked-out", "cancelled"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage guest bookings</p>
        </div>
        <Link href="/admin/bookings/new">
          <Button className="gradient-primary text-white border-0"><Plus className="h-4 w-4 mr-2" /> New Booking</Button>
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <Button key={s} variant={filter === s ? "default" : "outline"} size="sm"
            onClick={() => setFilter(s)} className={filter === s ? "gradient-primary text-white border-0" : ""}>
            {s || "All"}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <CalendarCheck className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No bookings found</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-4 font-medium">Guest</th>
                  <th className="text-left p-4 font-medium">Room</th>
                  <th className="text-left p-4 font-medium">Check In</th>
                  <th className="text-left p-4 font-medium">Check Out</th>
                  <th className="text-left p-4 font-medium">Amount</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <p className="font-medium">{b.customer?.name}</p>
                      <p className="text-xs text-muted-foreground">{b.customer?.email}</p>
                    </td>
                    <td className="p-4">{b.room?.roomNumber} <span className="text-muted-foreground capitalize">({b.room?.type})</span></td>
                    <td className="p-4">{format(new Date(b.checkIn), "MMM dd, yyyy")}</td>
                    <td className="p-4">{format(new Date(b.checkOut), "MMM dd, yyyy")}</td>
                    <td className="p-4 font-medium">Rs. {b.totalAmount?.toLocaleString()}</td>
                    <td className="p-4"><StatusBadge status={b.status as "confirmed"} /></td>
                    <td className="p-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {b.status === "confirmed" && <Button size="sm" variant="outline" onClick={() => updateStatus(b._id, "checked-in")}>Check In</Button>}
                        {b.status === "checked-in" && <Button size="sm" variant="outline" onClick={() => updateStatus(b._id, "checked-out")}>Check Out</Button>}
                        {(b.status === "confirmed" || b.status === "checked-in") && (
                          <Button size="sm" variant="outline" className="text-destructive" onClick={() => updateStatus(b._id, "cancelled")}>Cancel</Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Booking</DialogTitle></DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Check In</Label>
                <Input type="date" value={form.checkIn} onChange={e => setForm({...form, checkIn: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Check Out</Label>
                <Input type="date" value={form.checkOut} onChange={e => setForm({...form, checkOut: e.target.value})} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Room</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" 
                value={form.room} onChange={e => setForm({...form, room: e.target.value})} required>
                <option value="">Select Room</option>
                {rooms.map(r => (
                  <option key={r._id} value={r._id}>Room {r.roomNumber} ({r.type})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Guests</Label>
                <Input type="number" min="1" value={form.guests} onChange={e => setForm({...form, guests: Number(e.target.value)})} required />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" 
                  value={form.status} onChange={e => setForm({...form, status: e.target.value})} required>
                  {statuses.filter(s => s).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full gradient-primary text-white border-0">Save Changes</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
