//recipes/[id]/page.tsx

import { getRecipe } from "@/lib/data"
import Image from "next/image"
import { ChefHat } from "lucide-react";
import RecipeActions from "@/components/recipes/RecipeActions";

interface RecipePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function RecipePage({params}: RecipePageProps) {
  const { id } = await params

  const result = await getRecipe(id)

  if (!result.success) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Recipe not found
        </h1>

        <p className="mt-2 text-slate-500">
          {result.error}
        </p>
      </main>
    )
  }

  const recipe = result.data

  return (
  <main className="p-6">
    {/* Recipe Hero */}
    <section className="grid gap-6 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm lg:grid-cols-2">
      
      {/* Image */}
      <div className="overflow-hidden rounded-2xl">
        {recipe.img ? (
          <Image
            src={recipe.img}
            alt={recipe.title}
            width={300}
            height={200}
            className="h-64 w-full object-cover"
          />
        ) : (
          <div className="flex min-h-80 items-center justify-center bg-emerald-50 text-emerald-600">
            <ChefHat size={150} />
          </div>
        )}
      </div>

      {/* Recipe Information */}
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-slate-800">
          {recipe.title}
        </h1>

        {/* Duration */}
        <p className="mt-3 text-base text-slate-500">
          🕐 {recipe.duration}
        </p>

        {/* Categories */}
        <div className="mt-3 flex flex-wrap gap-2">
          {recipe.categories.map((item) => (
            <span
              key={item.categoryId}
              className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700"
            >
              {item.category.title}
            </span>
          ))}
        </div>

        {/* Actions */}
        <RecipeActions recipeId={recipe.id}/>
      </div>
    </section>
    <section className="mt-6 grid gap-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm lg:grid-cols-2">
  
  {/* Ingredients */}
  <div>
    <h2 className="text-2xl font-bold text-slate-800">
      Ingredients
    </h2>

    <div className="mt-5 space-y-3">
      {recipe.ingredients.map((item) => (
        <div
          key={item.ingredientId}
          className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3"
        >
          <span className="font-medium text-slate-700">
            {item.ingredient.name}
          </span>

          <span className="text-sm text-slate-500">
            {item.quantity}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Steps */}
  <div>
    <h2 className="text-2xl font-bold text-slate-800">
      Steps
    </h2>

    <div className="mt-5 space-y-4">
      {recipe.steps.map((step) => (
        <div
          key={step.id}
          className="flex gap-4"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white">
            {step.stepNumber}
          </div>

          <p className="pt-1 text-slate-600">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  </div>

</section>
  </main>
)
}