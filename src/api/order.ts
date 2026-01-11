import { Router } from "express";
import {
  cancelOrder,
  createOrder,
  getOrder,
  getUserOrders,
} from "../application/order.js";

const orderRouter = Router();

orderRouter.route("/").post(createOrder).get(getUserOrders);
orderRouter.route("/:id/cancel").put(cancelOrder);
orderRouter.route("/:id").get(getOrder);

export default orderRouter;
