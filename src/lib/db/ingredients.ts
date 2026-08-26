import { prisma } from "@/lib/prisma"

export async function getAllIngredients() {
  return prisma.ingredient.findMany({ orderBy: { name: "asc" } })
}