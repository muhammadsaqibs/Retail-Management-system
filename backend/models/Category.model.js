import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true, unique: true, trim: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;