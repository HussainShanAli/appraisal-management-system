import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import KPI from "@/lib/models/KPI"
import { getTokenFromRequest, getUserFromToken } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = getUserFromToken(token)
    if (!decoded || decoded.role !== "HRAdmin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { title, description, category } = await request.json()

    if (!title || !category) {
      return NextResponse.json({ message: "Title and category are required" }, { status: 400 })
    }

    await dbConnect()
    const kpi = await KPI.findByIdAndUpdate(params.id, { title, description, category }, { new: true })

    if (!kpi) {
      return NextResponse.json({ message: "KPI not found" }, { status: 404 })
    }

    return NextResponse.json(kpi)
  } catch (error) {
    console.error("Error updating KPI:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = getUserFromToken(token)
    if (!decoded || decoded.role !== "HRAdmin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await dbConnect()
    const kpi = await KPI.findByIdAndDelete(params.id)

    if (!kpi) {
      return NextResponse.json({ message: "KPI not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "KPI deleted successfully" })
  } catch (error) {
    console.error("Error deleting KPI:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
