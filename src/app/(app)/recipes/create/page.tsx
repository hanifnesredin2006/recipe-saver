import { getAllCategories } from "@/lib/db/categories"
import { getAllIngredients } from "@/lib/db/ingredients"
import CreateRecipeForm from "@/components/recipes/CreateRecipeForm"

export default async function CreateRecipePage() {
  const [categories, ingredients] = await Promise.all([
    getAllCategories(),
    getAllIngredients(),
  ])

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-slate-800">Create Recipe</h1>
      <CreateRecipeForm
        existingCategories={categories.map(c => c.title)}
        existingIngredients={ingredients.map(i => i.name)}
      />
    </main>
  )
}