import { auth } from "@/lib/auth-config"
import { getRecipesForUser, getRecipeForUser } from "@/lib/db/recipes"
import type { RecipesResponse, RecipesErrorResponse, RecipeResponse, RecipeErrorResponse } from "@/types"

export async function getRecipes(options: {
  search?: string
  category?: string
  sort?: string
  order?: string
  page?: number
  limit?: number
} = {}): Promise<RecipesResponse | RecipesErrorResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const result = await getRecipesForUser(parseInt(session.user.id), options)
  return {
    success: true,
    userName: session.user.name ?? null,
    ...result,
  }
}

export async function getRecipe(id: string): Promise<RecipeResponse | RecipeErrorResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const recipeId = Number(id)
  if (!Number.isInteger(recipeId)) {
    return { success: false, error: "Bad Request" }
  }

  const recipe = await getRecipeForUser(parseInt(session.user.id), recipeId)
  if (!recipe) {
    return { success: false, error: "Not Found" }
  }

  return { success: true, data: recipe }
}