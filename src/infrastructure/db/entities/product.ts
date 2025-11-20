import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    brand: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    sizes: {
      type: [String],
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
    discount: {
      type: Number,
      required: false,
      min: 0,
      max: 100,
      default: 0,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      required: false,
      default: false,
    },
    reviews: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Review",
      default: [],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
