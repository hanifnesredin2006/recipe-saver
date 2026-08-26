"use client"

import { useEffect } from "react"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold text-slate-800">Something went wrong</h1>
      <p className="mt-2 max-w-md text-slate-500">
        We hit an unexpected error loading this page. You can try again, or head back to your recipes.
      </p>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => reset()}
          className="rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
        >
          Try again
        </button>
      </div>
    </main>
  )
}