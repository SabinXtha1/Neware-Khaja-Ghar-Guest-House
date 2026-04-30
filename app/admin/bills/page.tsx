"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Receipt, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";
import { format } from "date-fns";

interface Bill {
  _id: string; customer: { _id: string; name: string; email: string };
  roomCharges: number; orderCharges: number; tax: number; discount: number;
  totalAmount: number; status: string; createdAt: string;
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchBills = () => {
    const url = filter ? `/api/bills?status=${filter}` : "/api/bills";
    fetch(url).then((r) => r.json()).then(setBills).finally(() => setLoading(false));
  };
  useEffect(() => { fetchBills(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/bills/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) { toast.success(`Bill marked as ${status}`); fetchBills(); }
    else toast.error("Update failed");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bills</h1>
          <p className="text-muted-foreground mt-1">Manage guest billing</p>
        </div>
        <Link href="/admin/bills/generate">
          <Button className="gradient-primary text-white border-0"><Plus className="h-4 w-4 mr-2" /> Generate Bill</Button>
        </Link>
      </div>
      <div className="flex gap-2">
        {["", "unpaid", "paid", "partial"].map((s) => (
          <Button key={s} variant={filter === s ? "default" : "outline"} size="sm"
            onClick={() => setFilter(s)} className={filter === s ? "gradient-primary text-white border-0" : ""}>
            {s || "All"}
          </Button>
        ))}
      </div>
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />)}</div>
      ) : bills.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Receipt className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No bills found</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/50 bg-muted/30">
              <th className="text-left p-4 font-medium">Customer</th>
              <th className="text-left p-4 font-medium">Room</th>
              <th className="text-left p-4 font-medium">Orders</th>
              <th className="text-left p-4 font-medium">Tax</th>
              <th className="text-left p-4 font-medium">Total</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-border/50">
              {bills.map((b) => (
                <tr key={b._id} className="hover:bg-muted/20">
                  <td className="p-4">
                    <p className="font-medium">{b.customer?.name}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(b.createdAt), "MMM dd, yyyy")}</p>
                  </td>
                  <td className="p-4">Rs. {b.roomCharges.toLocaleString()}</td>
                  <td className="p-4">Rs. {b.orderCharges.toLocaleString()}</td>
                  <td className="p-4">Rs. {b.tax.toLocaleString()}</td>
                  <td className="p-4 font-bold">Rs. {b.totalAmount.toLocaleString()}</td>
                  <td className="p-4"><StatusBadge status={b.status as "unpaid"} /></td>
                  <td className="p-4">
                    <div className="flex gap-1.5">
                      <Link href={`/admin/bills/${b._id}`}>
                        <Button size="sm" variant="outline"><Eye className="h-3.5 w-3.5 mr-1" /> View</Button>
                      </Link>
                      {b.status === "unpaid" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(b._id, "paid")}>Mark Paid</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
