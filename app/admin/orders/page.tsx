"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";
import { format } from "date-fns";

interface Order {
  _id: string; customer: { name: string; email: string }; room?: { roomNumber: string };
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number; status: string; createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchOrders = () => {
    const url = filter ? `/api/orders?status=${filter}` : "/api/orders";
    fetch(url).then((r) => r.json()).then(setOrders).finally(() => setLoading(false));
  };
  useEffect(() => { fetchOrders(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) { toast.success(`Order ${status}`); fetchOrders(); }
    else toast.error("Update failed");
  };

  const statuses = ["", "pending", "preparing", "delivered", "cancelled"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage food & service orders</p>
        </div>
        <Link href="/admin/orders/new">
          <Button className="gradient-primary text-white border-0"><Plus className="h-4 w-4 mr-2" /> New Order</Button>
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
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="rounded-2xl border border-border/50 bg-card p-5 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">{o.customer?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.room ? `Room ${o.room.roomNumber} · ` : ""}{format(new Date(o.createdAt), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">Rs. {o.totalAmount.toLocaleString()}</span>
                  <StatusBadge status={o.status as "pending"} />
                </div>
              </div>
              <div className="space-y-1 mb-3">
                {o.items.map((item, i) => (
                  <p key={i} className="text-sm text-muted-foreground">{item.quantity}× {item.name} — Rs. {(item.price * item.quantity).toLocaleString()}</p>
                ))}
                {(o as any).notes && (
                  <div className="mt-2 p-2 bg-amber-500/10 rounded-md border border-amber-500/20">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Special Instructions:</p>
                    <p className="text-sm italic">{(o as any).notes}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {o.status === "pending" && <Button size="sm" variant="outline" onClick={() => updateStatus(o._id, "preparing")}>Start Preparing</Button>}
                {o.status === "preparing" && <Button size="sm" variant="outline" onClick={() => updateStatus(o._id, "delivered")}>Mark Delivered</Button>}
                {(o.status === "pending" || o.status === "preparing") && (
                  <Button size="sm" variant="outline" className="text-destructive" onClick={() => updateStatus(o._id, "cancelled")}>Cancel</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
