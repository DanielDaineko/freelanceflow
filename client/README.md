# FreelanceFlow

FreelanceFlow is a full-stack freelance management application that helps you manage:

- Clients
- Projects
- Tasks (Kanban board)
- Finances (payments & income tracking)

Built with modern technologies and designed as a real-world portfolio project.

---

# Features

## Authentication

- User registration & login
- JWT authentication
- Protected routes

## Clients

- Create / edit / delete clients
- Search clients (name, email, company)
- Status management (active, lead, paused, completed)

## Projects

- Create / edit / delete projects
- Assign clients to projects
- Filter projects by status
- Budget & deadline tracking

## Tasks (Kanban Board)

- Create / edit / delete tasks
- Status workflow:
  - Todo
  - In Progress
  - Done
- Filter by:
  - Status
  - Priority
- Project-based task management

## Finance

- Track payments
- Assign payments to projects
- Filter by project
- Total income calculation

## UX Improvements

- Toast notifications
- Delete confirmation dialogs
- Empty states
- Clean UI components system

---

# Tech Stack

## Frontend

- React
- Zustand (state management)
- Tailwind CSS
- React Router

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL

---

# Project Structure

```bash
client/
src/
components/
ui/
pages/
store/
features/

server/
src/
controllers/
routes/
services/
config/
prisma/
```

---

# Setup Instructions

## 1. Clone repository

```bash
git clone https://github.com/YOUR_USERNAME/freelanceflow.git
cd freelanceflow
```

## 2. Setup backend

```bash
cd server
npm install
```

## Create .env

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/freelanceflow"
JWT_SECRET="your_secret"
PORT=5000
```

## 3. Setup database

```bash
npx prisma migrate dev
```

## 4. Run backend

```bash
npm run dev
```

## 5. Setup frontend

```bash
cd ../client
npm install
npm run dev
```

---

# API Overview

Auth

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
  Clients
- GET /api/clients
- POST /api/clients
- PUT /api/clients/:id
- DELETE /api/clients/:id
  Projects
- GET /api/projects
- POST /api/projects
- PUT /api/projects/:id
- DELETE /api/projects/:id
  Tasks
- GET /api/tasks?projectId=...
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
  Transactions
- GET /api/transactions
- POST /api/transactions
- PUT /api/transactions/:id
- DELETE /api/transactions/:id

---

# Key Highlights

- Full CRUD across all entities
- Clean architecture (controllers → services → DB)
- Reusable UI component system
- Real-time UI feedback (toasts)
- Filters & search implemented
- Production-ready structure

---

# Future Improvements (optional)

- Drag & drop Kanban (react-beautiful-dnd)
- Charts (income analytics)
- Dark/light theme toggle
- Pagination
- Role-based access
