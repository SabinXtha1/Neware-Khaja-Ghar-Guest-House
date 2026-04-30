"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { format } from "date-fns";

interface Order {
  _id: string; room?: { roomNumber: string };
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number; status: string; createdAt: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders").then((r) => r.json()).then(setOrders).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground mt-1">Your order history</p>
      </div>
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="rounded-2xl border border-border/50 bg-card p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(o.createdAt), "MMM dd, yyyy HH:mm")}
                    {o.room ? ` · Room ${o.room.roomNumber}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">Rs. {o.totalAmount.toLocaleString()}</span>
                  <StatusBadge status={o.status as "pending"} />
                </div>
              </div>
              <div className="space-y-1">
                {o.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.quantity}× {item.name}</span>
                    <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
