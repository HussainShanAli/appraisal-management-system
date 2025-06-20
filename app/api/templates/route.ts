import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import AppraisalTemplate from "@/lib/models/AppraisalTemplate"
import { getTokenFromRequest, getUserFromToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const templates = await AppraisalTemplate.find().sort({ name: 1 })
    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching templates:", error)
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

    await dbConnect()

    const templateData = await request.json()
    const template = await AppraisalTemplate.create(templateData)

    return NextResponse.json(
      {
        message: "Template created successfully",
        template,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating template:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
