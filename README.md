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

-**Security-first** role management (no role escalation at registration)
-**Backend-driven** authorization (RBAC enforced server-side)
-**API normalization** for IP data sources (USPTO, EPO, PatentsView)
-**Clean separation** of concerns between authentication, authorization, and business logic
-**Clear separation** of auth, business logic, analytics, and tracking
-**Cache-heavy, compute-light** architecture for analytics



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
├── global-ip-core/
│   ├── src/main/java/...
│   ├── src/main/resources/ 
│   ├── .env.example
│   └── pom.xml
├── patents-trens-service/
│   ├── src/main/java/...
│   ├── src/main/resources/ 
│   └── pom.xml
├── trademarks-mock-service/
│   ├── src/main/java/...
│   ├── src/main/resources/ 
│   └── pom.xml
└── global-ip-frontend/
    └── Global_IP_Intelligence_Platform_Team_B/

---

## 👥 Roles & Capabilities

### USER
- Keyword-based patent & trademark search
- View patent/trademark details
- Bookmark IP assets
- Track basic activity

### ANALYST
- Advanced patent & trademark search
- Patent & trademark lifecycle tracking
- Citation network visualization
- Competitor filing analysis
- Trend analysis & dashboards
- Subscription-based monitoring
- Real-time WebSocket alerts

### ADMIN
- Full system access
- User & role management
- Role request approvals
- API key management
- API usage logs
- Health & error monitoring
- Subscription oversight

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
- **API Key authentication**
  - For company automations
  - Scoped & auditable

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

## 4.Subscription System

- Feature access is gated by **active subscriptions**
- Supports monitoring types such as:
  - Patent tracking
  - Competitor filings
  - Trend analytics
- Enforced server-side for all APIs

---

## 5. Search Capabilities

### Unified Search
- Single endpoint for patents & trademarks
- Keyword search (USER)
- Advanced filters (ANALYST / ADMIN)

### Data Sources
- **Patents**
  - PatentsView API
  - EPO OPS API
  - EPO Bulk Back & Front Files
- **Trademarks**
  - USPTO Bulk Data
  - TMView-compatible model

---

## 6. Analytics & Trends

### Patent Analytics
- Filing trends
- Grant trends
- Top technologies
- Top assignees
- Geographic distribution
- Patent type distribution
- Claim complexity
- Time-to-grant analysis
- Technology evolution
- Citation metrics

### Trademark Analytics
- Status distribution
- Class distribution
- Country-wise trends
- Lifecycle summaries

### Unified Analytics
- Cross-source filing trends
- Country-level aggregation (EPO + PatentsView)

---

## 7. Citation Intelligence

- Backward & forward citation networks
- Force-directed graph support
- Citation metrics & insights
- Controlled depth to prevent graph explosion
- Cached for performance

---

## 8. Lifecycle Tracking

- Patent application lifecycle visualization
- Tracked patent portfolios
- Subscription-controlled tracking
- Persistent lifecycle snapshots

---

## 9. Competitor Intelligence

- Competitor registry
- Filing synchronization
- Filing trend analysis
- Monthly & yearly summaries
- Searchable competitor filings
- Subscription-protected endpoints

---

## 10. Real-Time Tracking & Alerts

- Patent legal status tracking
- Source auto-detection (USPTO / EPO)
- User-defined tracking preferences
- WebSocket-ready event architecture

---

## 11. IP Assets

- Bookmarked patents
- Bookmarked trademarks
- Tracked assets
- Personalized dashboards

---

## 12. Performance & Caching

### Caching Strategy (Caffeine)
- Patent & trademark search results
- Snapshot caching
- Citation networks
- Analytics aggregations
- Unified & EPO trends

### Cache Management
- TTL-based eviction
- Scheduled eviction for search caches
- Stats-enabled caches for monitoring

---

## 13. Monitoring & Observability

### Admin Monitoring
- API health checks
- External service status
- Error summaries
- API usage logs
- CSV export for audit logs
- System health scoring

---

#### Benefits:
- Prevents unauthorized role escalation
- Maintains a clear audit trail
- Aligns with enterprise security best practices
- Keeps user registration logic simple and safe

> Note: Direct role assignment during registration is intentionally restricted.

### **14. Database & Profiles**
Supports:
- **H2 database** (DEV & TEST)
- **PostgreSQL** (PROD)

Spring Profiles:
- `dev` → Local H2 + OAuth for testing
- `test` → Automated test environment
- `prod` → PostgreSQL deployment

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
Then all the api keys and url,websocket,scheduling configs


### **2. Activate DEV mode**
`application.yml` uses:

spring.profiles.active=dev

