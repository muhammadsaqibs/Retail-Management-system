import express from "express";
import { addAgency, getAllAgencies, deleteAgency } from "../Controller/agencyController.js";

const router = express.Router();

router.post("/add", addAgency);
router.get("/all", getAllAgencies);
router.delete("/delete/:id", deleteAgency);

export default router;