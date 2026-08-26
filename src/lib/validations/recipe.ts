import z from "zod/v4";
import { capitalizeFirst } from "../utils/capitalize";

export const recipeSchema = z.object({
    title: z.string().transform(capitalizeFirst),
    duration: z.string(),
    img: z.string().optional(),
    ingredients: z.array(
      z.object({
        name: z.string().transform(capitalizeFirst),
        quantity: z.string()
      })
    ).min(1),
    categories: z.array(z.string().min(1).transform(capitalizeFirst)),
    steps: z.array(
      z.object({
        stepNumber: z.number(),
        description: z.string().transform(capitalizeFirst)
      })
    ).min(1)
})

export const updateRecipeSchema = z.object({
    title: z.string().transform(capitalizeFirst).optional(),
    duration: z.string().optional(),
    img: z.string().nullable().optional(),
    ingredients: z.array(
      z.object({
        name: z.string().transform(capitalizeFirst),
        quantity: z.string()
      })
    ).min(1).optional(),
    categories: z.array(z.string().min(1).transform(capitalizeFirst)).optional(),
    steps: z.array(
      z.object({
        stepNumber: z.number(),
        description: z.string().transform(capitalizeFirst)
      })
    ).min(1).optional()
})

