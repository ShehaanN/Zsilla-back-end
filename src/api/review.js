import { Router } from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  updateReview,
} from "../application/review.js";

const reviewRouter = Router();

reviewRouter.route("/").get(getAllReviews).post(createReview);
reviewRouter.route("/:id").put(updateReview).delete(deleteReview);

export default reviewRouter;
