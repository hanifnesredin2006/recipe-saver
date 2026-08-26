// src/app/(app)/account/page.tsx

import { auth } from "@/lib/auth-config"
import { redirect } from "next/navigation"
import UpdateUserForm from "@/components/account/UpdateUserForm"

export default async function AccountPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-slate-800">Account Settings</h1>
      <p className="mt-2 text-slate-500">Update your name or password, or delete your account.</p>

      <UpdateUserForm
        name={session.user.name ?? ""}
        email={session.user.email ?? ""}
      />
    </main>
  )
}