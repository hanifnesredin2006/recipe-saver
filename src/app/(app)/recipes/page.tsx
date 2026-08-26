// src/app/(app)/recipes/page.tsx

import { getRecipes } from "@/lib/data"
import RecipeCard from "@/components/recipes/RecipeCard"
import Link from "next/link"
import SearchBar from "@/components/recipes/SearchBar"
import type { RecipesPageProps } from "@/types"
import { getAllCategories } from "@/lib/db/categories"
import CategoryFilter from "@/components/recipes/CategoryFilter"
import SortControl from "@/components/recipes/SortControl"
import Pagination from "@/components/recipes/Pagination"

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = await searchParams

  const [result, categories] = await Promise.all([
    getRecipes({
      search: params.search,
      category: params.category,
      sort: params.sort,
      order: params.order,
      page: params.page ? parseInt(params.page) : undefined,
    }),
    getAllCategories(),
  ])

  if (!result.success) {
    return (
      <main className="p-6">
        <h1 className="text-3xl font-bold text-slate-800">Recipes</h1>
        <p className="mt-2 text-slate-500">{result.error}</p>
      </main>
    )
  }

  const recipes = result.data
  const totalPages = result.pagination.totalPages
  

  return (
    <main className="p-6">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome, {result.userName ?? "there"}
          </h1>
          <p className="mt-2 text-slate-500">
            Discover and explore your favorite recipes.
          </p>
        </div>

        <Link
          href="/recipes/create"
          className="w-fit rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
        >
          + Create Recipe
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchBar />
        </div>
        <CategoryFilter categories={categories.map(c => c.title)} />
        <SortControl />
      </div>

      {/* Recipe Grid or Empty State */}
      {recipes.length === 0 ? (
        <p className="mt-2 text-slate-500">No recipes found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipeInfo={recipe} />
            ))}
          </div>
          <Pagination totalPages={totalPages} />
        </>
      )}
    </main>
  )
}