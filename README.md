# Enterprise Job Application Portal (DBMS Mini-Project)

A full-stack, enterprise-grade recruitment and job management system built with a decoupled three-tier architecture: **React (Vite)** frontend, **Node.js/Express** REST API backend, and a fully normalized (3NF) **MySQL** relational database.

---

## 🌟 Key Features

### For Job Seekers (Candidates)
* **Real-Time Job Exploration**: Browse verified openings with live search across job titles, partner companies, and tech stacks.
* **Multi-Parameter Filtering**: Filter instantly by tech-hub location, department, or company pill tags (Infosys, TCS, Wipro).
* **Detailed Job Specification Modal**: Quick-view role descriptions, compensation packages, and team structures before applying.
* **One-Click Application Pipeline**: Submit resume URLs and candidate details with immediate database feedback.
* **"My Applications" Dashboard**: Track personal application statuses live through the entire recruitment lifecycle.

### For Recruiters & Admins
* **Recruiter Operations Dashboard**: High-level overview of candidate applications, associated postings, and current review states.
* **Job Publishing Engine**: Create and publish new job postings directly to the relational database.
* **Workflow Status Triggers**:
  * Transition applicant status to **Interview Scheduled** with interview date/time, mode (`Online` / `In-Person`), and meeting notes.
  * Transition applicant status to **Offered** with annual salary figures and expected joining dates.
* **Role-Based Access Control (RBAC)**: Secure registration and JWT-based session management distinguishing candidates from recruiters.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Axios, Custom Modular CSS |
| **Backend** | Node.js, Express.js, CORS, JSON Web Tokens (JWT), Dotenv |
| **Database** | MySQL 8.0 (InnoDB Engine, 3NF Normalization, Strict Foreign Keys) |
| **Tooling** | MySQL Workbench, VS Code, Git, GitHub |

---

## 🗄️ Database Architecture & Schema Design

The relational schema is structured in **Third Normal Form (3NF)** across 9 relational entities:

* `COMPANY` — Corporate hiring partners and operational metadata.
* `DEPARTMENT` — Departmental categories within companies.
* `RECRUITER` — Administrative recruiter accounts mapped to specific corporate departments.
* `JOB_SEEKER` — Registered candidate profiles and resumes.
* `JOB` — Individual job openings linked to departments and hiring recruiters.
* `APPLICATION` — Central transactional relation recording candidate submissions with unique constraints (`(Job_ID, Seeker_ID)`).
* `INTERVIEW` — Scheduled interview events linked directly to candidate applications.
* `OFFER` — Compensation and formal placement records for accepted applicants.
* `APPLICATION_LOGS` — Audit log tracking status changes and timestamps.

---

## 🚀 Local Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MySQL Server](https://dev.mysql.com/downloads/mysql/) & [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
* [Git](https://git-scm.com/)

---

### Step 1: Database Setup
1. Open **MySQL Workbench** and connect to your local MySQL instance.
2. Execute the schema creation and data insertion scripts located inside the `Database/` directory:
   * Run `Jobapplication1.sql` (Creates tables, relations, and foreign keys).
   * Run `Jobapplication2.sql` (Populates sample departments, companies, jobs, and candidate records).

---

### Step 2: Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend

npm install

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=job_portal
JWT_SECRET=your_jwt_secret_key

node server.js
cd frontend
npm run dev

job-application-portal/
├── Database/
│   ├── Jobapplication1.sql     # DDL Script: Table definitions & constraints
│   └── Jobapplication2.sql     # DML Script: Mock seed data & active openings
├── backend/
│   ├── routes/
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   └── jobRoutes.js
│   ├── server.js               # Express application configuration & DB pool
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ApplyModal.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   ├── JobListings.jsx
│   │   │   ├── MyApplications.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── PostJobModal.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md

