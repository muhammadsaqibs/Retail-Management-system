import express from "express";
const router = express.Router();
import mongoose from "mongoose";

// Models (Humein Sale aur Expense dono ka data chahiye)
const Sale = mongoose.model("Sale", new mongoose.Schema({
  amount: Number,
  date: { type: Date, default: Date.now }
}));

const Expense = mongoose.model("Expense"); // Pehle se bana hua model use karega

// API: Get Revenue Analytics
router.get("/stats", async (req, res) => {
  try {
    // 1. Total Revenue Calculate karein (Sum of all sales)
    const salesData = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = salesData[0]?.total || 0;

    // 2. Total Expenses Calculate karein
    const expenseData = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalExpense = expenseData[0]?.total || 0;

    // 3. Net Profit
    const netProfit = totalRevenue - totalExpense;

    // 4. Monthly Data for Chart (Aggregation by Month)
    const monthlyStats = await Sale.aggregate([
      {
        $group: {
          _id: { $month: "$date" },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      totalRevenue,
      netProfit,
      avgOrderValue: totalRevenue > 0 ? (totalRevenue / 50).toFixed(2) : 0, // 50 dummy count
      monthlyData: monthlyStats.map(item => ({
        name: new Date(2024, item._id - 1).toLocaleString('default', { month: 'short' }),
        revenue: item.revenue,
        profit: item.revenue * 0.4 // Dummy profit margin for chart
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;