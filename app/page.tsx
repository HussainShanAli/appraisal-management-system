"use client"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

interface User {
  id: string
  name: string
  email: string
  role: string
  department?: string
}

interface DecodedToken {
  userId: string
  email: string
  role: string
  name: string
}

export default async function HomePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  console.log("Home page - Token exists:", !!token)

  if (!token) {
    console.log("No token in home page, redirecting to login")
    redirect("/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key") as DecodedToken
    console.log("Home page - Token verified for user:", decoded.email, "Role:", decoded.role)

    // Redirect based on user role
    switch (decoded.role) {
      case "HRAdmin":
        redirect("/hr-dashboard")
      case "HOD":
        redirect("/hod-dashboard")
      case "TeamLead":
        redirect("/manager-dashboard")
      case "Employee":
        redirect("/employee-dashboard")
      default:
        console.log("Unknown role:", decoded.role, "redirecting to login")
        redirect("/login")
    }
  } catch (error) {
    console.log("Token verification failed in home page:", error)
    redirect("/login")
  }

  // This should never be reached due to redirects above
  return null
}
