import { uploadToCloudinary } from "../config/Cloudinary.js";
import { Staff } from "../models/Staff.model.js";
import { User } from "../models/user.model.js";
import {newStaff} from '../services/staff.services.js'
import mongoose from "mongoose";


export const CreateStaff = async (req, res) => {
  try {
    const {
      Name,
      FatherName,
      Designation,
      CNICnumber,
      MobileNumber,
      Address,
      Gender,
      bankHolderName,
      AccountNumber,
      BranchName,
      userId,
      email
    } = req.body;
    
    
    if (
      !Name || !FatherName || !Designation || !CNICnumber ||
      !MobileNumber || !Address || !Gender ||
      !BranchName || !email ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const StaffExists = await Staff.findOne({ CNICnumber });
    if (StaffExists) {
      return res.status(400).json({ message: "Staff already exists" });
    }
     
    const fetchUser = await User.findOne({ email });
    console.log('fetch find Email ', fetchUser)
    if(!fetchUser) return res.status(309).send("Use Correct Email for creating staff")
    let frontUrl = "";
    let backUrl = "";

    const frontFile = req.files?.IDFrontImage[0];
    const backFile = req.files?.IDBackImage[0];

    if (frontFile) {
      const uploadedFront = await uploadToCloudinary(frontFile);
      frontUrl = uploadedFront.url;
    }

    if (backFile) {
      const uploadedBack = await uploadToCloudinary(backFile);
      backUrl = uploadedBack.url;
    } 
    const staff = await newStaff({
      Name,
      FatherName,
      Designation,
      CNICnumber,
      MobileNumber,
      Address,
      Gender,
      email: fetchUser.email,
      bankHolderName,
      AccountNumber,
      userId : fetchUser._id,
      BranchName,
      IDFrontImage: frontUrl || '',
      IDBackImage: backUrl || '',
    });
    
    return res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: staff,
    });

  } catch (error) {
    console.error("Error Creating Staff", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteStaff =   async (req, res) => {
  try {
       const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid ID format" });
    const deleted = await Staff.findByIdAndDelete(id);
   
    if (!deleted) {
        console.log("Staff Not Found For Deleting this Id (error in controller file)")
        return res.status(404).json({ success: false, message: "Staff not found" });
    }
    
    console.log("Staff Deleted Successfully")
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export const getAllstaffs = async (req, res) => {
  try {
    const { staff, search } = req.query;
    const filter = {};
    if (staff) filter.Designation = staff;
    if (search) {
      filter.$or = [
        { Name: { $regex: search, $options: "i" } },
        { Designation: { $regex: search, $options: "i" } },
      ];
    }

    const staffs = await Staff.find(filter).sort({ createdAt: -1 });

    res.json({ success: true,  data: staffs });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}