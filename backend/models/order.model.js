import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  items: { type: [mongoose.Schema.Types.Mixed], default: [] },
  deliveryAddress: String,
  deliverAddress: String,
  totalAmount: { type: Number, required: true },
  TotalItems: Number,
  paymentMethod: String,
  status: { type: String, default: "ORDER_CONFIRMED" },
  statusHistory: { type: [mongoose.Schema.Types.Mixed], default: [] },
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;