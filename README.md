# 🌐 Global IP Intelligence Platform  
Unified Backend + Frontend Repository

The **Global IP Intelligence Platform** is a full-stack web application designed to streamline patent and trademark search, provide analytical insights, and support role-based access for Admins, Analysts, and Users.  
This repository contains **both backend (Spring Boot)** and **frontend (React)** projects integrated inside one monorepo.

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
├── global-ip-backend/ # Spring Boot Application (REST API)
│ ├── src/main/java/... # Controllers, services, security, entities
│ ├── src/main/resources/ # application.yml with profiles
│ ├── ddl_Role.sql # DB script for roles
│ ├── ddl_User.sql # DB script for users
│ ├── .env.example # Environment variables template
│ └── pom.xml
│
└── global-ip-frontend/
└── Global_IP_Intelligence_Platform_Team_B/ # React front-end application

markdown
Copy code

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

### **3. Database & Profiles**
Supports:
- **H2 database** (DEV & TEST)
- **PostgreSQL** (PROD)

Spring Profiles:
- `dev` → Local H2 + OAuth for testing
- `test` → Automated test environment
- `prod` → PostgreSQL deployment

### **4. Admin Features**
- Create & manage user roles
- Approve/restrict analyst capabilities

### **5. User Features**
- Update profile
- View personal activity
- Access dashboard

### **6.Analyst Features (Planned for Milestone 2)**

The following analyst capabilities will be introduced in upcoming milestones:

- Advanced patent/trademark search filters  
- Statistical insights (year-wise, category-wise, status-based)  
- Trend visualization using charts  
- Analyst-specific dashboard widgets  
- Rapid data exploration tools  

These features are currently under development and will be included in future releases.

---

## Frontend Features (React)

- Fully responsive UI
- Separate dashboards for Admin, Analyst, and Users
- Integrated OAuth2 login buttons
- Dynamic search results display
- Trend visualizations (Chart.js / Recharts)
- Reusable components and context-based authentication
- API service layer for interacting with backend

---

## 🔧 How to Run the Backend

### **1. Set Up Environment Variables**
Copy file:

global-ip-backend/src/.env.example → .env

css
Copy code

Fill in:

DB_URL_DEV=...
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

markdown
Copy code

### **2. Activate DEV mode**
`application.yml` uses:

spring.profiles.active=dev

markdown
Copy code

### **3. Run**
cd global-ip-backend
mvn spring-boot:run

yaml
Copy code

Backend URL:
http://localhost:8080

yaml
Copy code

---

## 🖥️ Running the Frontend

cd global-ip-frontend/Global_IP_Intelligence_Platform_Team_B
npm install
npm start

yaml
Copy code

Frontend URL:
http://localhost:3000

yaml
Copy code

---

## 🔗 OAuth Redirect URIs

### Google:
http://localhost:8080/login/oauth2/code/google
http://localhost:3000/oauth/success

shell
Copy code

### GitHub:
http://localhost:8080/login/oauth2/code/github
http://localhost:3000/oauth/success

yaml
Copy code

---

## Testing

- Test profile auto-creates an isolated H2 DB
- All repository, service, and web layer tests use `@SpringBootTest`
- CI-friendly configuration (no external DB required)

---

## Build for Production

### Backend
mvn clean package

shell
Copy code

### Frontend
npm run build

yaml
Copy code

Front-end static files can be deployed separately or served via Nginx.

---

##  Team Responsibilities (Milestone Summary)

### **We have completed:**
- Full backend setup (Spring Boot)
- JWT authentication system
- Google & GitHub OAuth2 login flow
- Role-based authorization (RBAC)
- User, Admin, Analyst controllers
- OAuth2 Success Handler + Custom User Loader
- Environment variable configuration using .env
- Integrated H2 + PostgreSQL support via profiles
- Exception handling and global error responses
- Frontend-backend connectivity setup
- GitHub repo setup with monorepo structure

---

## ✨ Acknowledgements
Thanks to the development team members and mentors who provided guidance during the project
