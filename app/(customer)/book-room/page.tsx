"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BedDouble, Wifi, Tv, Wind, Droplets, Wine, Mountain, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Room { _id: string; roomNumber: string; type: string; price: number; status: string; floor: number; amenities: string[]; description: string; imageUrl: string; }

const amenityIcons: Record<string, typeof Wifi> = { WiFi: Wifi, TV: Tv, AC: Wind, Fan: Wind, "Hot Water": Droplets, "Mini Bar": Wine, "Mountain View": Mountain, Jacuzzi: Bath };

export default function BookRoomPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [form, setForm] = useState({ checkIn: "", checkOut: "", guests: 1, notes: "" });
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetch("/api/rooms?status=available").then((r) => r.json()).then(setRooms).finally(() => setLoading(false));
  }, []);

  const nights = form.checkIn && form.checkOut
    ? Math.max(1, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
    : 0;

  const today = new Date().toISOString().split("T")[0];

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;
    setBooking(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room: selectedRoom._id, ...form, guests: Number(form.guests) }),
      });
      if (!res.ok) { const d = await res.json(); toast.error(d.error); return; }
      toast.success("Room booked!");
      setSelectedRoom(null);
      router.push("/my-bookings");
    } catch { toast.error("Something went wrong"); }
    finally { setBooking(false); }
  };

  const typeColors: Record<string, string> = {
    single: "from-blue-500/20 to-blue-600/5",
    double: "from-purple-500/20 to-purple-600/5",
    deluxe: "from-amber-500/20 to-amber-600/5",
    suite: "from-emerald-500/20 to-emerald-600/5",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book a Room</h1>
        <p className="text-muted-foreground mt-1">Browse available rooms and make a reservation</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BedDouble className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No rooms available</p>
          <p className="text-sm">Please check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room._id} className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
              {room.imageUrl ? (
                <div className="h-48 w-full relative overflow-hidden bg-muted">
                  <img src={room.imageUrl} alt={`Room ${room.roomNumber}`} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-4 right-4">
                    <span className="text-xs bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full font-medium capitalize">{room.type}</span>
                  </div>
                </div>
              ) : (
                <div className={`h-40 w-full bg-gradient-to-br ${typeColors[room.type] || ""} flex items-center justify-center relative`}>
                  <BedDouble className="h-10 w-10 opacity-20" />
                  <div className="absolute top-4 right-4">
                    <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium capitalize">{room.type}</span>
                  </div>
                </div>
              )}
              
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">Room {room.roomNumber}</h3>
                      <p className="text-sm text-muted-foreground">Floor {room.floor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">Rs. {room.price.toLocaleString()}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">per night</p>
                    </div>
                  </div>
                  {room.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{room.description}</p>}
                  
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {room.amenities.slice(0, 4).map((a, i) => {
                      const Icon = amenityIcons[a];
                      return (
                        <div key={i} className="flex items-center gap-1 text-[11px] font-medium bg-muted px-2 py-1 rounded-md">
                          {Icon && <Icon className="h-3 w-3" />}
                          {a}
                        </div>
                      );
                    })}
                    {room.amenities.length > 4 && (
                      <div className="flex items-center gap-1 text-[11px] font-medium bg-muted px-2 py-1 rounded-md">
                        +{room.amenities.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/50">
                  <Button onClick={() => setSelectedRoom(room)} className="w-full gradient-primary text-white border-0">Book Room</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedRoom} onOpenChange={(o) => { if (!o) setSelectedRoom(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Book Room {selectedRoom?.roomNumber}</DialogTitle></DialogHeader>
          <form onSubmit={handleBook} className="space-y-4">
            <div className="p-3 bg-muted/50 rounded-xl">
              <p className="font-medium">{selectedRoom?.type} Room · Floor {selectedRoom?.floor}</p>
              <p className="text-sm text-muted-foreground">Rs. {selectedRoom?.price.toLocaleString()} / night</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Check In</Label>
                <Input type="date" min={today} value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Check Out</Label>
                <Input type="date" min={form.checkIn || today} value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Number of Guests</Label>
              <Input type="number" min="1" value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} required />
            </div>
            <div className="space-y-2">
              <Label>Special Requests</Label>
              <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any special requests..." />
            </div>
            {nights > 0 && selectedRoom && (
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Rate per night</span>
                  <span className="text-sm font-medium">Rs. {selectedRoom.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-sm font-medium">{nights} night(s)</span>
                </div>
                <div className="pt-2 border-t border-primary/10 flex justify-between items-end">
                  <span className="font-bold">Total Estimated Cost</span>
                  <span className="text-xl font-bold text-primary">Rs. {(nights * selectedRoom.price).toLocaleString()}</span>
                </div>
              </div>
            )}
            <Button type="submit" className="w-full gradient-primary text-white border-0 h-11" disabled={booking || nights < 1}>
              {booking ? "Booking..." : "Confirm Booking"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
