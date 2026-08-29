import express from "express";
import { registerUser, logout, getAllUsers, loginUser } from "../Controller/userController.js";
import { body } from 'express-validator';
import { protect } from "../middleware/auth.js";
import User from "../models/user.model.js"; // User model lazmi import karein
import bcrypt from "bcryptjs"; // Password compare karne ke liye

const router = express.Router();

// 1. Existing Routes
router.post('/signup', [
  body('identifier').notEmpty().withMessage('Email or username required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], registerUser);

router.post('/login', loginUser);

router.post('/logout', logout);

router.get('/users', getAllUsers);

router.get("/check", protect, (req, res) => {
  res.status(200).json({ authenticated: true, user: req.user });
});

// --- NEW ROUTES FOR ADMINISTRATOR PAGE ---

// 2. Update Profile (Username/Email)
router.put("/update-profile", protect, async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 3. Change Password
router.put("/change-password", protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Old password verify karein (bcrypt use karte hue)
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Naya password set karein (User model ka 'pre-save' hook hash kar dega)
    // Agar hook nahi hai, to yahan manually hash karein:
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;