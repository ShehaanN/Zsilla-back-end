import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import ValidationError from "../domain/errors/validation-error.js";
import Address from "../infrastructure/db/entities/Address.js";
import Order from "../infrastructure/db/entities/Order.js";
import NotFoundError from "../domain/errors/not-found-error.js";
import UnauthorizedError from "../domain/errors/unauthorized-error.js";
import Product from "../infrastructure/db/entities/product.js";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const userId = "123";
    if (!userId) {
      throw new ValidationError("User not authenticated");
    }

    if (!data.items) {
      throw new ValidationError("No items found");
    }

    if (!data.shippingAddress) {
      throw new ValidationError("Shipping address is required");
    }

    const addressData = {
      line1: data.shippingAddress.line1.trim(),
      line2: data.shippingAddress.line2?.trim() || "",
      city: data.shippingAddress.city.trim(),
      phone: data.shippingAddress.phone.trim(),
    };

    const address = await Address.create(addressData);

    await Order.create({
      userId,
      items: data.items,
      addressId: address._id,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === "COD" ? "PENDING" : "PENDING",
      orderStatus: data.paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    next(error);
  }
};

const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = "123";
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("addressId")
      .populate("items.productId");
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    if (order.userId !== userId) {
      throw new UnauthorizedError("Unauthorized to access this order");
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    next(error);
  }
};

const getUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = "123";
    const orders = await Order.find({ userId })
      .populate("addressId")
      .populate("items.productId")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders, count: orders.length });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = "123";
    const orderId = req.params.id;
    if (!userId) {
      throw new UnauthorizedError("User not authenticated");
    }

    if (!orderId || orderId === "undefined") {
      throw new ValidationError("Valid order ID is required");
    }

    const order = await Order.findById(orderId).populate("items.productId");

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.userId !== userId) {
      throw new UnauthorizedError("Unauthorized to cancel this order");
    }

    if (order.orderStatus === "SHIPPED" || order.orderStatus === "FULFILLED") {
      throw new ValidationError(
        "Cannot cancel an order , that is already shipped or fulfilled"
      );
    }

    if (order.orderStatus === "CANCELLED") {
      throw new ValidationError("Order is already cancelled");
    }

    for (const item of order.items) {
      const product = await Product.findById(
        item.productId._id || item.productId
      );

      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    const updateData: any = {
      orderStatus: "CANCELLED",
      cancelledAt: new Date(),
      updatedAt: new Date(),
    };

    if (order.paymentStatus === "PAID") {
      updateData.paymentStatus = "REFUNDED";
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    })
      .populate("items.productId")
      .populate("addressId");

    res.status(200).json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export { createOrder, getOrder, getUserOrders, cancelOrder };
