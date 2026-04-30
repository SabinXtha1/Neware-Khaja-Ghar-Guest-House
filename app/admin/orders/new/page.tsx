"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Customer { _id: string; name: string; email: string }
interface Room { _id: string; roomNumber: string }
interface FoodItem { _id: string; name: string; price: number; category: string; isAvailable: boolean }
interface OrderItem { name: string; quantity: number; price: number }

export default function NewOrderPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ customer: "", room: "" });
  const [items, setItems] = useState<OrderItem[]>([]);
  const [customItem, setCustomItem] = useState({ name: "", quantity: 1, price: 0 });

  useEffect(() => {
    fetch("/api/customers").then((r) => r.json()).then(setCustomers);
    fetch("/api/rooms").then((r) => r.json()).then(setRooms);
    fetch("/api/food-items?available=true").then((r) => r.json()).then(setMenuItems).finally(() => setLoadingMenu(false));
  }, []);

  const addMenuItem = (menu: { name: string; price: number }) => {
    const existing = items.findIndex((i) => i.name === menu.name);
    if (existing >= 0) {
      const updated = [...items];
      updated[existing].quantity += 1;
      setItems(updated);
    } else {
      setItems([...items, { ...menu, quantity: 1 }]);
    }
  };

  const addCustomItem = () => {
    if (!customItem.name || customItem.price <= 0) return;
    setItems([...items, { ...customItem }]);
    setCustomItem({ name: "", quantity: 1, price: 0 });
  };

  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Add at least one item"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items, room: form.room || undefined }),
      });
      if (!res.ok) { const d = await res.json(); toast.error(d.error); return; }
      toast.success("Order created!");
      router.push("/admin/orders");
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  };

  // Group menu items by category
  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FoodItem[]>);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Order</h1>
        <p className="text-muted-foreground mt-1">Create a food or service order</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form id="order-form" onSubmit={handleSubmit} className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
            <h3 className="font-semibold">Order Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer</Label>
                <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} required>
                  <option value="">Select customer</option>
                  {customers.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Room (Optional)</Label>
                <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}>
                  <option value="">No room</option>
                  {rooms.map((r) => <option key={r._id} value={r._id}>Room {r.roomNumber}</option>)}
                </select>
              </div>
            </div>
          </form>

          <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
            <h3 className="font-semibold">Menu Items</h3>
            {loadingMenu ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
                </div>
              </div>
            ) : Object.keys(groupedMenu).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No available menu items found.</p>
            ) : (
              Object.entries(groupedMenu).map(([category, catItems]) => (
                <div key={category} className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {catItems.map((m) => (
                      <button key={m._id} type="button" onClick={() => addMenuItem(m)}
                        className="p-3 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-left">
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">Rs. {m.price}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
            
            <div className="border-t border-border/50 pt-4">
              <h4 className="text-sm font-medium mb-2">Custom Item</h4>
              <div className="flex gap-2">
                <Input placeholder="Item name" value={customItem.name} onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })} className="flex-1" />
                <Input type="number" placeholder="Qty" value={customItem.quantity} onChange={(e) => setCustomItem({ ...customItem, quantity: Number(e.target.value) })} className="w-20" />
                <Input type="number" placeholder="Price" value={customItem.price || ""} onChange={(e) => setCustomItem({ ...customItem, price: Number(e.target.value) })} className="w-24" />
                <Button type="button" variant="outline" onClick={addCustomItem}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </div>

        {/* Cart */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-3 sticky top-6">
            <h3 className="font-semibold">Current Order</h3>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Cart is empty</p>
            ) : (
              <>
                <div className="space-y-2 max-h-[400px] overflow-auto pr-2">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{item.quantity}× {item.name}</p>
                        <p className="text-xs text-muted-foreground">Rs. {item.price} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">Rs. {(item.quantity * item.price).toLocaleString()}</span>
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(i)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 flex justify-between text-lg font-bold border-t border-border/50">
                  <span>Total</span><span>Rs. {total.toLocaleString()}</span>
                </div>
              </>
            )}
            <Button type="submit" form="order-form" className="w-full gradient-primary text-white border-0 h-11 mt-4" disabled={loading || items.length === 0}>
              {loading ? "Creating..." : "Create Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
