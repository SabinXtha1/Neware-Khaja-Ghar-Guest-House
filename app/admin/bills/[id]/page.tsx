"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft, Printer, Hotel } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface BillDetail {
  _id: string;
  customer: { name: string; email: string; phone: string; address: string };
  booking?: { checkIn: string; checkOut: string; room: { roomNumber: string; type: string; price: number } };
  orders: Array<{ _id: string; items: Array<{ name: string; quantity: number; price: number }>; totalAmount: number; createdAt: string }>;
  roomCharges: number; orderCharges: number; tax: number; discount: number;
  totalAmount: number; status: string; createdAt: string; paidAt?: string;
}

export default function BillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [bill, setBill] = useState<BillDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bills/${id}`).then((r) => r.json()).then(setBill).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-96 rounded-2xl" /></div>;
  if (!bill) return <p>Bill not found</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/bills"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button></Link>
        <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4 mr-2" /> Print</Button>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-8 print:border-0 print:p-0 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center print:bg-gray-800">
              <Hotel className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Neware Khaja Ghar</h1>
              <p className="text-xs text-muted-foreground">Guest House & Restaurant</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <p className="text-sm text-muted-foreground">{format(new Date(bill.createdAt), "MMM dd, yyyy")}</p>
            <StatusBadge status={bill.status as "unpaid"} className="mt-1" />
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-8 py-4 border-y border-border/50">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Bill To</p>
            <p className="font-semibold">{bill.customer.name}</p>
            <p className="text-sm text-muted-foreground">{bill.customer.email}</p>
            {bill.customer.phone && <p className="text-sm text-muted-foreground">{bill.customer.phone}</p>}
            {bill.customer.address && <p className="text-sm text-muted-foreground">{bill.customer.address}</p>}
          </div>
          {bill.booking && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Stay Details</p>
              <p className="font-semibold">Room {bill.booking.room?.roomNumber} ({bill.booking.room?.type})</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(bill.booking.checkIn), "MMM dd")} — {format(new Date(bill.booking.checkOut), "MMM dd, yyyy")}
              </p>
            </div>
          )}
        </div>

        {/* Charges */}
        <div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/50">
              <th className="text-left py-3 font-medium">Description</th>
              <th className="text-right py-3 font-medium">Amount</th>
            </tr></thead>
            <tbody className="divide-y divide-border/30">
              {bill.roomCharges > 0 && (
                <tr>
                  <td className="py-3">
                    <p className="font-medium">Room Charges</p>
                    {bill.booking && bill.booking.room && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Rs. {bill.booking.room.price.toLocaleString()} × {Math.max(1, Math.ceil((new Date(bill.booking.checkOut).getTime() - new Date(bill.booking.checkIn).getTime()) / 86400000))} Night(s)
                      </p>
                    )}
                  </td>
                  <td className="py-3 text-right align-top">Rs. {bill.roomCharges.toLocaleString()}</td>
                </tr>
              )}
              {bill.orders.map((order, i) => (
                <tr key={i}>
                  <td className="py-3">
                    <p className="font-medium">Order #{i + 1}</p>
                    <div className="text-xs text-muted-foreground mt-1">
                      {order.items.map((item, j) => (
                        <span key={j}>{item.quantity}× {item.name} (Rs. {item.price}){j < order.items.length - 1 ? ", " : ""}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-right">Rs. {order.totalAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="border-t border-border/50 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>Rs. {(bill.roomCharges + bill.orderCharges).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>Rs. {bill.tax.toLocaleString()}</span>
          </div>
          {bill.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-emerald-600">-Rs. {bill.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-border/50">
            <span>Total</span>
            <span>Rs. {bill.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {bill.paidAt && (
          <p className="text-xs text-muted-foreground text-center">Paid on {format(new Date(bill.paidAt), "MMM dd, yyyy HH:mm")}</p>
        )}
        <p className="text-xs text-muted-foreground text-center pt-4">Thank you for staying with us! — Neware Khaja Ghar</p>
      </div>
    </div>
  );
}
