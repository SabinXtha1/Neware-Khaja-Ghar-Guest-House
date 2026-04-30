"use client";

import { useEffect, useState } from "react";
import { Receipt } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { format } from "date-fns";

interface Bill {
  _id: string; roomCharges: number; orderCharges: number; tax: number;
  discount: number; totalAmount: number; status: string; createdAt: string;
}

export default function MyBillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bills").then((r) => r.json()).then(setBills).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Bills</h1>
        <p className="text-muted-foreground mt-1">Your billing history</p>
      </div>
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />)}</div>
      ) : bills.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Receipt className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No bills yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bills.map((b) => (
            <div key={b._id} className="rounded-2xl border border-border/50 bg-card p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">{format(new Date(b.createdAt), "MMM dd, yyyy")}</p>
                <StatusBadge status={b.status as "unpaid"} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Room Charges</p>
                  <p className="font-bold">Rs. {b.roomCharges.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Food Orders</p>
                  <p className="font-bold">Rs. {b.orderCharges.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Tax (13%)</p>
                  <p className="font-bold">Rs. {b.tax.toLocaleString()}</p>
                </div>
                {b.discount > 0 && (
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Discount</p>
                    <p className="font-bold text-emerald-700 dark:text-emerald-400">-Rs. {b.discount.toLocaleString()}</p>
                  </div>
                )}
              </div>
              <div className="pt-3 border-t border-border/50 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold">Rs. {b.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
