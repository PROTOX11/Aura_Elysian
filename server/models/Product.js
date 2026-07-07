import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    images: { type: [String], default: [] },
    primaryImage: { type: String, default: "" },
    category: { type: String, default: "" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    theme: { type: String, default: "" },
    fragrance: { type: String, default: "" },
    weight: { type: String, default: "" },
    container: { type: String, default: "" },
    festival: { type: [String], default: [] },
    description: { type: String, default: "" },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AuraUser" },
  },
  { timestamps: true },
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);
