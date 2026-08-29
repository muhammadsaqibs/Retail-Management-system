import mongoose from "mongoose";

const debtSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  products: { type: String, required: true }, // List of products taken on debt
  amount: { type: String, required: true },
  debtDate: { type: Date, default: Date.now },
  address: { type: String },
  contact: { type: String, required: true },
  expectedPayDate: { type: Date }, // On which date he will pay
  status: { type: String, enum: ["Pending", "Paid"], default: "Pending" }
}, { timestamps: true });

export const Debt = mongoose.models.Debt || mongoose.model("Debt", debtSchema);