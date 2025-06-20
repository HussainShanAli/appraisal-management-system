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
    reviewPeriod: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Draft", "Pending_HOD_Approval", "Pending_HR_Approval", "Completed", "Rejected"],
      default: "Draft",
    },
    scores: [
      {
        kpi: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "KPI",
          required: true,
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        managerComment: String,
        employeeComment: String,
      },
    ],
    strengthsComment: String,
    improvementsComment: String,
    finalComments: String,
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    submittedDate: Date,
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
          enum: ["HOD", "HRAdmin"],
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
