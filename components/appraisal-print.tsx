"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface AppraisalPrintProps {
  appraisal: any
}

export function AppraisalPrint({ appraisal }: AppraisalPrintProps) {
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

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5:
        return "Excellent"
      case 4:
        return "Good"
      case 3:
        return "Satisfactory"
      case 2:
        return "Needs Improvement"
      case 1:
        return "Poor"
      default:
        return "Not Rated"
    }
  }

  return (
    <div className="print:p-0 print:shadow-none max-w-4xl mx-auto">
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="print-area">
        {/* Header */}
        <div className="text-center mb-8 print:mb-6">
          <h1 className="text-3xl font-bold print:text-2xl">Performance Appraisal Report</h1>
          <p className="text-gray-600 mt-2">PAWS - Performance & Appraisal Workflow System</p>
        </div>

        {/* Employee Information */}
        <Card className="mb-6 print:shadow-none print:border-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Employee Information
              <Badge className={getStatusColor(appraisal.status)}>{appraisal.status.replace("_", " ")}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 print:gap-2">
              <div>
                <p>
                  <strong>Name:</strong> {appraisal.employee?.name}
                </p>
                <p>
                  <strong>Email:</strong> {appraisal.employee?.email}
                </p>
              </div>
              <div>
                <p>
                  <strong>Review Period:</strong> {appraisal.reviewPeriod}
                </p>
                <p>
                  <strong>Template:</strong> {appraisal.template?.name}
                </p>
              </div>
            </div>
            {appraisal.submittedBy && (
              <div className="mt-4 pt-4 border-t">
                <p>
                  <strong>Submitted by:</strong> {appraisal.submittedBy.name}
                </p>
                {appraisal.submittedDate && (
                  <p>
                    <strong>Submitted on:</strong> {new Date(appraisal.submittedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* KPI Scores */}
        <Card className="mb-6 print:shadow-none print:border-2">
          <CardHeader>
            <CardTitle>Performance Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {appraisal.scores?.map((score: any, index: number) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{score.kpi?.title}</h4>
                      <p className="text-sm text-gray-600">{score.kpi?.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{score.rating || "N/A"}</span>
                        <span className="text-sm text-gray-600">/ 5</span>
                      </div>
                      <p className="text-sm font-medium">{getRatingText(score.rating)}</p>
                    </div>
                  </div>

                  {score.managerComment && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Manager Comment:</p>
                      <p className="text-sm mt-1 bg-gray-50 p-2 rounded print:bg-gray-100">{score.managerComment}</p>
                    </div>
                  )}

                  {score.employeeComment && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Employee Comment:</p>
                      <p className="text-sm mt-1 bg-blue-50 p-2 rounded print:bg-gray-100">{score.employeeComment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overall Comments */}
        {(appraisal.strengthsComment || appraisal.improvementsComment || appraisal.finalComments) && (
          <Card className="mb-6 print:shadow-none print:border-2">
            <CardHeader>
              <CardTitle>Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {appraisal.strengthsComment && (
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                  <p className="text-sm bg-green-50 p-3 rounded print:bg-gray-100">{appraisal.strengthsComment}</p>
                </div>
              )}

              {appraisal.improvementsComment && (
                <div>
                  <h4 className="font-semibold text-orange-700 mb-2">Areas for Improvement</h4>
                  <p className="text-sm bg-orange-50 p-3 rounded print:bg-gray-100">{appraisal.improvementsComment}</p>
                </div>
              )}

              {appraisal.finalComments && (
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Final Comments</h4>
                  <p className="text-sm bg-blue-50 p-3 rounded print:bg-gray-100">{appraisal.finalComments}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Approval Chain */}
        {appraisal.approvalChain && appraisal.approvalChain.length > 0 && (
          <Card className="mb-6 print:shadow-none print:border-2">
            <CardHeader>
              <CardTitle>Approval History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appraisal.approvalChain.map((approval: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded print:bg-gray-100"
                  >
                    <div>
                      <p className="font-medium">{approval.approver?.name}</p>
                      <p className="text-sm text-gray-600">{approval.role}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(approval.status)}>{approval.status}</Badge>
                      {approval.date && (
                        <p className="text-xs text-gray-500 mt-1">{new Date(approval.date).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8 print:mt-6">
          <Separator className="mb-4" />
          <p>
            Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
          <p>PAWS - Performance & Appraisal Workflow System</p>
        </div>
      </div>
    </div>
  )
}
