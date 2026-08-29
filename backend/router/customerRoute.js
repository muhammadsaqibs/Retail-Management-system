import express  from "express";
const router = express.Router();
import mongoose  from "mongoose";

// Customer Status Model
const CustomerStatus = mongoose.model("CustomerStatus", new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  status: { type: String, enum: ["Silver", "Gold", "Platinum", "VIP"], default: "Silver" },
  totalSpent: { type: Number, required: true },
  lastVisit: { type: String, required: true }
}));

// API: Get all customers status
router.get("/all", async (req, res) => {
  try {
    const customers = await CustomerStatus.find().sort({ totalSpent: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API: Add new customer entry
router.post("/add", async (req, res) => {
  try {
    const newCustomer = new CustomerStatus(req.body);
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API: Update status
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await CustomerStatus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API: Delete customer from list
router.delete("/delete/:id", async (req, res) => {
  try {
    await CustomerStatus.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer removed from status list" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;