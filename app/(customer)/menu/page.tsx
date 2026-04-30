"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, Plus, Minus, ShoppingCart, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FoodItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
  imageUrl: string;
}

interface CartItem extends FoodItem {
  quantity: number;
}

export default function MenuPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingActive, setCheckingActive] = useState(true);
  const [activeBooking, setActiveBooking] = useState<{ active: boolean; room?: { roomNumber: string } } | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [notes, setNotes] = useState("");

  useEffect(() => {
    // Fetch menu
    fetch("/api/food-items?available=true")
      .then((r) => r.json())
      .then(setMenuItems)
      .finally(() => setLoading(false));

    // Check if user is checked-in
    fetch("/api/bookings/active")
      .then((r) => r.json())
      .then(setActiveBooking)
      .finally(() => setCheckingActive(false));
  }, []);

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FoodItem[]>);

  const addToCart = (item: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === id);
      if (existing && existing.quantity > 1) {
        return prev.map((i) => i._id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter((i) => i._id !== id);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setPlacingOrder(true);

    try {
      const items = cart.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price }));
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, notes }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to place order");
        return;
      }

      toast.success("Order placed successfully!");
      setCart([]);
      setNotes("");
      router.push("/my-orders");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPlacingOrder(false);
    }
  };

  const canOrder = activeBooking?.active === true;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Menu Area */}
      <div className={cn("space-y-8 flex-1", cart.length > 0 ? "lg:pb-32" : "")}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Restaurant Menu</h1>
          <p className="text-muted-foreground mt-1">
            Explore our delicious offerings for dining or room service
          </p>
        </div>

        {!checkingActive && !canOrder && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-4 rounded-2xl flex items-start gap-3">
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Room Service Unavailable</p>
              <p className="text-sm mt-1">You must have an active, checked-in booking to order food to your room. If you just checked in, please ask reception to update your booking status.</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-32 rounded-2xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Menu is currently unavailable</p>
            <p className="text-sm">Please check back later.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-border/50">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 flex flex-col"
                    >
                      {item.imageUrl ? (
                        <div className="h-40 w-full overflow-hidden">
                          <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      ) : (
                        <div className="h-20 w-full bg-muted flex items-center justify-center">
                          <UtensilsCrossed className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                      )}
                      
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4 gap-2">
                          <div>
                            <h3 className="text-lg font-bold leading-tight">{item.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
                          </div>
                          <p className="text-lg font-bold text-primary shrink-0">
                            Rs. {item.price.toLocaleString()}
                          </p>
                        </div>
                        
                        {canOrder && (
                          <div className="flex justify-end border-t border-border/50 pt-3 mt-auto">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => addToCart(item)}
                            >
                              <Plus className="h-4 w-4 mr-2" /> Add to Order
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar (Desktop) */}
      {cart.length > 0 && canOrder && (
        <div className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-24 rounded-2xl border border-border/50 bg-card p-5 shadow-xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Your Order
            </h3>
            <div className="space-y-3 max-h-[40vh] overflow-auto pr-2 mb-4">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Rs. {item.price}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-2 py-1">
                    <button onClick={() => removeFromCart(item._id)} className="p-0.5 hover:text-destructive"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="text-sm w-4 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="p-0.5 hover:text-primary"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border/50 pt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">Special Instructions</label>
                <textarea 
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="E.g., less spicy, no onions..."
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Order will be delivered to Room {activeBooking.room?.roomNumber}
              </p>
              <Button 
                className="w-full gradient-primary text-white border-0" 
                onClick={placeOrder}
                disabled={placingOrder}
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Cart Floating Bottom Bar */}
      {cart.length > 0 && canOrder && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 z-40 bg-background/80 backdrop-blur-md border-t border-border/50 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col gap-3">
            <div className="flex items-center gap-2 w-full">
              <input 
                type="text" 
                className="flex-1 rounded-md border border-input bg-background/50 px-3 py-1.5 text-sm shadow-sm placeholder:text-muted-foreground"
                placeholder="Special instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-medium">{cart.reduce((s, i) => s + i.quantity, 0)} items</p>
                <p className="font-bold text-lg">Rs. {cartTotal.toLocaleString()}</p>
              </div>
              <Button 
                className="gradient-primary text-white border-0 px-8" 
                onClick={placeOrder}
                disabled={placingOrder}
              >
                {placingOrder ? "Placing..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
