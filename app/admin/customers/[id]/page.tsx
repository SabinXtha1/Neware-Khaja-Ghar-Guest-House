"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft, User, CalendarCheck, ShoppingBag, Receipt } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface CustomerData {
  customer: { _id: string; name: string; email: string; phone: string; address: string; createdAt: string };
  bookings: Array<{ _id: string; room: { roomNumber: string; type: string }; checkIn: string; checkOut: string; status: string; totalAmount: number }>;
  orders: Array<{ _id: string; items: Array<{ name: string; quantity: number; price: number }>; totalAmount: number; status: string; createdAt: string; room?: { roomNumber: string } }>;
  bills: Array<{ _id: string; roomCharges: number; orderCharges: number; tax: number; discount: number; totalAmount: number; status: string; createdAt: string }>;
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/customers/${id}`).then((r) => r.json()).then(setData).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 rounded-2xl" /></div>;
  if (!data) return <p>Customer not found</p>;

  const { customer, bookings, orders, bills } = data;

  return (
    <div className="space-y-6">
      <Link href="/admin/customers"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button></Link>

      <div className="rounded-2xl border border-border/50 bg-card p-6 flex flex-col sm:flex-row gap-6">
        <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {customer.name.charAt(0)}
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <p className="text-muted-foreground">{customer.email}</p>
          <div className="flex gap-4 text-sm text-muted-foreground mt-2">
            <span>📞 {customer.phone || "—"}</span>
            <span>📍 {customer.address || "—"}</span>
            <span>📅 Joined {format(new Date(customer.createdAt), "MMM dd, yyyy")}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/50 bg-card p-4 text-center">
          <CalendarCheck className="h-5 w-5 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">{bookings.length}</p>
          <p className="text-xs text-muted-foreground">Bookings</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-4 text-center">
          <ShoppingBag className="h-5 w-5 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">{orders.length}</p>
          <p className="text-xs text-muted-foreground">Orders</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-4 text-center">
          <Receipt className="h-5 w-5 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">{bills.length}</p>
          <p className="text-xs text-muted-foreground">Bills</p>
        </div>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="bills">Bills</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings" className="mt-4">
          {bookings.length === 0 ? <p className="text-muted-foreground py-8 text-center">No bookings</p> : (
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-4 font-medium">Room</th>
                  <th className="text-left p-4 font-medium">Check In</th>
                  <th className="text-left p-4 font-medium">Check Out</th>
                  <th className="text-left p-4 font-medium">Amount</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr></thead>
                <tbody className="divide-y divide-border/50">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-muted/20">
                      <td className="p-4">{b.room?.roomNumber} <span className="text-muted-foreground capitalize">({b.room?.type})</span></td>
                      <td className="p-4">{format(new Date(b.checkIn), "MMM dd, yyyy")}</td>
                      <td className="p-4">{format(new Date(b.checkOut), "MMM dd, yyyy")}</td>
                      <td className="p-4 font-medium">Rs. {b.totalAmount?.toLocaleString()}</td>
                      <td className="p-4"><StatusBadge status={b.status as "confirmed"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        <TabsContent value="orders" className="mt-4">
          {orders.length === 0 ? <p className="text-muted-foreground py-8 text-center">No orders</p> : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o._id} className="rounded-xl border border-border/50 bg-card p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium">Rs. {o.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(o.createdAt), "MMM dd, yyyy HH:mm")}{o.room ? ` · Room ${o.room.roomNumber}` : ""}</p>
                    </div>
                    <StatusBadge status={o.status as "pending"} />
                  </div>
                  <div className="space-y-1">
                    {o.items.map((item, i) => (
                      <p key={i} className="text-sm text-muted-foreground">{item.quantity}× {item.name} — Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="bills" className="mt-4">
          {bills.length === 0 ? <p className="text-muted-foreground py-8 text-center">No bills</p> : (
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Room Charges</th>
                  <th className="text-left p-4 font-medium">Orders</th>
                  <th className="text-left p-4 font-medium">Tax</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr></thead>
                <tbody className="divide-y divide-border/50">
                  {bills.map((b) => (
                    <tr key={b._id} className="hover:bg-muted/20">
                      <td className="p-4">{format(new Date(b.createdAt), "MMM dd, yyyy")}</td>
                      <td className="p-4">Rs. {b.roomCharges.toLocaleString()}</td>
                      <td className="p-4">Rs. {b.orderCharges.toLocaleString()}</td>
                      <td className="p-4">Rs. {b.tax.toLocaleString()}</td>
                      <td className="p-4 font-bold">Rs. {b.totalAmount.toLocaleString()}</td>
                      <td className="p-4"><StatusBadge status={b.status as "unpaid"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
