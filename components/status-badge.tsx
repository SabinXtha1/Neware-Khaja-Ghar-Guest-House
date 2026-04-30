import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusType =
  | "available"
  | "occupied"
  | "maintenance"
  | "confirmed"
  | "checked-in"
  | "checked-out"
  | "cancelled"
  | "pending"
  | "preparing"
  | "delivered"
  | "unpaid"
  | "paid"
  | "partial";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" },
  occupied: { label: "Occupied", className: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/20" },
  maintenance: { label: "Maintenance", className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20" },
  confirmed: { label: "Confirmed", className: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20" },
  "checked-in": { label: "Checked In", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" },
  "checked-out": { label: "Checked Out", className: "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20" },
  cancelled: { label: "Cancelled", className: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/20" },
  pending: { label: "Pending", className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20" },
  preparing: { label: "Preparing", className: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20" },
  delivered: { label: "Delivered", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" },
  unpaid: { label: "Unpaid", className: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/20" },
  paid: { label: "Paid", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" },
  partial: { label: "Partial", className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: StatusType;
  className?: string;
}) {
  const config = statusConfig[status] || { label: status, className: "" };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium text-xs", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
