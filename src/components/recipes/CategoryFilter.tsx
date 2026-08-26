// src/components/recipes/CategoryFilter.tsx
"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

interface CategoryFilterProps {
  categories: string[]
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleChange(category: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (category) {
      params.set("category", category)
    } else {
      params.delete("category")
    }

    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <select
      defaultValue={searchParams.get("category") ?? ""}
      onChange={e => handleChange(e.target.value)}
      className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
    >
      <option value="">All categories</option>
      {categories.map(category => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  )
}