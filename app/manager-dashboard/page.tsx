"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Users, FileText, BarChart3, CheckCircle } from "lucide-react"

export default function ManagerDashboard() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login via useAuth hook
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-sm text-gray-600">Performance & Appraisal Workflow System</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <Button variant="outline" onClick={logout}>
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
            Team Lead Manager
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Team Members */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <CardDescription>Direct reports</CardDescription>
            </CardContent>
          </Card>

          {/* Pending Appraisals */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <CardDescription>Awaiting your approval</CardDescription>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">88%</div>
              <CardDescription>Average team score</CardDescription>
            </CardContent>
          </Card>

          {/* Completed Reviews */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <CardDescription>Reviews this quarter</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button>Review Pending Appraisals</Button>
            <Button variant="outline">Manage Team KPIs</Button>
            <Button variant="outline">View Team Reports</Button>
            <Button variant="outline">Schedule Reviews</Button>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Approvals</h3>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">John Smith - Performance Review</p>
                    <p className="text-xs text-gray-500">Submitted 2 days ago</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Sarah Johnson - KPI Update</p>
                    <p className="text-xs text-gray-500">Submitted 1 day ago</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
