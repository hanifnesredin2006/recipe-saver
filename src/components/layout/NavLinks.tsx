"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Plus } from "lucide-react"

const links = [
  { href: "/recipes", label: "Recipes", icon: BookOpen },
  { href: "/recipes/create", label: "Create Recipe", icon: Plus },
]

interface NavLinksProps {
  onLinkClick?: () => void
}

export default function NavLinks({ onLinkClick }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <>
      {links.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/recipes" ? pathname === "/recipes" : pathname.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            onClick={onLinkClick}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        )
      })}
    </>
  )
}