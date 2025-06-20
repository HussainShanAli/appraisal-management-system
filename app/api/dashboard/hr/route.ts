import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"
import Appraisal from "@/lib/models/Appraisal"
import KPI from "@/lib/models/KPI"
import AppraisalTemplate from "@/lib/models/AppraisalTemplate"
import { getTokenFromRequest, getUserFromToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
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

    // Get statistics
    const [totalUsers, totalAppraisals, pendingAppraisals, completedAppraisals, totalKPIs, totalTemplates] =
      await Promise.all([
        User.countDocuments({ isActive: true }),
        Appraisal.countDocuments(),
        Appraisal.countDocuments({
          status: { $in: ["Pending_HOD_Approval", "Pending_HR_Approval"] },
        }),
        Appraisal.countDocuments({ status: "Completed" }),
        KPI.countDocuments(),
        AppraisalTemplate.countDocuments(),
      ])

    // Get recent appraisals
    const recentAppraisals = await Appraisal.find()
      .populate("employee", "name email")
      .populate("template", "name")
      .sort({ updatedAt: -1 })
      .limit(10)

    return NextResponse.json({
      stats: {
        totalUsers,
        totalAppraisals,
        pendingAppraisals,
        completedAppraisals,
        totalKPIs,
        totalTemplates,
      },
      recentAppraisals,
    })
  } catch (error) {
    console.error("HR Dashboard error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
