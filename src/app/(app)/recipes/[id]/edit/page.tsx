// src/app/(app)/recipes/[id]/edit/page.tsx

import { getRecipe } from "@/lib/data"
import { getAllCategories } from "@/lib/db/categories"
import { getAllIngredients } from "@/lib/db/ingredients"
import UpdateRecipeForm from "@/components/recipes/UpdateRecipeForm"

interface EditRecipePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params

  const [result, categories, ingredients] = await Promise.all([
    getRecipe(id),
    getAllCategories(),
    getAllIngredients(),
  ])

  if (!result.success) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold text-slate-800">Recipe not found</h1>
        <p className="mt-2 text-slate-500">{result.error}</p>
      </main>
    )
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-slate-800">Edit Recipe</h1>
      <UpdateRecipeForm
        recipe={result.data}
        existingCategories={categories.map(c => c.title)}
        existingIngredients={ingredients.map(i => i.name)}
      />
    </main>
  )
}