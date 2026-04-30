import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBill extends Document {
  customer: Types.ObjectId;
  booking?: Types.ObjectId;
  orders: Types.ObjectId[];
  roomCharges: number;
  orderCharges: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: "unpaid" | "paid" | "partial";
  paidAt?: Date;
  createdAt: Date;
}

const BillSchema = new Schema<IBill>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    roomCharges: { type: Number, default: 0 },
    orderCharges: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["unpaid", "paid", "partial"], default: "unpaid" },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Bill || mongoose.model<IBill>("Bill", BillSchema);
