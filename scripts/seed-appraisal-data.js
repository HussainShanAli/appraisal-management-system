const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/paws"

async function seedData() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db()

    console.log("Connected to MongoDB")

    // Clear existing data
    await db.collection("users").deleteMany({})
    await db.collection("appraisaltemplates").deleteMany({})

    console.log("Cleared existing data")

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10)

    // Create users with proper hierarchy
    const users = [
      // CEO
      {
        name: "John CEO",
        employeeId: "CEO001",
        email: "ceo@company.com",
        password: hashedPassword,
        role: "CEO",
        position: "Chief Executive Officer",
        isActive: true,
      },

      // HR Admin
      {
        name: "Sarah HR",
        employeeId: "HR001",
        email: "hr@company.com",
        password: hashedPassword,
        role: "HRAdmin",
        position: "Head of HR",
        isActive: true,
      },

      // HOD
      {
        name: "Maheen Anser",
        employeeId: "HOD001",
        email: "maheen@company.com",
        password: hashedPassword,
        role: "HOD",
        position: "Head of Department",
        department: "Back Office",
        isActive: true,
      },

      // Team Lead
      {
        name: "Ahmed Team Lead",
        employeeId: "TL001",
        email: "teamlead@company.com",
        password: hashedPassword,
        role: "TeamLead",
        position: "Team Lead Customer Support",
        department: "Back Office",
        isActive: true,
      },

      // CSR Employees
      {
        name: "Ali CSR",
        employeeId: "CSR001",
        email: "ali.csr@company.com",
        password: hashedPassword,
        role: "Employee",
        position: "Customer Service Representative",
        department: "Back Office",
        isActive: true,
      },
      {
        name: "Fatima CSR",
        employeeId: "CSR002",
        email: "fatima.csr@company.com",
        password: hashedPassword,
        role: "Employee",
        position: "Customer Service Representative",
        department: "Back Office",
        isActive: true,
      },
    ]

    const insertedUsers = await db.collection("users").insertMany(users)
    console.log("Users created")

    // Get user IDs for relationships
    const allUsers = await db.collection("users").find({}).toArray()
    const ceo = allUsers.find((u) => u.role === "CEO")
    const hod = allUsers.find((u) => u.role === "HOD")
    const teamLead = allUsers.find((u) => u.role === "TeamLead")
    const csrEmployees = allUsers.filter((u) => u.position === "Customer Service Representative")

    // Update relationships
    // Team Lead reports to HOD
    await db.collection("users").updateOne(
      { _id: teamLead._id },
      {
        $set: {
          supervisor: hod._id,
          hod: hod._id,
        },
      },
    )

    // CSR employees report to Team Lead and HOD
    for (const csr of csrEmployees) {
      await db.collection("users").updateOne(
        { _id: csr._id },
        {
          $set: {
            supervisor: teamLead._id,
            hod: hod._id,
          },
        },
      )
    }

    console.log("User relationships updated")

    // Create CSR Appraisal Template
    const csrTemplate = {
      name: "Customer Service Representative - Performance Appraisal Form",
      description: "Performance appraisal form for Customer Service Representatives",
      formType: "CSR",
      performanceAreas: [
        {
          category: "Customer Interaction & Communication",
          items: [
            { title: "Speaks clearly and listens actively", description: "Communication skills assessment" },
            { title: "Shows empathy and professionalism", description: "Professional behavior evaluation" },
          ],
        },
        {
          category: "Problem Solving & Resolution",
          items: [
            { title: "Handles complaints effectively", description: "Complaint resolution skills" },
            { title: "Offers quick and accurate solutions", description: "Solution-oriented approach" },
          ],
        },
        {
          category: "Product/Service Knowledge",
          items: [
            {
              title: "Understanding of services and ability to use EHR effectively",
              description: "Technical knowledge assessment",
            },
          ],
        },
        {
          category: "Efficiency & Productivity",
          items: [
            { title: "Handles a high volume of interactions", description: "Volume management" },
            { title: "Meets or exceeds response time goals", description: "Time management" },
          ],
        },
        {
          category: "Teamwork & Collaboration",
          items: [{ title: "Cooperates with team members", description: "Team collaboration skills" }],
        },
        {
          category: "Adherence to Policies & Attendance",
          items: [
            { title: "Follows procedures and guidelines", description: "Policy compliance" },
            { title: "Maintains good attendance and punctuality", description: "Attendance record" },
          ],
        },
      ],
      kpis: [
        { title: "Customer Satisfaction Score (CSAT)", description: "Post-interaction customer feedback" },
        { title: "First Response Time", description: "Time taken to respond to the customer's initial inquiry" },
        {
          title: "Average Reply Time (ART)",
          description:
            "Time taken to get back to customers to promptly follow up customers' issues, requests, or queries",
        },
        { title: "Average Handle Time (AHT)", description: "Average duration of each customer interaction" },
        { title: "First Call Resolution (FCR)", description: "Resolving customer issues during the first interaction" },
        { title: "Call Volume", description: "Number of calls handled per day" },
        { title: "Average Hold Time", description: "Duration of calls on hold" },
        {
          title: "Quality Assurance (QA) Score",
          description: "Internal scoring of calls/chats based on tone, accuracy, empathy, etc.",
        },
        {
          title: "Adherence to Schedule",
          description: "Percentage of time the CSR follows their assigned shift and breaks",
        },
        { title: "Escalation Rate", description: "Number of cases escalated to a higher level" },
      ],
      approvalWorkflow: [
        { step: 1, role: "TeamLead", required: true },
        { step: 2, role: "HOD", required: true },
        { step: 3, role: "HRAdmin", required: true },
      ],
    }

    // Create Team Lead Appraisal Template
    const teamLeadTemplate = {
      name: "Team Lead Customer Support - Performance Appraisal Form",
      description: "Performance appraisal form for Team Lead Customer Support",
      formType: "TeamLead",
      performanceAreas: [
        {
          category: "Leadership & Team Management",
          items: [
            { title: "Delegation and Supervision", description: "Leadership effectiveness" },
            { title: "Team Motivation and Morale", description: "Team motivation skills" },
            { title: "Conflict Resolution and Problem Solving", description: "Conflict management" },
            { title: "Training and Development of Team Members", description: "Team development" },
            { title: "Performance Monitoring and Feedback", description: "Performance management" },
            { title: "Schedule and Roster Management", description: "Resource management" },
            { title: "Adherence to SLAs and operational protocols", description: "Operational compliance" },
          ],
        },
        {
          category: "Communication & Collaboration",
          items: [
            { title: "Communication with Team", description: "Internal communication" },
            { title: "Communication with Management/Other Departments", description: "Cross-functional communication" },
            { title: "Reporting and Documentation Accuracy", description: "Documentation quality" },
            { title: "Handling Client Escalations", description: "Escalation management" },
          ],
        },
        {
          category: "Attitude & Professionalism",
          items: [
            { title: "Accountability and Ownership", description: "Personal accountability" },
            { title: "Punctuality, Attendance and Reliability", description: "Professional reliability" },
            { title: "Adaptability and Stress Management", description: "Adaptability skills" },
            { title: "Process Improvement Initiatives and Problem Solving", description: "Innovation and improvement" },
          ],
        },
      ],
      kpis: [
        { title: "Average Response and Resolution Time", description: "Team response metrics" },
        { title: "First Contact Resolution (FCR)", description: "Team resolution effectiveness" },
        { title: "SLA Adherence and Escalation Handling", description: "Service level compliance" },
        { title: "Call/Chat/Email Quality Monitoring", description: "Quality oversight" },
        { title: "Team Productivity and Efficiency", description: "Team performance metrics" },
      ],
      approvalWorkflow: [
        { step: 1, role: "HOD", required: true },
        { step: 2, role: "CEO", required: true },
        { step: 3, role: "HRAdmin", required: true },
      ],
    }

    await db.collection("appraisaltemplates").insertMany([csrTemplate, teamLeadTemplate])
    console.log("Appraisal templates created")

    console.log("Database seeded successfully!")
    console.log("\nLogin credentials:")
    console.log("CEO: ceo@company.com / password123")
    console.log("HR Admin: hr@company.com / password123")
    console.log("HOD (Maheen Anser): maheen@company.com / password123")
    console.log("Team Lead: teamlead@company.com / password123")
    console.log("CSR (Ali): ali.csr@company.com / password123")
    console.log("CSR (Fatima): fatima.csr@company.com / password123")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedData()
