import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"
import { getUserFromToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const decoded = getUserFromToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // Find user by ID
    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        isActive: user.isActive,
      },
    })
  } catch (error) {
    console.error("Profile error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
