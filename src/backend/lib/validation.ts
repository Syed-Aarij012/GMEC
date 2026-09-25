import { z } from "zod";

export const shippingSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  line1: z.string().min(3, "Enter your address"),
  line2: z.string().optional(),
  city: z.string().min(2, "Enter your city"),
  postcode: z.string().min(3, "Enter your postcode"),
  country: z.string().min(2),
  phone: z.string().optional(),
});

export type ShippingInput = z.infer<typeof shippingSchema>;

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "Your basket is empty"),
  shipping: shippingSchema,
  paymentMethod: z.enum(["stripe", "paypal"]).default("stripe"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().optional(),
  message: z.string().min(10, "Please add a little more detail"),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10, "Please add a little more detail"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Enter a product name"),
  slug: z.string().min(2, "Enter a URL slug"),
  sku: z.string().min(2, "Enter a SKU"),
  description: z.string().min(10, "Enter a description"),
  shortDescription: z.string().optional().nullable(),
  price: z.number().positive("Price must be greater than 0"),
  compareAtPrice: z.number().positive().optional().nullable(),
  categoryId: z.string().min(1, "Choose a category"),
  fitting: z.string().optional().nullable(),
  wattage: z.string().optional().nullable(),
  colour: z.string().optional().nullable(),
  stock: z.number().int().min(0),
  featured: z.boolean(),
  images: z.array(z.string()).optional(),
});

export const blogPostSchema = z.object({
  title: z.string().min(2, "Enter a title"),
  slug: z.string().min(2, "Enter a URL slug"),
  excerpt: z.string().min(10, "Enter a short excerpt"),
  content: z.string().min(20, "Enter the post content"),
  coverImage: z.string().min(1, "Add a cover image"),
  author: z.string().min(1).optional(),
  published: z.boolean(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Enter a category name"),
  slug: z.string().min(2, "Enter a URL slug"),
  description: z.string().optional().nullable(),
});
