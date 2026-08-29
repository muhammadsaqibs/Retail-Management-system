import express from "express";
import multer from "multer";
import { createProduct, deleteProduct, getAllProducts, getproductById, getProducts, updateProduct } from "../Controller/productController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Frontend calls /api/products/add
router.post("/add", upload.single("Image"), createProduct);

// ✅ Frontend calls /api/products/all
router.get("/all", getAllProducts); 

router.get("/getproducts", getProducts); 
router.get("/:id", getproductById);  
router.put("/update/:id", updateProduct); 
router.delete("/delete/:id", deleteProduct);

export default router;