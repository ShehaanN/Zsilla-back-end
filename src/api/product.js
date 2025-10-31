import { Router } from "express";

const productRouter = Router();

productRouter.get("/", (req, res) => {
  res.status(200).send("Product / API is working");
});

export default productRouter;
