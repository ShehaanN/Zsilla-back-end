import { Router } from "express";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../application/category.js";

const categoryRouter = Router();

categoryRouter.route("/").get(getAllCategories).post(createCategory);

categoryRouter
  .route("/:id")
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

export default categoryRouter;
