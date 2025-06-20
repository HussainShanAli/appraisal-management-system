import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Find users who can be managers (TeamLead, HOD, HRAdmin)
    const managers = await User.find({
      role: { $in: ["TeamLead", "HOD", "HRAdmin"] },
      isActive: true,
    })
      .select("name email role department")
      .sort({ name: 1 })

    return NextResponse.json(managers)
  } catch (error) {
    console.error("Managers fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
