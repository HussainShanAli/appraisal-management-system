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
    kpis: [
      {
        kpi: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "KPI",
          required: true,
        },
      },
    ],
    forRole: {
      type: String,
      required: true,
      enum: ["Employee", "TeamLead"],
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.AppraisalTemplate || mongoose.model("AppraisalTemplate", AppraisalTemplateSchema)
