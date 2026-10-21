// // src/app/page.tsx
// import { auth } from "@/lib/auth-config"
// import { redirect } from "next/navigation"

// export default async function HomePage() {
//   const session = await auth()

//   if (session?.user) {
//     redirect("/recipes")
//   }

//   redirect("/login")
// }
// src/app/page.tsx

import Link from "next/link"
import { ChefHat } from "lucide-react"
import { Fraunces, Inter } from "next/font/google"
import { auth } from "@/lib/auth-config"
import { redirect } from "next/navigation"

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const features = [
  {
    name: "Search & filter",
    description: "Find \"chicken\" or \"30 minutes\" in seconds, not by scrolling.",
  },
  {
    name: "Categories & sorting",
    description: "Organize by cuisine, meal, or however you actually think about food.",
  },
  {
    name: "Your own photos",
    description: "Upload the photo you actually took, not a stock stand-in.",
  },
  {
    name: "Private by default",
    description: "Your collection is yours — nobody else sees it.",
  },
]

const steps = [
  {
    title: "Create an account",
    description: "Takes under a minute. No verification hoops.",
  },
  {
    title: "Add your first recipe",
    description: "Title, ingredients, steps, and a photo if you've got one.",
  },
  {
    title: "Find it again",
    description: "Search, filter by category, or just browse.",
  },
]

export default async function LandingPage() {
  const session = await auth()

  if (session?.user) {
    redirect("/recipes")
  }

  return (
    <div
      className={`${fraunces.variable} ${inter.variable} min-h-screen bg-[#FAF6EC] font-[family-name:var(--font-inter)] text-[#23301F]`}
    >
      {/* Nav */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <ChefHat size={22} className="text-emerald-600" />
          <span className="font-[family-name:var(--font-fraunces)] text-lg font-semibold">
            CookBook
          </span>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium text-[#23301F]/70 transition hover:text-[#23301F]"
        >
          Log in
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-5xl gap-12 px-6 pb-20 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-semibold leading-[1.1] sm:text-5xl">
            Every recipe you&apos;ve saved,
            <br className="hidden sm:block" /> actually easy to find again.
          </h1>

          <p className="mt-6 max-w-[46ch] text-lg text-[#23301F]/70">
            Save recipes as you cook — ingredients, steps, photos and all —
            then search, filter, and sort your way back to them in seconds.
            No ads, no life story before the recipe. Just your own kitchen
            notebook.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link
              href="/register"
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-[#23301F]/70 transition hover:text-[#23301F]"
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>

        {/* Recipe card mock */}
        <div className="relative">
          <div className="rotate-[-2deg] rounded-2xl border border-[#DDD3B8] bg-white p-6 shadow-[0_1px_0_#DDD3B8]">
            <p className="font-[family-name:var(--font-fraunces)] text-xl font-semibold">
              Sunday Morning Pancakes
            </p>
            <p className="mt-1 text-sm text-[#23301F]/50">25 min · Breakfast</p>

            <div className="mt-5 h-32 w-full rounded-xl bg-[#F1ECDC]" />

            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex items-baseline justify-between border-b border-dotted border-[#DDD3B8] pb-1">
                <span>Flour</span>
                <span className="text-[#23301F]/50">2 cups</span>
              </li>
              <li className="flex items-baseline justify-between border-b border-dotted border-[#DDD3B8] pb-1">
                <span>Eggs</span>
                <span className="text-[#23301F]/50">2</span>
              </li>
              <li className="flex items-baseline justify-between border-b border-dotted border-[#DDD3B8] pb-1">
                <span>Buttermilk</span>
                <span className="text-[#23301F]/50">1½ cups</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features, styled as an ingredient list */}
      <section className="mx-auto max-w-5xl border-t border-[#DDD3B8] px-6 py-16">
        <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold">
          What&apos;s inside
        </h2>

        <ul className="mt-8 divide-y divide-dotted divide-[#DDD3B8]">
          {features.map(f => (
            <li
              key={f.name}
              className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <span className="font-[family-name:var(--font-fraunces)] text-lg">
                {f.name}
              </span>
              <span className="text-sm text-[#23301F]/60 sm:max-w-[36ch] sm:text-right">
                {f.description}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works — genuinely sequential, numbering earns its place */}
      <section className="mx-auto max-w-5xl border-t border-[#DDD3B8] px-6 py-16">
        <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold">
          How it works
        </h2>

        <ol className="mt-8 space-y-8">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-5">
              <span className="font-[family-name:var(--font-fraunces)] text-2xl text-emerald-600">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-[#23301F]/60">{s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Closing CTA */}
      <section className="bg-[#23301F] px-6 py-16 text-[#FAF6EC]">
        <div className="mx-auto max-w-5xl">
          <p className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold sm:text-3xl">
            Stop losing recipes in screenshots and bookmarks.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Get started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-5xl px-6 py-8 text-sm text-[#23301F]/50">
        <p>CookBook — a personal recipe notebook.</p>
      </footer>
    </div>
  )
}