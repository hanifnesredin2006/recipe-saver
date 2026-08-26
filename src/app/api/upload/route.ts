// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "File must be an image" }, { status: 400 })
    }

    const blob = await put(`recipes/${crypto.randomUUID()}-${file.name}`, file, {
      access: "public",
    })

    return NextResponse.json({ success: true, url: blob.url })
  } catch (error) {
  console.error("Error uploading file:", error)
  return NextResponse.json(
    { success: false, error: error instanceof Error ? error.message : "Failed to upload file" },
    { status: 500 }
  )
}
}