"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Users, FileText, BarChart3, Settings } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  department?: string
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/auth/profile")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        // If profile fetch fails, redirect to login
        router.push("/login")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const navigateTo = (path: string) => {
    router.push(path)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PAWS Dashboard</h1>
              <p className="text-sm text-gray-600">Performance & Appraisal Workflow System</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Welcome back, {user.name}!</h2>
          <p className="text-gray-600">
            {user.department && `${user.department} • `}
            {user.role}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* KPI Management */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateTo("/kpis")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">KPI Management</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage and track Key Performance Indicators for your team and organization.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Appraisals */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateTo("/appraisals")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appraisals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>View, manage, and print performance appraisals and evaluations.</CardDescription>
            </CardContent>
          </Card>

          {/* HR Dashboard - Only for HR Admin */}
          {user.role === "HRAdmin" && (
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigateTo("/hr-dashboard")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">HR Dashboard</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>Access comprehensive HR analytics and management tools.</CardDescription>
              </CardContent>
            </Card>
          )}

          {/* User Management - For managers and HR */}
          {(user.role === "HRAdmin" || user.role === "HOD" || user.role === "TeamLead") && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Management</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>Manage team members and their performance data.</CardDescription>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigateTo("/kpis")}>View KPIs</Button>
            <Button variant="outline" onClick={() => navigateTo("/appraisals")}>
              My Appraisals
            </Button>
            {user.role === "HRAdmin" && (
              <Button variant="outline" onClick={() => navigateTo("/hr-dashboard")}>
                HR Analytics
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
