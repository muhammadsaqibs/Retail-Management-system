import { Product } from "../models/product.model.js";


export const createproduct = async({
        Name,
        Price,
        brandId,
        Stock,
        Discount,
        Description,
        Image,
        companyPrice,
        brandName
        }) => {
        try {
            const Products =  await Product.create({
            Name,
            Price,
            brandId,
            brandName,
            Stock,
            companyPrice,
            Discount,
            Description,
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

     