import { Product } from "../models/product.model.js";


export const createproduct = async({
        Name,
        Price,
        brandId,
        categoryId,
        Stock,
        Discount,
        Description,
        Barcode,
        Image,
        companyPrice,
        brandName
        }) => {
        try {
            const Products =  await Product.create({
            Name,
            Price,
            brandId,
            categoryId,
            brandName,
            Stock,
            companyPrice,
            Discount,
            Description,
            Barcode,
            Image
        })
        console.log("PRoduct created Successfull")
        return Products
      } catch (error) { 
        console.log("Error Creating product in service file", error.message)
        console.log({
            success : false,
            message : "Server error while creating product",
            error : error.message
        })        
    }
     }

     