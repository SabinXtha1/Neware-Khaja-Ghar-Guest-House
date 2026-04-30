import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  roomNumber: string;
  type: "single" | "double" | "deluxe" | "suite";
  price: number;
  status: "available" | "occupied" | "maintenance";
  floor: number;
  amenities: string[];
  description: string;
  createdAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ["single", "double", "deluxe", "suite"], required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ["available", "occupied", "maintenance"], default: "available" },
    floor: { type: Number, required: true },
    amenities: [{ type: String }],
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);
