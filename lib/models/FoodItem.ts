import mongoose, { Schema, Document } from "mongoose";

export interface IFoodItem extends Document {
  name: string;
  price: number;
  category: "Food" | "Beverage" | "Snacks" | "Other";
  isAvailable: boolean;
  imageUrl: string;
}

const FoodItemSchema = new Schema<IFoodItem>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ["Food", "Beverage", "Snacks", "Other"],
      default: "Food",
    },
    isAvailable: { type: Boolean, default: true },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.FoodItem || mongoose.model<IFoodItem>("FoodItem", FoodItemSchema);
