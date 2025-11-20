import express, { NextFunction, Request, Response } from "express";
import Cart from "../infrastructure/db/entities/Cart.js";
import { addToCartDTO, updateCartItemDTO } from "../domain/dto/cart.js";
import ValidationError from "../domain/errors/validation-error.js";
import Product from "../infrastructure/db/entities/product.js";
import NotFoundError from "../domain/errors/not-found-error.js";

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = "123";
    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
      await cart.populate("items.productId");
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    next(error);
  }
};

const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = "123";
    const result = addToCartDTO.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError("Invalid cart data" + result.error.message);
    }
    const { productId, quantity, size } = result.data;

    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (product.stock < quantity) {
      throw new ValidationError(
        `Insufficient stock available. Only ${product.stock} items left.`
      );
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      if (newQuantity > product.stock) {
        throw new ValidationError(`Not enough stock available`);
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        size,
        stock: product.stock,
      });
    }

    const savedCart = await cart.save();
    res.status(201).json({ success: true, data: savedCart });
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = "123";
    const { productId } = req.params;

    let size: string | undefined = req.query.size as string | undefined;

    size = size === "undefined" || size === "" ? undefined : size;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    const initialLength = cart.items.length;

    const itemsToRemove = cart.items.filter((item) => {
      const productMatch = item.productId.toString() === productId;
      const sizeMatch =
        (size === undefined && item.size === undefined) ||
        (size !== undefined && item.size === size);

      return productMatch && sizeMatch;
    });

    if (itemsToRemove.length === 0) {
      throw new NotFoundError("Item not found in cart ");
    }

    itemsToRemove.forEach((itemToRemove) => {
      cart.items.pull(itemToRemove._id);
    });

    if (cart.items.length === initialLength) {
      throw new NotFoundError("Item not found in cart ");
    }

    const updatedCart = await cart.save();
    await updatedCart.populate("items.productId");

    res.json({
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = "123";
    const { productId } = req.params;

    const result = updateCartItemDTO.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError("Invalid update data");
    }

    const { quantity, size, color } = result.data;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    const itemIndex = cart.items.findIndex((item) => {
      const productMatch = item.productId.toString() === productId;

      const sizeMatch =
        (size === undefined && item.size === undefined) ||
        (size !== undefined && item.size === size);

      return productMatch && sizeMatch;
    });

    if (itemIndex === -1) {
      throw new NotFoundError("Item not found in cart ");
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(productId);
      if (!product) {
        throw new NotFoundError("Product not found");
      }

      if (quantity > product.stock) {
        throw new ValidationError(`Insufficient stock`);
      }

      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = product.price;
      cart.items[itemIndex].stock = product.stock;
    }

    const updatedCart = await cart.save();
    await updatedCart.populate("items.productId");

    res.json({
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = "123";

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    cart.items.splice(0, cart.items.length);
    const clearedCart = await cart.save();

    res.json({
      success: true,
      data: clearedCart,
    });
  } catch (error) {
    next(error);
  }
};

const getCartItemCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = "123";

    if (!userId) {
      return res.json({
        success: true,
        itemCount: 0,
      });
    }

    const cart = await Cart.findOne({ userId });
    const itemCount = cart ? cart.totalItems : 0;

    res.json({
      success: true,
      itemCount,
    });
  } catch (error) {
    res.json({
      success: false,
      itemCount: 0,
      error: "Failed to get cart count",
    });
  }
};

export {
  getCart,
  addToCart,
  removeCartItem,
  updateCartItem,
  clearCart,
  getCartItemCount,
};
