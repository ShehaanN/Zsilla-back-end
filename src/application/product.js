import Product from "../infrastructure/db/entities/product.js";
import Review from "../infrastructure/db/entities/review.js";

const getAllProducts = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const products = await Product.find(
      categoryId ? { categoryId } : {}
    ).populate({
      path: "reviews",
      select: "comment rating",
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("categoryId", "name")
      .populate({
        path: "reviews",
        select: "comment rating",
      });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const createProduct = await Product.create(productData);
    res.status(201).json(createProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, productData, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

export {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
