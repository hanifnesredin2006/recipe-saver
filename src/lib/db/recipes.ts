import { prisma } from "@/lib/prisma"
import type { RecipeWhereInput, RecipeOrderByInput } from "@/types"

interface GetRecipesOptions {
  search?: string
  category?: string
  sort?: string
  order?: string
  page?: number
  limit?: number
}

export async function getRecipesForUser(userId: number, options: GetRecipesOptions = {}) {
  const {
    search = "",
    category = "",
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 8,
  } = options

  const skip = (page - 1) * limit

  const where: RecipeWhereInput = { userId }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      {
        ingredients: {
          some: {
            ingredient: {
              name: { contains: search.toLowerCase(), mode: "insensitive" },
            },
          },
        },
      },
    ]
  }

  if (category) {
    where.categories = {
      some: { category: { title: { equals: category, mode: "insensitive" } } },
    }
  }

  const orderBy: RecipeOrderByInput = {}
  if (sort === "createdAt") orderBy.createdAt = order as "asc" | "desc"
  else if (sort === "title") orderBy.title = order as "asc" | "desc"
  else if (sort === "duration") orderBy.duration = order as "asc" | "desc"

  const [total, recipes] = await Promise.all([
    prisma.recipe.count({ where }),
    prisma.recipe.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        ingredients: { include: { ingredient: true } },
        categories: { include: { category: true } },
        steps: { orderBy: { stepNumber: "asc" } },
      },
    }),
  ])

  return {
    data: recipes,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  }
}

export async function getRecipeForUser(userId: number, recipeId: number) {
  return prisma.recipe.findFirst({
    where: { id: recipeId, userId },
    include: {
      ingredients: { include: { ingredient: true } },
      categories: { include: { category: true } },
      steps: { orderBy: { stepNumber: "asc" } },
    },
  })
}