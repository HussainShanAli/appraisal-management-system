import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"
import { getTokenFromRequest, getUserFromToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = getUserFromToken(token)
    if (!decoded || !["HRAdmin", "HOD", "CEO"].includes(decoded.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await dbConnect()

    const users = await User.find({ isActive: true })
      .populate("supervisor", "name role")
      .populate("hod", "name role")
      .select("-password")
      .sort({ name: 1 })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
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

    const { name, employeeId, email, password, role, position, department, supervisorId, hodId } = await request.json()

    // Validation
    if (!name || !employeeId || !email || !password || !role || !position) {
      return NextResponse.json(
        {
          message: "Name, employee ID, email, password, role, and position are required",
        },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { employeeId }],
    })
    if (existingUser) {
      return NextResponse.json(
        {
          message: "User with this email or employee ID already exists",
        },
        { status: 400 },
      )
    }

    // Create user
    const userData: any = {
      name,
      employeeId,
      email,
      password,
      role,
      position,
    }

    if (department) userData.department = department
    if (supervisorId) userData.supervisor = supervisorId
    if (hodId) userData.hod = hodId

    const user = await User.create(userData)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject()

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
