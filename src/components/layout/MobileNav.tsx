//components/layout/MobileNav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChefHat,
  Menu,
  User,
  X,
} from "lucide-react";
import LogoutButton from "./LogoutButton";
import type { SideBarProps } from "@/types";
import NavLinks from "./NavLinks";

export default function MobileNav({user}: SideBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      {/* Top bar */}
      <header className="relative z-60 flex items-center justify-between border-b border-emerald-100 bg-white px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <ChefHat size={20} />
          </div>

          <span className="text-xl font-bold tracking-tight text-emerald-600">
            RecipeBook
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm"
          />

          {/* Mobile menu */}
          <div className="absolute left-0 right-0 z-50 border-b border-emerald-100 bg-white px-5 py-4 shadow-lg">
            {/* Navigation */}
            <nav className="flex flex-col gap-2">
              <NavLinks onLinkClick={() => setIsOpen(false)} />
            </nav>

            {/* Account */}
            <div className="mt-4 border-t border-emerald-100 pt-4">
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
              >
                <User size={20} />
                <span>{user?.name}</span>
              </Link>

              <LogoutButton/>
            </div>
          </div>
        </>
      )}
    </div>
  );
}