"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Users, FileText, TrendingUp, Building } from "lucide-react"

export default function HODDashboard() {
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
              <h1 className="text-2xl font-bold text-gray-900">HOD Dashboard</h1>
              <p className="text-sm text-gray-600">Head of Department - Performance & Appraisal System</p>
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
            Head of Department
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Department Size */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Department Size</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <CardDescription>Total employees</CardDescription>
            </CardContent>
          </Card>

          {/* Team Leads */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <CardDescription>Direct reports</CardDescription>
            </CardContent>
          </Card>

          {/* Department Performance */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dept. Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <CardDescription>Overall department score</CardDescription>
            </CardContent>
          </Card>

          {/* Pending Reviews */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <CardDescription>Awaiting final approval</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button>Review Department Performance</Button>
            <Button variant="outline">Approve Pending Reviews</Button>
            <Button variant="outline">Manage Team Leads</Button>
            <Button variant="outline">Department Analytics</Button>
          </div>
        </div>

        {/* Department Overview */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Development Team</span>
                  <span className="text-sm text-gray-500">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">QA Team</span>
                  <span className="text-sm text-gray-500">88%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">DevOps Team</span>
                  <span className="text-sm text-gray-500">91%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Design Team</span>
                  <span className="text-sm text-gray-500">93%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Approvals */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Alice Cooper - Senior Developer</p>
                    <p className="text-xs text-gray-500">Performance Review Approved</p>
                  </div>
                  <span className="text-xs text-green-600">Approved</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Bob Wilson - QA Lead</p>
                    <p className="text-xs text-gray-500">KPI Update Approved</p>
                  </div>
                  <span className="text-xs text-green-600">Approved</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
