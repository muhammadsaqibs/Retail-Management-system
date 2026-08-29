import express, { Router } from "express";
const router = express.Router();
import { CreateStaff, deleteStaff, getAllstaffs } from "../Controller/Staff.controller.js";
import multer from "multer";

const upload  = multer({storage : multer.memoryStorage() })

router.post("/create" ,upload.fields([
    {name :"IDFrontImage" , maxCount : 1},
    {name :"IDBackImage" , maxCount : 1},

]) , CreateStaff)

router.get("/" , getAllstaffs )
router.delete('/:id' , deleteStaff)

export default router;
