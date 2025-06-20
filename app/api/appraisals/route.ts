import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Appraisal from "@/lib/models/Appraisal"
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

    const query: any = {}

    // Filter appraisals based on user role
    switch (decoded.role) {
      case "Employee":
        query.employee = decoded.userId
        break
      case "TeamLead":
        // Can see appraisals they created or their own
        query.$or = [{ employee: decoded.userId }, { submittedBy: decoded.userId }]
        break
      case "HOD":
      case "HRAdmin":
        // Can see all appraisals
        break
      default:
        return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const appraisals = await Appraisal.find(query)
      .populate("employee", "name email")
      .populate("template", "name")
      .populate("submittedBy", "name")
      .populate("scores.kpi", "title category")
      .sort({ updatedAt: -1 })

    return NextResponse.json(appraisals)
  } catch (error) {
    console.error("Error fetching appraisals:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
