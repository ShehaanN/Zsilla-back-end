import { Router } from "express";
import productRouter from "./product.js";
import categoryRouter from "./category.js";
import reviewRouter from "./review.js";

const rootRouter = Router();

rootRouter.use("/products", productRouter);
rootRouter.use("/categories", categoryRouter);
rootRouter.use("/reviews", reviewRouter);

export default rootRouter;
