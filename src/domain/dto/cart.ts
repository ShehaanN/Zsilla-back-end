import { z } from "zod";

const addToCartDTO = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity cannot exceed 100"),
  size: z.string().optional(),
  color: z.string().optional(),
});

const updateCartItemDTO = z.object({
  quantity: z
    .number()
    .min(0, "Quantity cannot be negative")
    .max(100, "Quantity cannot exceed 100"),
  size: z.string().optional(),
  color: z.string().optional(),
});

export { addToCartDTO, updateCartItemDTO };
