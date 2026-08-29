import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, default: "" },
  email: { type: String, default: "", lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["admin", "user"], default: "user" },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;