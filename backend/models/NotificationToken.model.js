import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  title: String,
  message: String,
  NotificationType: String,
  status: { type: String, default: "PENDING" },
  deliveryStatuswebsocketsent: { type: Boolean, default: false },
  sentAt: Date,
  expiresAt: Date,
}, { timestamps: true });

export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export default Notification;