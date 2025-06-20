import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { name, email, password, role, department, managerId } = await request.json()

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Name, email, password, and role are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
    }

    // Validate role-specific requirements
    if (role !== "HRAdmin" && !department) {
      return NextResponse.json({ message: "Department is required for this role" }, { status: 400 })
    }

    if ((role === "Employee" || role === "TeamLead") && !managerId) {
      return NextResponse.json({ message: "Manager is required for this role" }, { status: 400 })
    }

    // Verify manager exists if provided
    if (managerId) {
      const manager = await User.findById(managerId)
      if (!manager) {
        return NextResponse.json({ message: "Invalid manager selected" }, { status: 400 })
      }
    }

    // Create user
    const userData: any = {
      name,
      email,
      password,
      role,
    }

    if (department) userData.department = department
    if (managerId) userData.manager = managerId

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
    console.error("Signup error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
