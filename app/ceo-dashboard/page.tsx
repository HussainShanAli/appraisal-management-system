"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Users, TrendingUp, Building, Award } from "lucide-react"

export default function CEODashboard() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || user.role !== "CEO") {
    return null // Will redirect to login via useAuth hook
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CEO Dashboard</h1>
              <p className="text-sm text-gray-600">Chief Executive Officer - Strategic Performance Overview</p>
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
          <p className="text-gray-600">Chief Executive Officer - Strategic Leadership</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Organization Overview */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <CardDescription>Across all departments</CardDescription>
            </CardContent>
          </Card>

          {/* Department Heads */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Department Heads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <CardDescription>Direct reports</CardDescription>
            </CardContent>
          </Card>

          {/* Organizational Performance */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Org. Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <CardDescription>Overall company score</CardDescription>
            </CardContent>
          </Card>

          {/* Strategic Reviews */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Strategic Reviews</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <CardDescription>Team Lead appraisals pending</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Strategic Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button>Review Team Lead Appraisals</Button>
            <Button variant="outline">Organizational Analytics</Button>
            <Button variant="outline">Strategic Planning</Button>
            <Button variant="outline">Executive Reports</Button>
          </div>
        </div>

        {/* Executive Overview */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Back Office (Maheen Anser)</span>
                  <span className="text-sm text-gray-500">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sales Department</span>
                  <span className="text-sm text-gray-500">88%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Operations</span>
                  <span className="text-sm text-gray-500">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Finance</span>
                  <span className="text-sm text-gray-500">91%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Strategic Approvals */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Strategic Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Ahmed Team Lead - Performance Review</p>
                    <p className="text-xs text-gray-500">Team Lead Customer Support</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm">Review</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Strategic Initiative Review</p>
                    <p className="text-xs text-gray-500">Q4 Performance Planning</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm">Review</Button>
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
