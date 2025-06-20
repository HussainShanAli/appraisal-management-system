// Node.js script to seed demo data
// Run with: node scripts/seed-demo-data.js

const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/paws"

// User Schema
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    department: String,
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

const User = mongoose.model("User", UserSchema)

// KPI Schema
const KPISchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
  },
  { timestamps: true },
)

const KPI = mongoose.model("KPI", KPISchema)

// Template Schema
const TemplateSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    kpis: [{ kpi: { type: mongoose.Schema.Types.ObjectId, ref: "KPI" } }],
    forRole: String,
  },
  { timestamps: true },
)

const Template = mongoose.model("AppraisalTemplate", TemplateSchema)

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await KPI.deleteMany({})
    await Template.deleteMany({})

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10)

    // Create users
    const hrAdmin = await User.create({
      name: "HR Administrator",
      email: "hr@company.com",
      password: hashedPassword,
      role: "HRAdmin",
    })

    const hod = await User.create({
      name: "Department Head",
      email: "hod@company.com",
      password: hashedPassword,
      role: "HOD",
      department: "Engineering",
    })

    const manager = await User.create({
      name: "Team Manager",
      email: "manager@company.com",
      password: hashedPassword,
      role: "TeamLead",
      department: "Engineering",
      manager: hod._id,
    })

    const employee = await User.create({
      name: "John Employee",
      email: "employee@company.com",
      password: hashedPassword,
      role: "Employee",
      department: "Engineering",
      manager: manager._id,
    })

    console.log("Users created successfully")

    // Create KPIs
    const kpis = await KPI.insertMany([
      {
        title: "Code Quality",
        description: "Maintains high standards in code quality and follows best practices",
        category: "Technical Skills",
      },
      {
        title: "Team Collaboration",
        description: "Works effectively with team members and contributes to team goals",
        category: "Soft Skills",
      },
      {
        title: "Problem Solving",
        description: "Demonstrates strong analytical and problem-solving abilities",
        category: "Technical Skills",
      },
      {
        title: "Communication",
        description: "Communicates clearly and effectively with stakeholders",
        category: "Soft Skills",
      },
      {
        title: "Leadership",
        description: "Shows leadership qualities and mentors junior team members",
        category: "Leadership",
      },
    ])

    console.log("KPIs created successfully")

    // Create templates
    await Template.insertMany([
      {
        name: "Software Developer Appraisal",
        description: "Performance appraisal template for software developers",
        kpis: kpis.slice(0, 4).map((kpi) => ({ kpi: kpi._id })),
        forRole: "Employee",
      },
      {
        name: "Team Lead Appraisal",
        description: "Performance appraisal template for team leads",
        kpis: kpis.map((kpi) => ({ kpi: kpi._id })),
        forRole: "TeamLead",
      },
    ])

    console.log("Templates created successfully")
    console.log("Demo data seeded successfully!")

    console.log("\nDemo Login Credentials:")
    console.log("HR Admin: hr@company.com / password123")
    console.log("HOD: hod@company.com / password123")
    console.log("Team Lead: manager@company.com / password123")
    console.log("Employee: employee@company.com / password123")
  } catch (error) {
    console.error("Error seeding data:", error)
  } finally {
    await mongoose.disconnect()
  }
}

seedData()
