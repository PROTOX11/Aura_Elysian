import mongoose from "mongoose";

const featuredCollectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    link: { type: String, default: "" },
    color: { type: String, default: "" },
    type: {
      type: String,
      enum: ["theme", "festival", "fragrance"],
      required: true,
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AuraUser" },
  },
  { timestamps: true },
);

export default mongoose.models.FeaturedCollection || mongoose.model("FeaturedCollection", featuredCollectionSchema);
