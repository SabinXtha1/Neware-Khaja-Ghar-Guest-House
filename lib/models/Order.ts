import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  customer: Types.ObjectId;
  booking?: Types.ObjectId;
  room?: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "preparing" | "delivered" | "cancelled";
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    room: { type: Schema.Types.ObjectId, ref: "Room" },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "preparing", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
