import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ==========================================
// 1. MODEL
// ==========================================
const branchSchema = new mongoose.Schema({
  branchName: { type: String, required: true, trim: true, unique: true },
  managerName: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  status: { type: String, enum: ["Active", "Closed"], default: "Active" },
  openingDate: { type: String, default: "" }
}, { timestamps: true });

const Branch = mongoose.models.Branch || mongoose.model("Branch", branchSchema);

// ==========================================
// 2. CONTROLLERS
// ==========================================

// Add Branch
router.post("/add", async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json({ success: true, data: branch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get All Branches
router.get("/all", async (req, res) => {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: branches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Branch
router.delete("/delete/:id", async (req, res) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Branch deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;