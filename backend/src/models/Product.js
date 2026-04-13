import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    featured: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Product", productSchema);