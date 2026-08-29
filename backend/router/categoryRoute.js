import express from "express";
import { Category } from "../models/Category.model.js";
const router = express.Router();

// 🔹 CREATE CATEGORY (Frontend calls /api/categories/add)
router.post("/add", async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) return res.status(400).json({ success: false, message: "Name required" });
    
    const category = await Category.create({ categoryName: categoryName.trim() });
    return res.status(201).json({ success: true, category });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 GET ALL (Frontend calls /api/categories/all)
router.get("/all", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.status(200).json(categories); // Seedha array bhej rahay hain taake frontend hang na ho
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router; // Fix: was 'route' before