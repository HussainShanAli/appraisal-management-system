"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, FileText, BarChart3, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Appraisal {
  id: string
  title: string
  status: string
  dueDate: string
  completedDate?: string
}

export default function EmployeeDashboard() {
  const [user, setUser] = useState<any | null>(null)
  const [appraisals, setAppraisals] = useState<Appraisal[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUserProfile()
    fetchAppraisals()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/auth/profile")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      router.push("/login")
    }
  }

  const fetchAppraisals = async () => {
    try {
      const response = await fetch("/api/appraisals")
      if (response.ok) {
        const data = await response.json()
        setAppraisals(data.appraisals || [])
      }
    } catch (error) {
      console.error("Error fetching appraisals:", error)
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appraisals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appraisals.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appraisals.filter((a) => a.status === "completed").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appraisals.filter((a) => a.status === "pending").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateTo("/kpis")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My KPIs</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>View your Key Performance Indicators and track your progress.</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateTo("/appraisals")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Appraisals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>View and manage your performance appraisals and evaluations.</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>Update your profile information and preferences.</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Recent Appraisals */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Appraisals</h3>
          {appraisals.length > 0 ? (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  {appraisals.slice(0, 5).map((appraisal) => (
                    <div key={appraisal.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{appraisal.title}</h4>
                        <p className="text-sm text-gray-500">Due: {appraisal.dueDate}</p>
                      </div>
                      <Badge className={getStatusColor(appraisal.status)}>
                        {appraisal.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No appraisals found</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigateTo("/kpis")}>View My KPIs</Button>
            <Button variant="outline" onClick={() => navigateTo("/appraisals")}>
              My Appraisals
            </Button>
            <Button variant="outline">Update Profile</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
