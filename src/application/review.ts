import { Request, Response } from "express";
import Product from "../infrastructure/db/entities/product.js";
import Review from "../infrastructure/db/entities/review.js";

const getAllReviews = async (req:Request, res:Response) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createReview = async (req: Request, res: Response) => {
  try {
    const reviewData = req.body;
    const { productId } = req.query;
    const newReview = await Review.create(reviewData);

    await Product.findByIdAndUpdate(productId, {
      $push: { reviews: newReview._id },
    });
    res.status(201).json({
      message: `Review created successfully for productId: ${productId}`,
      review: newReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reviewData = req.body;
    const updatedReview = await Review.findByIdAndUpdate(id, reviewData, {
      new: true,
    });
    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Error updating review" });
  }
};

const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { productId } = req.query;
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    await Product.findByIdAndUpdate(productId, {
      $pull: { reviews: id },
    });
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review" });
  }
};

export { getAllReviews, createReview, updateReview, deleteReview };
