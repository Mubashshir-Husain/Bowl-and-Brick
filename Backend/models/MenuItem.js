import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String, required: true
        },
        category: {
            type: String,
            enum: ["Starter", "Main Course", "Dessert", "Beverage"],
            required: true,
        },
        type: {
            type: String,
            enum: ["Veg", "Non-Veg", "Vegan"],
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String
        },
        spiceLevel: {
            type: String,
            enum: ["Low", "Medium", "High"]
        },
        ingredients: [{ type: String }],
        available: {
            type: Boolean,
            default: true
        },
    },
    { timestamps: true },
);

export default mongoose.model("MenuItem", menuItemSchema);
