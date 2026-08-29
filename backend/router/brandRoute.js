import express from "express";
const router = express.Router();
import mongoose from "mongoose";

// Brand Model (Small Logic inside router as requested)
const Brand = mongoose.models.Brand || mongoose.model("Brand", new mongoose.Schema({
  brandName: { type: String, required: true }
}));  

// Path: /api/brands/all
router.get("/all", async (req, res) => {
  try {
    const brands = await Brand.find().sort({ _id: -1 });
    res.json(brands); // Seedha array bhej raha hai
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Path: /api/brands/add
router.post("/add", async (req, res) => {
  try {
    const newBrand = new Brand(req.body);
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;