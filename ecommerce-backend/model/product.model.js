const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["electronics", "clothing", "furniture", "accessories", "other"],
      lowercase: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    }  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
    