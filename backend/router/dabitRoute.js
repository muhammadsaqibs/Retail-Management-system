import express from "express";
import { addDebt, getAllDebts, deleteDebt } from "../Controller/debitController.js";

const router = express.Router();

router.post("/add", addDebt);
router.get("/all", getAllDebts);
router.delete("/delete/:id", deleteDebt);

export default router;