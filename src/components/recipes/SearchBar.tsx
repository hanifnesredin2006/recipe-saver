// src/components/recipes/SearchBar.tsx
"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

export default function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleChange(newValue: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (newValue) {
      params.set("search", newValue)
    } else {
      params.delete("search")
    }

    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <input
      defaultValue={searchParams.get("search") ?? ""}
      onChange={e => handleChange(e.target.value)}
      placeholder="Search recipes..."
      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
    />
  )
}