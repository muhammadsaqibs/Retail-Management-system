import express from "express";
const router = express.Router();
import mongoose from "mongoose";

// Message Model
const Message = mongoose.model("Message", new mongoose.Schema({
  recipient: { type: String, required: true }, // "all" ya Store ID
  recipientName: { type: String, required: true }, // "All Stores" ya Store Name
  text: { type: String, required: true },
  type: { type: String, enum: ["broadcast", "individual"], default: "individual" },
  createdAt: { type: String, default: () => new Date().toLocaleString() }
}));

// API: Send Message
router.post("/send", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API: Get All Messages (Admin ke liye history)
router.get("/history", async (req, res) => {
  try {
    const history = await Message.find().sort({ _id: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API: Get Messages for a specific Store
// (Ye API store login hone ke baad unke dashboard par use hogi)
router.get("/store/:id", async (req, res) => {
  try {
    // Store ko wo messages dikhao jo "all" hain ya unki apni ID par hain
    const messages = await Message.find({
      $or: [{ recipient: "all" }, { recipient: req.params.id }]
    }).sort({ _id: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API: Delete History
router.delete("/delete/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;