import express from "express";
import mongoose from "mongoose";

// Models Import (Assuming they exist based on our previous conversations)
import { Product } from "../models/product.model.js";
import { Debt } from "../models/dabit.model.js";
import { Agency } from "../models/agency.model.js";
import { Rent } from "../router/rentRouter.js";
import { Order } from "../models/order.model.js";

const router = express.Router();

// ==========================================
// DASHBOARD STATS CONTROLLER
// ==========================================

router.get("/stats", async (req, res) => {
  try {
    const { month, storeId, role } = req.query;

    // --- ADMIN STATS LOGIC ---
    if (role === "admin") {
      // 1. Total Stores (Using Rent collection unique stores or a Store model if you have one)
      const totalStores = await Rent.distinct("storeName");

      // 2. Monthly Rent (Expected)
      const rentData = await Rent.aggregate([
        { $match: { month: month } },
        { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
      ]);

      // 3. Defaulters (Status Pending for selected month)
      const defaultersCount = await Rent.countDocuments({ month: month, status: "Pending" });

      // 4. Total Revenue (Admin perspective: Total Collected Rent)
      const collectedRent = await Rent.aggregate([
        { $match: { month: month, status: "Paid" } },
        { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
      ]);

      return res.status(200).json({
        success: true,
        stats: {
          totalStores: totalStores.length,
          monthlyRent: rentData[0]?.total || 0,
          totalRevenue: collectedRent[0]?.total || 0,
          defaulters: defaultersCount
        }
      });
    }

    // --- STORE STATS LOGIC ---
    else if (role === "store") {
      // Note: In production, filter by storeId. 
      // For now, calculating based on global data for your current setup.

      // 1. Total Products
      const totalProducts = await Product.countDocuments();

      // 2. Total Debt (Customer Udhaar)
      const debtData = await Debt.aggregate([
        { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
      ]);

      // 3. Total Agencies
      const totalAgencies = await Agency.countDocuments();

      // 4. Profit/Revenue Logic (Using Product model prices as example)
      // Real revenue would come from a "Sales/Orders" collection.
      const productStats = await Product.aggregate([
        {
          $group: {
            _id: null,
            totalSellingValue: { $sum: { $multiply: [{ $toDouble: "$Price" }, { $toDouble: "$Stock" }] } },
            totalCostValue: { $sum: { $multiply: [{ $toDouble: "$companyPrice" }, { $toDouble: "$Stock" }] } }
          }
        }
      ]);

      const revenue = productStats[0]?.totalSellingValue || 0;
      const cost = productStats[0]?.totalCostValue || 0;

      const totalOrders = await Order.countDocuments();

      let storeStatus = "Active";
      if (storeId && mongoose.models.Store) {
         const store = await mongoose.models.Store.findById(storeId);
         if (store) storeStatus = store.status || "Active";
      }

      return res.status(200).json({
        success: true,
        stats: {
          storeStatus: storeStatus,
          totalRevenue: revenue,
          netProfit: revenue - cost,
          totalDebt: debtData[0]?.total || 0,
          totalProducts: totalProducts,
          totalAgencies: totalAgencies,
          totalOrders: totalOrders, 
          totalWholesalers: 0, 
          totalExpense: 0, 
          totalStaff: 0    
        }
      });
    }

    else {
      return res.status(400).json({ success: false, message: "Invalid Role" });
    }

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;