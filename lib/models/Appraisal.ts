import mongoose from "mongoose"

const AppraisalSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AppraisalTemplate",
      required: true,
    },
    formType: {
      type: String,
      required: true,
      enum: ["CSR", "TeamLead"],
    },
    reviewPeriod: {
      type: String,
      required: true,
    },
    dateOfEvaluation: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "Draft",
        "Pending_TL_Approval",
        "Pending_HOD_Approval",
        "Pending_CEO_Approval",
        "Pending_HR_Approval",
        "Completed",
        "Rejected",
      ],
      default: "Draft",
    },
    // Performance Areas Scores
    performanceScores: [
      {
        area: String,
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comments: String,
      },
    ],
    // KPI Scores
    kpiScores: [
      {
        kpi: String,
        description: String,
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comments: String,
      },
    ],
    // Overall Assessment
    strengths: String,
    areasForImprovement: String,
    trainingSupport: String,

    // Calculated scores
    totalPerformanceScore: Number,
    totalKpiScore: Number,
    averageScore: Number,
    overallRating: String,

    // Comments from approvers
    tlComments: String,
    hodComments: String,
    ceoComments: String,
    hrComments: String,

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    submittedDate: Date,

    // Approval Chain based on form type
    approvalChain: [
      {
        approver: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          required: true,
          enum: ["TeamLead", "HOD", "CEO", "HRAdmin"],
        },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending",
        },
        comment: String,
        date: Date,
      },
    ],
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Appraisal || mongoose.model("Appraisal", AppraisalSchema)
