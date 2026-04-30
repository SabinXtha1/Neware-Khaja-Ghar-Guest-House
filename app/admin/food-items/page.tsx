"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FoodItem {
  _id: string;
  name: string;
  price: number;
  category: "Food" | "Beverage" | "Snacks" | "Other";
  isAvailable: boolean;
  imageUrl: string;
}

export default function FoodItemsPage() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FoodItem | null>(null);
  const [form, setForm] = useState<{
    name: string;
    price: number;
    category: "Food" | "Beverage" | "Snacks" | "Other";
    imageUrl: string;
    isAvailable: boolean;
  }>({
    name: "",
    price: 0,
    category: "Food",
    imageUrl: "",
    isAvailable: true,
  });

  const fetchItems = () => {
    fetch("/api/food-items").then((r) => r.json()).then(setItems).finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => {
    setForm({ name: "", price: 0, category: "Food", imageUrl: "", isAvailable: true });
    setEditing(null);
  };

  const openEdit = (item: FoodItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      price: item.price,
      category: item.category,
      imageUrl: (item as any).imageUrl || "",
      isAvailable: item.isAvailable,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };

    try {
      const url = editing ? `/api/food-items/${editing._id}` : "/api/food-items";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); toast.error(d.error); return; }
      toast.success(editing ? "Item updated" : "Item created");
      setDialogOpen(false);
      resetForm();
      fetchItems();
    } catch { toast.error("Something went wrong"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this food item?")) return;
    const res = await fetch(`/api/food-items/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Item deleted"); fetchItems(); }
    else toast.error("Failed to delete");
  };

  const categories = ["Food", "Snacks", "Beverage", "Other"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Food Menu</h1>
          <p className="text-muted-foreground mt-1">Manage restaurant and room service items</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger render={<Button className="gradient-primary text-white border-0" />}>
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editing ? "Edit Item" : "Add Menu Item"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Price (Rs.)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isAvailable" className="h-4 w-4 rounded border-gray-300"
                  checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} />
                <Label htmlFor="isAvailable">Available in stock</Label>
              </div>
              <Button type="submit" className="w-full gradient-primary text-white border-0">{editing ? "Update" : "Create"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No menu items</p>
          <p className="text-sm">Add some delicious items to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item._id} className={cn(
              "rounded-2xl border border-border/50 bg-card p-5 space-y-4 hover:shadow-lg transition-all flex flex-col overflow-hidden",
              !item.isAvailable && "opacity-60 grayscale-[0.5]"
            )}>
              {item.imageUrl && (
                <div className="h-28 -mx-5 -mt-5 mb-2 relative overflow-hidden bg-muted">
                  <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                </div>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <span className="text-xs text-muted-foreground">{item.category}</span>
                </div>
                {!item.isAvailable && <span className="text-[10px] font-bold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">Out of stock</span>}
              </div>
              <p className="text-2xl font-bold">Rs. {item.price.toLocaleString()}</p>
              <div className="flex gap-2 pt-2 border-t border-border/50">
                <Button variant="ghost" size="sm" className="flex-1 h-8" onClick={() => openEdit(item)}><Pencil className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                <Button variant="ghost" size="sm" className="flex-1 h-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(item._id)}>
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
