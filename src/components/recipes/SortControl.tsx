// src/components/recipes/SortControl.tsx
"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

const sortOptions = [
  { label: "Newest first", sort: "createdAt", order: "desc" },
  { label: "Oldest first", sort: "createdAt", order: "asc" },
  { label: "Title (A–Z)", sort: "title", order: "asc" },
  { label: "Title (Z–A)", sort: "title", order: "desc" },
]

export default function SortControl() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get("sort") ?? "createdAt"
  const currentOrder = searchParams.get("order") ?? "desc"
  const currentValue = `${currentSort}:${currentOrder}`

  function handleChange(value: string) {
    const [sort, order] = value.split(":")
    const params = new URLSearchParams(searchParams.toString())

    params.set("sort", sort)
    params.set("order", order)
    params.delete("page")

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <select
      value={currentValue}
      onChange={e => handleChange(e.target.value)}
      className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
    >
      {sortOptions.map(opt => (
        <option key={`${opt.sort}:${opt.order}`} value={`${opt.sort}:${opt.order}`}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}