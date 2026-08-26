"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { RecipeWithRelations } from "@/types"

interface IngredientRow {
  id: string
  name: string
  quantity: string
}

interface StepRow {
  id: string
  description: string
}

interface UpdateRecipeFormProps {
  recipe: RecipeWithRelations
  existingCategories: string[]
  existingIngredients: string[]
}

export default function UpdateRecipeForm({
  recipe,
  existingCategories,
  existingIngredients,
}: UpdateRecipeFormProps) {
  const router = useRouter()

  // --- Basic fields, pre-filled from the existing recipe ---
  const [title, setTitle] = useState(recipe.title)
  const [duration, setDuration] = useState(recipe.duration ?? "")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // --- Image: keep existing unless the user picks a new file ---
  const [currentImg, setCurrentImg] = useState(recipe.img) // what's already saved
  const [imageFile, setImageFile] = useState<File | null>(null) // new file, if replaced

  // --- Ingredients, pre-filled ---
  const [ingredients, setIngredients] = useState<IngredientRow[]>(
    recipe.ingredients.map(item => ({
      id: crypto.randomUUID(),
      name: item.ingredient.name,
      quantity: item.quantity ?? "",
    }))
  )

  function addIngredient() {
    setIngredients([...ingredients, { id: crypto.randomUUID(), name: "", quantity: "" }])
  }
  function removeIngredient(id: string) {
    setIngredients(ingredients.filter(i => i.id !== id))
  }
  function updateIngredient(id: string, field: "name" | "quantity", value: string) {
    setIngredients(ingredients.map(i => (i.id === id ? { ...i, [field]: value } : i)))
  }

  // --- Steps, pre-filled, ordered by stepNumber ---
  const [steps, setSteps] = useState<StepRow[]>(
      [...recipe.steps]
        .sort((a, b) => a.stepNumber - b.stepNumber)
        .map(step => ({ id: crypto.randomUUID(), description: step.description }))
  )

  function addStep() {
    setSteps([...steps, { id: crypto.randomUUID(), description: "" }])
  }
  function removeStep(id: string) {
    setSteps(steps.filter(s => s.id !== id))
  }
  function updateStep(id: string, value: string) {
    setSteps(steps.map(s => (s.id === id ? { ...s, description: value } : s)))
  }

  // --- Categories, pre-filled ---
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    recipe.categories.map(item => item.category.title)
  )
  const [categoryInput, setCategoryInput] = useState("")

  function addCategory(name: string) {
    const trimmed = name.trim()
    if (!trimmed || selectedCategories.includes(trimmed)) return
    setSelectedCategories([...selectedCategories, trimmed])
    setCategoryInput("")
  }
  function removeCategory(name: string) {
    setSelectedCategories(selectedCategories.filter(c => c !== name))
  }

  // --- Submit ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Only upload if the user picked a new file — otherwise keep the current image
      let imgUrl: string | null = currentImg

      if (imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", imageFile)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        })
        const uploadData = await uploadRes.json()

        if (!uploadRes.ok) {
          setError(uploadData.error || "Failed to upload image")
          return
        }

        imgUrl = uploadData.url
      }

      const payload = {
        title,
        duration,
        img: imgUrl,
        ingredients: ingredients
          .filter(i => i.name.trim())
          .map(i => ({ name: i.name, quantity: i.quantity || undefined })),
        steps: steps
          .filter(s => s.description.trim())
          .map((s, index) => ({ stepNumber: index + 1, description: s.description })),
        categories: selectedCategories,
      }

      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to update recipe")
        return
      }

      router.push(`/recipes/${recipe.id}`)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-6">
      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          required
        />
      </div>

      {/* Duration */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Duration</label>
        <input
          value={duration}
          onChange={e => setDuration(e.target.value)}
          placeholder="e.g. 30 mins"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />
      </div>

      {/* Image: show current, allow replace */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Photo</label>

        {currentImg && !imageFile && (
          <div className="mb-3 overflow-hidden rounded-xl">
            <Image
              src={currentImg}
              alt={title}
              width={300}
              height={200}
              className="h-40 w-full object-cover"
            />
          </div>
        )}

        {imageFile && (
          <p className="mb-2 text-sm text-slate-500">
            New image selected: {imageFile.name}
          </p>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />

        {currentImg && (
          <button
            type="button"
            onClick={() => {
              setCurrentImg(null)
              setImageFile(null)
            }}
            className="mt-2 text-sm font-medium text-red-500"
          >
            Remove photo
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Categories</label>

        <div className="flex flex-wrap gap-2">
          {selectedCategories.map(cat => (
            <span
              key={cat}
              className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700"
            >
              {cat}
              <button type="button" onClick={() => removeCategory(cat)}>
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <select
            onChange={e => addCategory(e.target.value)}
            value=""
            className="rounded-xl border border-slate-200 px-3 py-2"
          >
            <option value="" disabled>
              Choose existing…
            </option>
            {existingCategories
              .filter(c => !selectedCategories.includes(c))
              .map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>

          <input
            value={categoryInput}
            onChange={e => setCategoryInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault()
                addCategory(categoryInput)
              }
            }}
            placeholder="Add new category…"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={() => addCategory(categoryInput)}
            className="rounded-xl border border-emerald-200 px-4 py-2 text-emerald-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Ingredients</label>
        <div className="space-y-2">
          {ingredients.map(row => (
            <div key={row.id} className="flex gap-2">
              <input
                value={row.name}
                onChange={e => updateIngredient(row.id, "name", e.target.value)}
                placeholder="Ingredient name"
                list="ingredient-suggestions"
                className="flex-1 rounded-xl border border-slate-200 px-1 sm:px-4 py-2 outline-none transition focus:border-emerald-500"
              />
              <input
                value={row.quantity}
                onChange={e => updateIngredient(row.id, "quantity", e.target.value)}
                placeholder="Qty"
                className="w-28 rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => removeIngredient(row.id)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <datalist id="ingredient-suggestions">
          {existingIngredients.map(name => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <button
          type="button"
          onClick={addIngredient}
          className="mt-2 text-sm font-medium text-emerald-600"
        >
          + Add ingredient
        </button>
      </div>

      {/* Steps */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Steps</label>
        <div className="space-y-2">
          {steps.map((row, index) => (
            <div key={row.id} className="flex gap-2">
              <span className="pt-2 text-sm font-semibold text-slate-500">{index + 1}.</span>
              <textarea
                value={row.description}
                onChange={e => updateStep(row.id, e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-emerald-500"
              />
              <button type="button" onClick={() => removeStep(row.id)} className="text-red-500">
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addStep}
          className="mt-2 text-sm font-medium text-emerald-600"
        >
          + Add step
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Updating…" : "Update Recipe"}
      </button>
    </form>
  )
}