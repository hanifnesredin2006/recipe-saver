"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

interface UpdateUserFormProps {
  name: string
  email: string
}

export default function UpdateUserForm({ name, email }: UpdateUserFormProps) {
  const router = useRouter()

  // --- Update name/password ---
  const [nameValue, setNameValue] = useState(name)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [updateError, setUpdateError] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState("")
  const [updating, setUpdating] = useState(false)

  // --- Delete account ---
  const [deleteError, setDeleteError] = useState("")
  const [deleting, setDeleting] = useState(false)

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setUpdateError("")
    setUpdateSuccess("")

    if (password && password !== confirmPassword) {
      setUpdateError("Passwords do not match")
      return
    }

    setUpdating(true)

    try {
      const payload: { name?: string; password?: string } = {}

      if (nameValue.trim() && nameValue !== name) {
        payload.name = nameValue.trim()
      }
      if (password) {
        payload.password = password
      }

      if (Object.keys(payload).length === 0) {
        setUpdateError("Nothing to update")
        return
      }

      const response = await fetch(`/api/auth/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setUpdateError(data.error || "Failed to update account")
        return
      }

      setUpdateSuccess("Account updated.")
      setPassword("")
      setConfirmPassword("")
      router.refresh()
    } catch {
      setUpdateError("Something went wrong. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete your account? This will permanently remove your recipes and cannot be undone."
    )
    if (!confirmed) return

    setDeleteError("")
    setDeleting(true)

    try {
      const response = await fetch(`/api/auth/me`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        setDeleteError(data.error || "Failed to delete account")
        return
      }

      await signOut({ callbackUrl: "/login" })
    } catch {
      setDeleteError("Something went wrong. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mt-6 max-w-md space-y-8">
      {/* Update name / password */}
      <form onSubmit={handleUpdate} className="space-y-5 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <input
            value={email}
            disabled
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
          <input
            value={nameValue}
            onChange={e => setNameValue(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            New Password <span className="font-normal text-slate-400">(leave blank to keep current)</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        {password && (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
        )}

        {updateError && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{updateError}</p>
        )}
        {updateSuccess && (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{updateSuccess}</p>
        )}

        <button
          type="submit"
          disabled={updating}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {updating ? "Saving…" : "Save Changes"}
        </button>
      </form>

      {/* Delete account */}
      <div className="space-y-3 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Danger Zone</h2>
        <p className="text-sm text-slate-500">
          Deleting your account permanently removes your recipes and cannot be undone.
        </p>

        {deleteError && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{deleteError}</p>
        )}

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="w-full rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete Account"}
        </button>
      </div>
    </div>
  )
}