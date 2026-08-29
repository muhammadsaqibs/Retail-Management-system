import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  categoryName: { type: String, required: true },
  brandName: { type: String, required: true, trim: true },
  Image: { type: String, default: "" },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);
export default Brand;