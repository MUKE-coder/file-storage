import { z } from "zod";

export const BaseCategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  image: z.string(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const CategoryCreateSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  image: z.string(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});
export const FormCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Category = z.infer<typeof BaseCategorySchema>;
export type CategoryCreateData = z.infer<typeof CategoryCreateSchema>;
export type DashboardCategory = Category & {
  productsCount: number;
};
export type FormCategory = z.infer<typeof FormCategorySchema>;
