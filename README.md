# PAWS - Performance & Appraisal Workflow System

A comprehensive web application for managing employee performance appraisals with multi-level approval workflows.

## Features

- **Multi-Role System**: Support for HR Admin, HOD, Team Lead, and Employee roles
- **KPI Management**: Create and manage Key Performance Indicators library
- **Appraisal Templates**: Customizable templates for different roles
- **Workflow Management**: Multi-level approval process (Team Lead → HOD → HR)
- **Dashboard Views**: Role-specific dashboards with relevant information
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing

## Technology Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Backend**: Next.js API Routes (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with httpOnly cookies
- **UI**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd paws-system
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your configuration:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/paws
JWT_SECRET=your-super-secret-jwt-key-here
\`\`\`

4. Seed the database with demo data:
\`\`\`bash
npm run seed
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

After seeding the database, you can use these demo accounts:

- **HR Admin**: hr@company.com / password123
- **HOD**: hod@company.com / password123  
- **Team Lead**: manager@company.com / password123
- **Employee**: employee@company.com / password123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### KPIs (HR Admin only)
- `GET /api/kpis` - Get all KPIs
- `POST /api/kpis` - Create new KPI
- `PUT /api/kpis/[id]` - Update KPI
- `DELETE /api/kpis/[id]` - Delete KPI

### Templates (HR Admin only)
- `GET /api/templates` - Get all templates
- `POST /api/templates` - Create new template
- `PUT /api/templates/[id]` - Update template

### Appraisals
- `GET /api/appraisals` - Get appraisals (filtered by role)
- `POST /api/appraisals` - Create new appraisal
- `PUT /api/appraisals/[id]` - Update appraisal
- `PUT /api/appraisals/[id]/submit` - Submit for approval
- `PUT /api/appraisals/[id]/approve` - Approve appraisal
- `PUT /api/appraisals/[id]/reject` - Reject appraisal

### Dashboard
- `GET /api/dashboard/hr` - HR dashboard data

## Database Schema

### User
- name, email, password (hashed)
- role: Employee | TeamLead | HOD | HRAdmin
- department, manager (ObjectId reference)
- isActive boolean

### KPI
- title, description, category

### AppraisalTemplate  
- name, description
- kpis: Array of KPI references
- forRole: Employee | TeamLead

### Appraisal
- employee, template (ObjectId references)
- reviewPeriod, status
- scores: Array with KPI ratings and comments
- approvalChain: Multi-level approval tracking

## Workflow Process

1. **HR Admin** creates KPIs and templates
2. **Team Lead** creates appraisal for employee using appropriate template
3. **Team Lead** fills out ratings and submits for approval
4. **HOD** reviews and approves/rejects the appraisal
5. If approved by HOD, **HR Admin** gives final approval
6. **Employee** can view completed appraisals

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── hr-dashboard/      # HR dashboard
│   └── ...                # Other pages
├── components/            # Reusable components
├── lib/                   # Utilities and models
│   ├── models/           # Mongoose schemas
│   ├── mongodb.ts        # Database connection
│   └── auth.ts           # Authentication utilities
├── scripts/              # Database seeding scripts
└── README.md
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
