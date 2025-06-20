"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Target } from "lucide-react" // Import Target component

export default function KPIsPage() {
  const [kpis, setKpis] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingKpi, setEditingKpi] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  })

  useEffect(() => {
    fetchKPIs()
  }, [])

  const fetchKPIs = async () => {
    try {
      const response = await fetch("/api/kpis")
      if (response.ok) {
        const data = await response.json()
        setKpis(data)
      }
    } catch (error) {
      console.error("Error fetching KPIs:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingKpi ? `/api/kpis/${editingKpi._id}` : "/api/kpis"
      const method = editingKpi ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchKPIs()
        setIsDialogOpen(false)
        setEditingKpi(null)
        setFormData({ title: "", description: "", category: "" })
      }
    } catch (error) {
      console.error("Error saving KPI:", error)
    }
  }

  const handleEdit = (kpi: any) => {
    setEditingKpi(kpi)
    setFormData({
      title: kpi.title,
      description: kpi.description,
      category: kpi.category,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this KPI?")) {
      try {
        const response = await fetch(`/api/kpis/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          fetchKPIs()
        }
      } catch (error) {
        console.error("Error deleting KPI:", error)
      }
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Technical Skills": "bg-blue-100 text-blue-800",
      "Soft Skills": "bg-green-100 text-green-800",
      Leadership: "bg-purple-100 text-purple-800",
      Communication: "bg-orange-100 text-orange-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <DashboardLayout title="KPI Management" role="HRAdmin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Key Performance Indicators</h2>
            <p className="text-muted-foreground">Manage your KPI library</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingKpi(null)
                  setFormData({ title: "", description: "", category: "" })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add KPI
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingKpi ? "Edit KPI" : "Create New KPI"}</DialogTitle>
                <DialogDescription>
                  {editingKpi
                    ? "Update the KPI details below."
                    : "Add a new Key Performance Indicator to your library."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Code Quality"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Technical Skills"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this KPI measures..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingKpi ? "Update" : "Create"} KPI</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi: any) => (
            <Card key={kpi._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{kpi.title}</CardTitle>
                    <Badge className={getCategoryColor(kpi.category)}>{kpi.category}</Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(kpi)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(kpi._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{kpi.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {kpis.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No KPIs found</h3>
              <p className="text-muted-foreground text-center mb-4">
                Get started by creating your first Key Performance Indicator.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First KPI
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
