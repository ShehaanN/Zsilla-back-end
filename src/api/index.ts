import { Router } from "express";
import productRouter from "./product.js";
import categoryRouter from "./category.js";
import reviewRouter from "./review.js";
import cartRouter from "./cart.js";

const rootRouter = Router();

rootRouter.use("/products", productRouter);
rootRouter.use("/categories", categoryRouter);
rootRouter.use("/reviews", reviewRouter);
rootRouter.use("/cart", cartRouter);

export default rootRouter;
