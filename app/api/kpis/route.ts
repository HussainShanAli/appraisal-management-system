import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import KPI from "@/lib/models/KPI"
import { getTokenFromRequest, getUserFromToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = getUserFromToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    await dbConnect()
    const kpis = await KPI.find().sort({ category: 1, title: 1 })

    return NextResponse.json(kpis)
  } catch (error) {
    console.error("Error fetching KPIs:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
    const kpi = await KPI.create({
      title,
      description,
      category,
    })

    return NextResponse.json(kpi, { status: 201 })
  } catch (error) {
    console.error("Error creating KPI:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