### **3. Run**
cd global-ip-backend
mvn spring-boot:run
Backend URL:
http://localhost:8080

cd patents-trend-service
mvn spring-boot:run
Backend URL:
http://localhost:8081

cd tm-mock-service
mvn spring-boot:run
Backend URL:
http://localhost:9090

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

## Team Responsibilities (All Milestones Summary)

### We have completed:

## 🔧 Backend Responsibilities

### Core Architecture
- Full backend development using **Spring Boot** with layered architecture (Controller → Service → Repository)
- Global exception handling with centralized error responses
- Environment and configuration management using `.env` files and Spring Profiles (`dev`, `test`, `prod`)

### Authentication & Authorization
- **JWT-based authentication** with secure token issuance and validation using Spring Security
- **OAuth2 integration**
  - Google OAuth2
  - GitHub OAuth2
  - Custom OAuth2 success handler
  - Unified user identity mapping across OAuth and local login
- **Role-Based Access Control (RBAC)**
  - USER, ANALYST, and ADMIN roles
  - Method-level authorization using `@PreAuthorize`
  - No role escalation during user registration
- **Role request and admin approval workflow**
  - Users can request elevated roles
  - Admin approval, rejection, or waitlisting
  - Full audit trail for role changes

### Subscription & Feature Management
- Subscription-based feature enforcement
- Premium features gated by active subscriptions
- Server-side validation for all protected endpoints

### IP Search & Analytics
- **Unified patent and trademark search APIs**
  - Keyword-based search for USER role
  - Advanced filtered search for ANALYST and ADMIN roles
- **Patent analytics and trend analysis**
  - Filing trends, grant trends, and technology trends
  - Geographic, assignee, and citation-based analytics
  - Powered by PatentsView bulk data
- **EPO analytics integration**
  - Filing, country, technology, assignee, and family trends
  - Support for EPO bulk back and front files
- **Trademark analytics**
  - Status, class, and country-wise distributions
  - Lifecycle insights using USPTO bulk data

### Intelligence & Tracking Systems
- **Citation intelligence system**
  - Backward and forward citation extraction
  - Citation network generation for visualization
  - Citation metrics and summary insights
- **Patent lifecycle tracking**
  - Application lifecycle computation and visualization
  - Tracked patent portfolios per user
- **Competitor intelligence module**
  - Competitor management
  - Filing analysis
  - Filing trend and summary analytics
- **Tracking and monitoring engine**
  - Patent legal status tracking with USPTO/EPO auto-detection
  - User-defined tracking preferences

### API & Performance Management
- **API key management**
  - API key generation, listing, and revocation
  - Scoped access for enterprise and automation use cases
- **Caching and performance optimization**
  - Multi-layer caching using Caffeine
  - Scheduled cache eviction for frequently accessed data
- **API documentation**
  - Swagger/OpenAPI integration
  - APIs grouped by domain and role

### System Monitoring & Observability
- API usage logging and export
- External service health checks
- Error summaries and system health reporting

---

## 🎨 Frontend Responsibilities

### Authentication & User Management
- **Authentication UI**
  - Login and registration flows
  - OAuth2 login with Google and GitHub
  - Secure redirect handling and token processing
- **JWT token management**
  - Secure token storage
  - Axios interceptors for authenticated API requests

### Routing & Access Control
- **Role-based routing**
  - Protected routes for USER, ANALYST, and ADMIN roles
  - Dynamic UI rendering based on role and subscription status
- **Subscription-aware UI behavior**
  - Feature visibility based on active subscriptions
  - Graceful handling of restricted features

### Dashboard & Views
- **Dashboard implementations**
  - User dashboard (search, bookmarks, activity)
  - Analyst dashboard (analytics, trends, tracking)
  - Admin dashboard (user management and system monitoring)
- **Search and detail views**
  - Unified search interface for patents and trademarks
  - Detailed IP asset pages with bookmark and tracking actions

### Analytics & Visualizations
- **Trend charts**
  - Filing trends, grant trends, technology trends
- **Citation network visualizations**
- **Lifecycle timelines**
- **Competitor filing charts**

### API Integration & Architecture
- **API integration layer**
  - Centralized API service abstraction
  - Consistent request and response handling
  - Frontend-side validation of backend responses
- **Reusable and scalable UI components**
  - Modular component design
  - Clean separation of concerns
- **Responsive layout**
  - Dashboard-friendly, adaptable UI design

---

#### Platform & Repository Setup
- Monorepo GitHub repository structure
- Frontend–backend connectivity and local development setup

---

## ✨ Acknowledgements
Thanks to the development team members and mentor who provided guidance during the project
