//components/layout/SideBar.tsx
import {
  ChefHat,
  User,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import type { SideBarProps } from "@/types";
import NavLinks from "./NavLinks";


export default function SideBar({user}:SideBarProps) {
  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-emerald-100 bg-white px-5 py-6 shadow-sm">

      {/* Logo */}
      <div className="mb-10 flex items-center gap-3 px-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
          <ChefHat size={22} />
        </div>

        <span className="text-2xl font-bold tracking-tight text-emerald-600">
          CookBook
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <NavLinks />
      </nav>

      {/* Account / Logout */}
      <div className="mt-auto border-t border-emerald-100 pt-5">
        <Link
          href="/account"
          className="mb-3 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
        >
          <User size={20} />
          <span>{user?.name}</span>
        </Link>

        <LogoutButton />
      </div>
    </aside>
  );
}