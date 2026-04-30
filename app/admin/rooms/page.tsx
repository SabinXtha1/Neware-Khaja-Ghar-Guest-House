"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";

interface Room {
  _id: string; roomNumber: string; type: string; price: number;
  status: string; floor: number; amenities: string[]; description: string;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [form, setForm] = useState({
    roomNumber: "", type: "single", price: 0, floor: 1,
    amenities: "", description: "", status: "available",
  });

  const fetchRooms = () => {
    fetch("/api/rooms").then((r) => r.json()).then(setRooms).finally(() => setLoading(false));
  };

  useEffect(() => { fetchRooms(); }, []);

  const resetForm = () => {
    setForm({ roomNumber: "", type: "single", price: 0, floor: 1, amenities: "", description: "", status: "available" });
    setEditing(null);
  };

  const openEdit = (room: Room) => {
    setEditing(room);
    setForm({
      roomNumber: room.roomNumber, type: room.type, price: room.price,
      floor: room.floor, amenities: room.amenities.join(", "),
      description: room.description, status: room.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean), price: Number(form.price), floor: Number(form.floor) };

    try {
      const url = editing ? `/api/rooms/${editing._id}` : "/api/rooms";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); toast.error(d.error); return; }
      toast.success(editing ? "Room updated" : "Room created");
      setDialogOpen(false);
      resetForm();
      fetchRooms();
    } catch { toast.error("Something went wrong"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this room?")) return;
    const res = await fetch(`/api/rooms/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Room deleted"); fetchRooms(); }
    else toast.error("Failed to delete");
  };

  const typeColors: Record<string, string> = {
    single: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    double: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    deluxe: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    suite: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
          <p className="text-muted-foreground mt-1">Manage your guest house rooms</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white border-0"><Plus className="h-4 w-4 mr-2" /> Add Room</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editing ? "Edit Room" : "Add Room"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Room Number</Label>
                  <Input value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Floor</Label>
                  <Input type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: Number(e.target.value) })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Price/Night (Rs.)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
                </div>
              </div>
              {editing && (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Amenities (comma separated)</Label>
                <Input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="WiFi, TV, AC" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <Button type="submit" className="w-full gradient-primary text-white border-0">{editing ? "Update" : "Create"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BedDouble className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No rooms yet</p>
          <p className="text-sm">Add your first room to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div key={room._id} className="rounded-2xl border border-border/50 bg-card p-5 space-y-4 hover:shadow-lg hover:shadow-primary/5 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">Room {room.roomNumber}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeColors[room.type] || ""}`}>{room.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Floor {room.floor}</p>
                </div>
                <StatusBadge status={room.status as "available"} />
              </div>
              <p className="text-2xl font-bold">Rs. {room.price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/night</span></p>
              {room.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {room.amenities.map((a, i) => (
                    <span key={i} className="text-xs bg-muted px-2 py-1 rounded-md">{a}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(room)}><Pencil className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(room._id)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
