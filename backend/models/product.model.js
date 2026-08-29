import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  brandName: { type: String, trim: true },
  Name: { type: String, required: true, trim: true },
  Price: { type: String, required: true },
  companyPrice : { type: String, required: true },
  Image: { type: String, default: "" },
  Stock: { type: String, default: "0" },
  Description: { type: String, default: "" },
  Discount: { type: String, default: "0" },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;