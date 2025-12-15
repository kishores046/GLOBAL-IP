[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?logo=openjdk&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?logo=springsecurity&logoColor=white)
![OAuth2](https://img.shields.io/badge/OAuth2-3D7EBB?logo=oauth&logoColor=white)

# 🌐 Global IP Intelligence Platform  
Global IP Intelligence Platform — Monorepo (Spring Boot + React)

The Global IP Intelligence Platform is a full-stack web application designed to streamline
patent and trademark search, provide analytical insights, and support role-based access
for Admins, Analysts, and Users.

This repository contains both backend (Spring Boot) and frontend (React) projects
integrated inside a single monorepo.


---


## Design Principles

- Security-first role management (no role escalation at registration)
- Backend-driven authorization (RBAC enforced server-side)
- API normalization for future IP data sources (WIPO, EPO, TMView)
- Clean separation of concerns between authentication, authorization, and business logic


---

## Project Overview

The platform enables:
- Secure user authentication using **JWT**, **Google OAuth2**, and **GitHub OAuth2**
- Role-based access control (**RBAC**) for Admin, Analyst, and User roles
- Search and analytics features for patent/trademark datasets
- Admin management panel to handle user roles
- Analyst dashboard with statistics and trends
- User dashboard for personalized information
- Fully configurable environments using `.env` and Spring Profiles (`dev`, `test`, `prod`)

---

## 📁 Repository Structure

GLOBAL-IP/
│
├── global-ip-backend/
│   ├── src/main/java/...
│   ├── src/main/resources/
│   ├── ddl_Role.sql
│   ├── ddl_User.sql
│   ├── ddl_RoleRequest.sql   
│   ├── .env.example
│   └── pom.xml
│
└── global-ip-frontend/
    └── Global_IP_Intelligence_Platform_Team_B/

---

## 🔒 Backend Features (Spring Boot)

### **1. Authentication**
- Email-password login
- OAuth2 login:
  - Google
  - GitHub
- JWT-based session management
- Custom success handlers for OAuth2
- Secure REST APIs protected by JWT filters

### **2. Role-Based Access Control (RBAC)**
- USER → basic dashboard access
- ANALYST → advanced search + analytics tools
- ADMIN → manage users, assign roles

### 3. Role Request & Admin Approval Workflow

To ensure security and controlled privilege escalation, the platform follows an **admin-approved role assignment model**.

#### Workflow:
1. A user registers with a default role (`USER`)
2. If the user wants elevated access (e.g., `ADMIN`), they submit a **role request**
3. The request is stored in the database (`role_requests` table) with status `PENDING`
4. An **ADMIN** reviews the request via the admin dashboard
5. The admin can:
   - APPROVE → user role is updated
   - REJECT → no role change
6. All actions are audited with timestamps and reviewer details

#### Benefits:
- Prevents unauthorized role escalation
- Maintains a clear audit trail
- Aligns with enterprise security best practices
- Keeps user registration logic simple and safe

> Note: Direct role assignment during registration is intentionally restricted.

### **4. Database & Profiles**
Supports:
- **H2 database** (DEV & TEST)
- **PostgreSQL** (PROD)

Spring Profiles:
- `dev` → Local H2 + OAuth for testing
- `test` → Automated test environment
- `prod` → PostgreSQL deployment

### **5. Admin Features**
- Create & manage user roles
- Approve/restrict analyst capabilities

### **6. User Features**
- Update profile
- View personal activity
- Access dashboard

### **7.Analyst Features (Planned for Milestone 2)**

The following analyst capabilities will be introduced in upcoming milestones:

- Advanced patent/trademark search filters  
- Statistical insights (year-wise, category-wise, status-based)  
- Trend visualization using charts  
- Analyst-specific dashboard widgets  
- Rapid data exploration tools  

These features are currently under development and will be included in future releases.

---
## Frontend Features (React)

- Responsive, role-aware user interface for Admin, Analyst, and User dashboards
- Secure authentication UI with JWT handling and OAuth2 (Google, GitHub) integration
- Protected routing and dynamic UI rendering based on user roles
- Centralized API service layer with Axios interceptors
- Interactive analytics and trend visualizations using Chart.js / Recharts
- Reusable, modular components with context-based state management


---

## 🔧 How to Run the Backend

### **1. Set Up Environment Variables**
Copy file:

global-ip-backend/src/.env.example → .env

Fill in:

DB_URL_DEV=...
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...


### **2. Activate DEV mode**
`application.yml` uses:

spring.profiles.active=dev

### **3. Run**
cd global-ip-backend
mvn spring-boot:run


Backend URL:
http://localhost:8080

---

## 🖥️ Running the Frontend

cd global-ip-frontend/Global_IP_Intelligence_Platform_Team_B
npm install
npm start


Frontend URL:
http://localhost:3000


---

## 🔗 OAuth Redirect URIs

### Google:
http://localhost:8080/login/oauth2/authorization/google
http://localhost:3000/oauth/success



### GitHub:
http://localhost:8080/login/oauth2/code/github
http://localhost:3000/oauth/success



---

## Testing

- Test profile auto-creates an isolated H2 DB
- All repository, service, and web layer tests use `@SpringBootTest`
- CI-friendly configuration (no external DB required)

---

## Build for Production

### Backend
mvn clean package


### Frontend
npm run build



Front-end static files can be deployed separately or served via Nginx.

---

## Team Responsibilities (Milestone 1 Summary)

### We have completed:

#### Backend Responsibilities
- Full backend setup using Spring Boot
- JWT-based authentication and authorization system
- Google & GitHub OAuth2 login flow
- Role-based access control (RBAC) for USER, ANALYST, and ADMIN roles
- User, Admin, and Analyst REST controllers
- OAuth2 success handler and custom user loader
- Environment variable configuration using `.env`
- Integrated H2 (DEV/TEST) and PostgreSQL (PROD) using Spring Profiles
- Global exception handling and standardized error responses

#### Frontend Responsibilities
- Authentication UI for login and registration
- OAuth2 login integration and redirect handling
- JWT token storage and request interception
- Role-based routing and protected pages
- Dashboard UI for User, Analyst, and Admin roles
- Frontend–backend API integration and validation

#### Platform & Repository Setup
- Monorepo GitHub repository structure
- Frontend–backend connectivity and local development setup

---

## ✨ Acknowledgements
Thanks to the development team members and mentors who provided guidance during the project
