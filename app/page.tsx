import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export default async function HomePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

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
        redirect("/login")
    }
  } catch (error) {
    redirect("/login")
  }
}
