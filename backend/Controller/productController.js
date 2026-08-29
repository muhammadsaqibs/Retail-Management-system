import { uploadToCloudinary } from "../config/Cloudinary.js";
import { Product } from "../models/product.model.js";
import { createproduct } from "../services/product.service.js";
import { Brand } from "../models/brand.model.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
  try {
    // 1. categoryId ko bhi nikaalein req.body se
    const { Name, Price, brandName, companyPrice , categoryId, Stock, Discount, Description } = req.body;

    // Validation
    if (!Name || Price == null || !brandName || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (Name, Price, Brand, or Category)",
      });
    }

    const existingProduct = await Product.findOne({ Name });
    if (existingProduct) {
      return res.status(409).json({ message: "Product already exists" });
    }

    const fetchExistingBrand = await Brand.findOne({ brandName });
    if (!fetchExistingBrand) return res.status(309).send("Cannot Fetch brand");

    let imageUrl = "";
    if (req.file) {
      try {
        const uploadRes = await uploadToCloudinary(req.file);
        imageUrl = uploadRes?.url || "";
      } catch (uploadErr) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload image",
          error: uploadErr.message,
        });
      }
    }

    // 2. categoryId ko service mein pass karein
    const product = await createproduct({
      Name,
      Price,
      brandId: fetchExistingBrand._id,
      categoryId: categoryId, // Pass categoryId here
      Stock,
      companyPrice,
      brandName: fetchExistingBrand.brandName,
      Discount,
      Description,
      Image: imageUrl || "",
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
export const updateProduct = async (req,res)=>{
    try{
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({success : false , message : "Invalid ID Format"})
        }
        const updatedProduct = await Product.findByIdAndUpdate(id , req.body ,
            {new : true,
            runValidators : true
            })
          if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });
          res.status(200).json({success : true , message : "Product Updated Successfully" , data: updatedProduct})
        }catch(error){
            res.status(500).json({success : false , message : "Server Error while updating a  Product"})
        }

}    

export const deleteProduct =   async (req, res) => {
  try {
       const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid ID format" });
    const deleted = await Product.findByIdAndDelete(id);
   
    if (!deleted) {
        console.log("Product Not Found For Deleting this Id (error in controller file)")
        return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    console.log("Product Deleted Successfully")
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// get all Product for user and admin both 
export const getAllProducts = async (req, res) => {
  try {
    const { category, brand, search } = req.query;
    let filter = {};

    if (category) filter.categoryName = category;
    if (brand) filter.brandName = brand;
    if (search) {
      filter.$or = [
        { Name: { $regex: search, $options: "i" } },
        { Description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter)
    console.log(products)
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
// get Products with Filters and search
export const getProducts = async (req,res)=>{
    try {
        const { categoryName, brandName, search } = req.query;
        let filter = {};
        if (categoryName) filter.categoryName = categoryName;
        if (brandName) filter.brandName = brandName;
      if (search) {
          filter.$or = [
            { Name: { $regex: search, $options: "i" } },
            { Description: { $regex: search, $options: "i" } },
          ];
        }
         console.log("Applied Filter:", filter);
        
        const products = await Product.find(filter)
          .sort({ createdAt: -1 });
        res.json({ success: true, count: products.length, data: products });

      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Server error" });
      }
}

// if You get single Product this function call you  
export const getproductById = async (req,res)=>{
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, message: "Invalid ID format" });
        }
        
        const product = await Product.findById(id);
    
        if (!product) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }
    
        res.json({ success: true, data: product });
      } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ success: false, message: "Server error" });
      }
}
