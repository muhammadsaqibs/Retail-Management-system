import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ==========================================
// 1. MODELS (Rent & Store)
// ==========================================

const rentSchema = new mongoose.Schema({
  storeName: { 
    type: String, 
    required: [true, "Store name is required"],
    trim: true 
  },
  month: { 
    type: String, 
    required: [true, "Month is required"],
    trim: true 
  },
  amount: { 
    type: Number, 
    required: [true, "Amount is required"] 
  },
  status: { 
    type: String, 
    enum: ["Pending", "Paid"], 
    default: "Pending" 
  },
  paymentDate: { 
    type: String, // String format to match HTML date input (YYYY-MM-DD)
    default: "" 
  }
}, { timestamps: true });

export const Rent = mongoose.models.Rent || mongoose.model("Rent", rentSchema);

// Store Model (For the store list dropdown in your JSX)
const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});
const Store = mongoose.models.Store || mongoose.model("Store", storeSchema);


// ==========================================
// 2. CONTROLLERS
// ==========================================

// --- RENT CONTROLLERS ---

// Get All Rents
const getAllRents = async (req, res) => {
  try {
    const rents = await Rent.find().sort({ createdAt: -1 });
    res.status(200).json({
      data : rents,
      success : true
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching rent records", error: error.message });
  }
};

// Add New Rent
const addRent = async (req, res) => {
  try {
    const { storeName, month, amount, status, paymentDate } = req.body;
    
    if (!storeName || !month || !amount) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const newRent = new Rent({ storeName, month, amount, status, paymentDate });
    const savedRent = await newRent.save();
    res.status(201).json(savedRent);
  } catch (error) {
    res.status(500).json({ message: "Error saving rent record", error: error.message });
  }
};

// Update Rent
const updateRent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const updatedRent = await Rent.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedRent) return res.status(404).json({ message: "Record not found" });
    
    res.status(200).json(updatedRent);
  } catch (error) {
    res.status(500).json({ message: "Error updating rent record", error: error.message });
  }
};

// Delete Rent
const deleteRent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Rent.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });
    
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting record", error: error.message });
  }
};

// --- STORE CONTROLLERS (For your dropdown) ---

const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find().sort({ name: 1 });
    console.log("stores" , stores)
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stores" });
  }
};

// Helper route to add stores (Optional)
const addStore = async (req, res) => {
  try {
    const newStore = await Store.create(req.body);
    res.status(201).json(newStore);
  } catch (error) {
    res.status(500).json({ message: "Error adding store" });
  }
};


// ==========================================
// 3. ROUTES DEFINITION
// ==========================================

// Rent Routes
router.get("/all", getAllRents);
router.post("/add", addRent);
router.put("/update/:id", updateRent);
router.delete("/delete/:id", deleteRent);

// Store Routes (Matches your axiosInstance.get("/stores/all"))
// In your main app.js, you might need to prefix this with /api/stores
// But for simplicity in one file, we can define them here or separately.
// Logic for your frontend:
router.get("/stores-list", getAllStores); // You can mount this at /api/stores/all

export { Store }; // Exporting Store model to use in other files if needed
export default router;