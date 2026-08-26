"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface RecipeActionsProps {
  recipeId: number
}

export default function RecipeActions({ recipeId }: RecipeActionsProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  async function handleDelete() {
    const confirmed = window.confirm("Delete this recipe? This can't be undone.")
    if (!confirmed) return

    setError("")
    setDeleting(true)

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to delete recipe")
        return
      }

      router.push("/recipes")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-5">
      <div className="flex gap-3">
        <button
          onClick={() => router.push(`/recipes/${recipeId}/edit`)}
          className="rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
        >
          Edit Recipe
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-xl border border-red-200 px-5 py-3 font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete Recipe"}
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}