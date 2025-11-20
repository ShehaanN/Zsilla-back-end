import { Router } from "express";
import {
  addToCart,
  clearCart,
  getCart,
  getCartItemCount,
  removeCartItem,
  updateCartItem,
} from "../application/cart.js";

const cartRouter = Router();

cartRouter.route("/").get(getCart).post(addToCart);
cartRouter.route("/count").get(getCartItemCount);
cartRouter.route("/update/:productId)").put(updateCartItem);
cartRouter.route("/remove/:productId").delete(removeCartItem);
cartRouter.route("/clear").delete(clearCart);

export default cartRouter;
