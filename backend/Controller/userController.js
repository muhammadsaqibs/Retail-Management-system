import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {User} from "../models/user.model.js";
import { newUser } from "../services/user.service.js";
import { validationResult } from "express-validator";


export const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw res.status(400).json({ errors: errors.array() });
    }
    const { identifier , password, role } = req.body;
     
    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required" });
    }
    const hashed = await bcrypt.hash(password, 10);

    const {user , token} = await newUser({
      username: identifier || "",
      email: identifier || "",
      password: hashed,
      role,
    });
    

    res.cookie("token", token ,{
      httpOnly : true,
      secure : true,
      sameSite : "none",
    })
    res.status(201).json({ success: true, message: "User registered successfully", user });
  const template = { 
      userId : user.id,
      title: "welcome to Apexiums Reatail Management Portal",
      message : `${user.username || user.email} , your account has been successfully created with role ${user.role} , you can now explore our retail management system and enjoy seamless shopping experience!`,
      NotificationType : "login_alert"
    }
  } catch (err) {
    console.error(err);
    console.log("User registered error:", err.message)
    return res.status(500).json({ success: false, message: err.message });
  }
};
// Logout handler
export const logout = (req, res) => {
res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});
  console.log("Logout Successfull")
  return res.json({ success: true, message: "Logout successfully" });
  
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
