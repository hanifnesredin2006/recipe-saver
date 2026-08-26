"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface IngredientRow {
  id: string
  name: string
  quantity: string
}

interface StepRow {
  id: string
  description: string
}

interface CreateRecipeFormProps {
  existingCategories: string[]
  existingIngredients: string[]
}

export default function CreateRecipeForm({
  existingCategories,
  existingIngredients,
}: CreateRecipeFormProps) {
  const router = useRouter()

  // --- Basic fields ---
  const [title, setTitle] = useState("")
  const [duration, setDuration] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // --- Ingredients (dynamic rows, name suggested via datalist) ---
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { id: crypto.randomUUID(), name: "", quantity: "" },
  ])

  function addIngredient() {
    setIngredients([...ingredients, { id: crypto.randomUUID(), name: "", quantity: "" }])
  }
  function removeIngredient(id: string) {
    setIngredients(ingredients.filter(i => i.id !== id))
  }
  function updateIngredient(id: string, field: "name" | "quantity", value: string) {
    setIngredients(ingredients.map(i => (i.id === id ? { ...i, [field]: value } : i)))
  }

  // --- Steps (dynamic rows, order derived from array index) ---
  const [steps, setSteps] = useState<StepRow[]>([
    { id: crypto.randomUUID(), description: "" },
  ])

  function addStep() {
    setSteps([...steps, { id: crypto.randomUUID(), description: "" }])
  }
  function removeStep(id: string) {
    setSteps(steps.filter(s => s.id !== id))
  }
  function updateStep(id: string, value: string) {
    setSteps(steps.map(s => (s.id === id ? { ...s, description: value } : s)))
  }

  // --- Categories (pick existing from dropdown, or type a new one) ---
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
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
      // 1. Upload image first (if provided), get back a hosted URL
      let imgUrl: string | undefined

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

      // 2. Create the recipe with the image URL included
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

      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create recipe")
        return
      }

      router.push(`/recipes/${data.data.id}`)
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

      {/* Image upload */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />
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
        {loading ? "Creating…" : "Create Recipe"}
      </button>
    </form>
  )
}