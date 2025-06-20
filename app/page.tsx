"use client"

import { useEffect } from "react"
import { redirect } from "next/navigation"

export default function Page() {
  useEffect(() => {
    // Check if user is authenticated (e.g., check for a token in local storage)
    const isAuthenticated = localStorage.getItem("token")

    if (!isAuthenticated) {
      redirect("/login")
    }

    // Simulate fetching user role from an API or local storage
    // Replace this with your actual authentication and authorization logic
    const user = {
      role: localStorage.getItem("role") || "Employee", // Default role
    }

    // Role-based dashboard routing
    switch (user.role) {
      case "HRAdmin":
        redirect("/hr-dashboard")
      case "HOD":
        redirect("/hod-dashboard")
      case "TeamLead":
        redirect("/manager-dashboard")
      case "CEO":
        redirect("/ceo-dashboard")
      case "Employee":
        redirect("/employee-dashboard")
      default:
        redirect("/login")
    }
  }, [])

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  )
}
