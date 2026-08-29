import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectMongo } from "./config/mongo.connect.js";

import categoryRoutes from "./router/categoryRoute.js";
import brandRoutes from "./router/brandRoute.js";
import productRoutes from "./router/productRoute.js";
import authuser from "./router/userRouter.js";
import staff from "./router/Staff.router.js";
import storeRouter from "./router/storeRouter.js"
import rentRouter from "./router/rentRouter.js"
import messageRouter from "./router/messageRouter.js"
import expenseRouter from "./router/expenseRouter.js"
import revenueRouter from "./router/revenuerouter.js"
import customerRouter from "./router/customerRoute.js"
import agencyRouter from "./router/agency.touter.js"
import Dashboard from "./router/Dashboard.js"
import dabitRouter from "./router/dabitRoute.js"
const app = express();

app.use(cookieParser());
app.use(cors({
  origin : "https://retail-management-system-imno.vercel.app",
  credentials : true
}))
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials : true
// }))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ status: "Backend running successfully on Railway" });
});

app.use("/api/auth", authuser);
app.use("/api/products", productRoutes);
app.use("/api/staff", staff);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/stores", storeRouter);
app.use("/api/rent", rentRouter);
app.use("/api/messages", messageRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/revenue", revenueRouter);
app.use("/api/customers", customerRouter);
app.use("/api/agencies", agencyRouter );
app.use("/api/debts", dabitRouter );
app.use("/api/dashboard" , Dashboard )
// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error: " + err.message });
});

const PORT = process.env.PORT || 5000;

// Connect to DB for Serverless environment (Vercel)
if (process.env.VERCEL) {
  connectMongo().catch(console.error);
} else {
  // Railway or Local environment
  const startServer = async () => {
    await connectMongo();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  };

  startServer().catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
}

export default app;
