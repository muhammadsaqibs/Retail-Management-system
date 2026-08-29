import mongoose from "mongoose";

const agencySchema = new mongoose.Schema({
  agencyName: { type: String, required: true, trim: true },
  contactPerson: { type: String }, // Banday ka naam jise baat hoti hai
  contactNumber: { type: String, required: true },
  address: { type: String },
  description: { type: String }, // Kaunsi products supply karte hain
  totalBalance: { type: String, default: "0" }, // Kitne paise agency ko dene hain
}, { timestamps: true });

export const Agency = mongoose.models.Agency || mongoose.model("Agency", agencySchema);