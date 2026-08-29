import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  // updateOrderStatus,
  // getAllOrders,
  // sendBulkNotification
} from "../controllers/orderController.js";

import { protect , adminOnly } from "../middleware/auth.js";

const router = express.Router();

// ---------------- USER order related ROUTES ----------------
router.post("/create", protect, createOrder);         // User places order (when user create an order in app to call this route)
router.get('/' , protect ,adminOnly , getAllOrders)
router.get("/my-orders", protect, getMyOrders);       // User's own orders list (user seen all order status in app)
router.get("/:id", protect, getOrderById);            // User order detail for admin dashboard
// // ---------------- ADMIN ROUTES ----------------
// router.post('/bulknotifiaction' , protect , adminOnly , sendBulkNotification ) // when give any announcement to all users on the dashboard this function call  
// router.put("/update-status/:id", protect, adminOnly , updateOrderStatus); // Admin update status
// router.get("/admin/all", protect, adminOnly , getAllOrders);              // Admin get all orders

export default router;
