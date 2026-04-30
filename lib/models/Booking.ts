import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBooking extends Document {
  customer: Types.ObjectId;
  room: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  status: "confirmed" | "checked-in" | "checked-out" | "cancelled";
  totalAmount: number;
  notes: string;
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, default: 1 },
    status: {
      type: String,
      enum: ["confirmed", "checked-in", "checked-out", "cancelled"],
      default: "confirmed",
    },
    totalAmount: { type: Number, required: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
