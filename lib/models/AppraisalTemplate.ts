import mongoose from "mongoose"

const AppraisalTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    formType: {
      type: String,
      required: true,
      enum: ["CSR", "TeamLead"],
    },
    performanceAreas: [
      {
        category: String,
        items: [
          {
            title: String,
            description: String,
          },
        ],
      },
    ],
    kpis: [
      {
        title: String,
        description: String,
      },
    ],
    approvalWorkflow: [
      {
        step: Number,
        role: String,
        required: Boolean,
      },
    ],
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.AppraisalTemplate || mongoose.model("AppraisalTemplate", AppraisalTemplateSchema)
