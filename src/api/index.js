import { Router } from "express";
import productRouter from "./product.js";
import categoryRouter from "./category.js";

const rootRouter = Router();

rootRouter.use("/products", productRouter);
rootRouter.use("/categories", categoryRouter);

export default rootRouter;
