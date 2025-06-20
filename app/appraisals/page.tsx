"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Printer, Eye } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AppraisalPrint } from "@/components/appraisal-print"

export default function AppraisalsPage() {
  const [appraisals, setAppraisals] = useState([])
  const [filteredAppraisals, setFilteredAppraisals] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAppraisal, setSelectedAppraisal] = useState(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchAppraisals()
    fetchUserProfile()
  }, [])

  useEffect(() => {
    filterAppraisals()
  }, [searchTerm, appraisals])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/auth/profile")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const fetchAppraisals = async () => {
    try {
      const response = await fetch("/api/appraisals")
      if (response.ok) {
        const data = await response.json()
        setAppraisals(data)
      }
    } catch (error) {
      console.error("Error fetching appraisals:", error)
    }
  }

  const filterAppraisals = () => {
    if (!searchTerm) {
      setFilteredAppraisals(appraisals)
    } else {
      const filtered = appraisals.filter(
        (appraisal: any) =>
          appraisal.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appraisal.template?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appraisal.reviewPeriod.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appraisal.status.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredAppraisals(filtered)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Pending_HR_Approval":
        return "bg-yellow-100 text-yellow-800"
      case "Pending_HOD_Approval":
        return "bg-blue-100 text-blue-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handlePrint = (appraisal: any) => {
    setSelectedAppraisal(appraisal)
    // Small delay to ensure the dialog content is rendered
    setTimeout(() => {
      window.print()
    }, 100)
  }

  return (
    <DashboardLayout title="Appraisals" role={user?.role || ""}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Performance Appraisals</h2>
            <p className="text-muted-foreground">View and manage performance appraisals</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search appraisals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Appraisals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppraisals.map((appraisal: any) => (
            <Card key={appraisal._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{appraisal.employee?.name}</CardTitle>
                    <CardDescription>{appraisal.template?.name}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(appraisal.status)}>{appraisal.status.replace("_", " ")}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Period:</strong> {appraisal.reviewPeriod}
                  </p>
                  {appraisal.submittedBy && (
                    <p className="text-sm">
                      <strong>Submitted by:</strong> {appraisal.submittedBy.name}
                    </p>
                  )}
                  {appraisal.submittedDate && (
                    <p className="text-sm">
                      <strong>Date:</strong> {new Date(appraisal.submittedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Appraisal Details</DialogTitle>
                      </DialogHeader>
                      <AppraisalPrint appraisal={appraisal} />
                    </DialogContent>
                  </Dialog>

                  {appraisal.status === "Completed" && (
                    <Button variant="outline" size="sm" onClick={() => handlePrint(appraisal)} className="flex-1">
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAppraisals.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-medium mb-2">No appraisals found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm ? "Try adjusting your search criteria." : "No appraisals have been created yet."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Hidden print dialog */}
        {selectedAppraisal && (
          <div className="hidden">
            <AppraisalPrint appraisal={selectedAppraisal} />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
