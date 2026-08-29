import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  Name: String,
  FatherName: String,
  email: String,
  Designation: String,
  CNICnumber: { type: String, required: true },
  MobileNumber: String,
  Address: String,
  Gender: { type: String, enum: ["Male", "Female"], default: "Male" },
  bankHolderName: String,
  AccountNumber: String,
  BranchName: String,
  IdCardFrontImage: String,
  IdCardBackImage: String,
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Staff = mongoose.models.Staff || mongoose.model("Staff", staffSchema);
export default Staff;