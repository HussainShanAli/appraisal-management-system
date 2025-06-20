-- This is a MongoDB seeding script (JavaScript format for MongoDB)
-- Run this in MongoDB shell or use a Node.js script

-- Create demo users
db.users.insertMany([
  {
    name: "HR Administrator",
    email: "hr@company.com",
    password: "$2a$10$rOzJqKwjKqKwjKqKwjKqKOzJqKwjKqKwjKqKwjKqKOzJqKwjKqKwjK", // password123
    role: "HRAdmin",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Department Head",
    email: "hod@company.com", 
    password: "$2a$10$rOzJqKwjKqKwjKqKwjKqKOzJqKwjKqKwjKqKwjKqKOzJqKwjKqKwjK", // password123
    role: "HOD",
    department: "Engineering",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Team Manager",
    email: "manager@company.com",
    password: "$2a$10$rOzJqKwjKqKwjKqKwjKqKOzJqKwjKqKwjKqKwjKqKOzJqKwjKqKwjK", // password123
    role: "TeamLead", 
    department: "Engineering",
    manager: ObjectId("HOD_ID_HERE"), // Replace with actual HOD ID
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "John Employee",
    email: "employee@company.com",
    password: "$2a$10$rOzJqKwjKqKwjKqKwjKqKOzJqKwjKqKwjKqKwjKqKOzJqKwjKqKwjK", // password123
    role: "Employee",
    department: "Engineering", 
    manager: ObjectId("MANAGER_ID_HERE"), // Replace with actual Manager ID
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- Create sample KPIs
db.kpis.insertMany([
  {
    title: "Code Quality",
    description: "Maintains high standards in code quality and follows best practices",
    category: "Technical Skills",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Team Collaboration", 
    description: "Works effectively with team members and contributes to team goals",
    category: "Soft Skills",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Problem Solving",
    description: "Demonstrates strong analytical and problem-solving abilities",
    category: "Technical Skills", 
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Communication",
    description: "Communicates clearly and effectively with stakeholders",
    category: "Soft Skills",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Leadership",
    description: "Shows leadership qualities and mentors junior team members",
    category: "Leadership",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

-- Create sample appraisal templates
db.appraisaltemplates.insertMany([
  {
    name: "Software Developer Appraisal",
    description: "Performance appraisal template for software developers",
    kpis: [
      { kpi: ObjectId("KPI_ID_1") }, // Replace with actual KPI IDs
      { kpi: ObjectId("KPI_ID_2") },
      { kpi: ObjectId("KPI_ID_3") },
      { kpi: ObjectId("KPI_ID_4") }
    ],
    forRole: "Employee",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Team Lead Appraisal", 
    description: "Performance appraisal template for team leads",
    kpis: [
      { kpi: ObjectId("KPI_ID_1") },
      { kpi: ObjectId("KPI_ID_2") }, 
      { kpi: ObjectId("KPI_ID_3") },
      { kpi: ObjectId("KPI_ID_4") },
      { kpi: ObjectId("KPI_ID_5") }
    ],
    forRole: "TeamLead",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
