import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../application/product.js";

const productRouter = Router();

productRouter.route("/").get(getAllProducts).post(createProduct);
productRouter
  .route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default productRouter;
