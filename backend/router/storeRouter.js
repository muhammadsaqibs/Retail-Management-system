import express from "express"
const router = express.Router();
import mongoose from "mongoose";
import { protect } from "../middleware/auth.js";

// Model define kar rahe hain
const Store = mongoose.models.Store || mongoose.model("Store", new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  address: { type: String },
  shopType: { type: String },
  contact: { type: String, required: true },
  email: { type: String },
  password: { type: String, required: true }, 
  monthlyRent: { type: Number },
  createdAt: { type: String },
  status: { type: String, default: "Active" }
}));
 
// --- NEW: STORE LOGIN API ---
router.post("/login", async (req, res) => {
  const { name, password } = req.body;
  
  try {
    // 1. Check if store exists by Registered Name
    const store = await Store.findOne({ name: name });
    
    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found in database!" });
    }

    // 2. Check Password
    if (store.password !== password) {
      return res.status(401).json({ success: false, message: "Incorrect password for this store!" });
    }

    // 3. Check if Store is Active
    if (store.status !== "Active") {
      return res.status(403).json({ success: false, message: "This store is currently Inactive. Contact Admin." });
    }

    // 4. Success Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      _id: store._id,
      name: store.name,
      owner: store.owner,
      role: 'store'
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// API: Get all stores
router.get("/all", protect ,  async (req, res) => {
  try {
    const stores = await Store.find().sort({ _id: -1 });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API: Add store
router.post("/add", protect , async (req, res) => {
  try {
    const newStore = new Store(req.body);
    await newStore.save();
    res.status(201).json(newStore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API: Update store
router.put("/update/:id", protect ,  async (req, res) => {
  try {
    const updated = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API: Delete store
router.delete("/delete/:id", protect , async (req, res) => {
  try {
    await Store.findByIdAndDelete(req.params.id);
    res.json({ message: "Store deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;