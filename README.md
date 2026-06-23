# SecureHub - Multi-Tenant RBAC Content Management Platform

A production-ready enterprise-grade Role-Based Access Control (RBAC) platform built using the MERN stack.

SecureHub enables organizations to securely manage users, roles, permissions, audit logs, and collaborative content creation through a modern multi-tenant architecture.

The application demonstrates authentication, authorization, organizational isolation, Google OAuth integration, audit tracking, and content management within a scalable SaaS-style environment.

---

## Features

### Authentication & Security

* JWT Authentication
* Google OAuth Sign In
* Password encryption using bcrypt
* Role-Based Access Control (RBAC)
* Permission-based route protection
* Rate limiting
* Helmet security middleware
* Input validation
* Email validation
* Password policy enforcement

---

## Multi-Tenant Architecture

Each organization operates independently.

Features include:

* Organization creation
* Organization-based data isolation
* Cross-organization protection
* Secure tenant separation

Users can only access resources belonging to their own organization.

---

## User Management

Administrators can:

* Create users
* Delete users
* View organization users
* Assign roles
* Manage permissions

Regular users have restricted access according to assigned permissions.

---

## Blog Management System

Users can:

* Create blogs
* View all organization blogs
* Edit their own blogs
* Delete their own blogs

Administrators can manage all blog content.

---

## Audit Logging

The system automatically tracks important actions.

Examples:

* CREATE_USER
* DELETE_USER
* ASSIGN_ROLE
* CREATE_BLOG
* DELETE_BLOG

This provides transparency and traceability across the platform.

---

## Dashboard System

### Admin Dashboard

* User statistics
* Audit log statistics
* Organization management overview
* Administrative controls

### User Dashboard

* Personalized experience
* Blog management
* Limited access based on permissions

---

## Google Authentication

Users can sign in using Google OAuth.

The application automatically:

* Creates new users if they do not exist
* Assigns default roles
* Generates JWT tokens
* Prevents password login for Google-only accounts

---

## Tech Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Framer Motion
* Tailwind CSS
* Lucide React
* Google OAuth

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Helmet
* Express Rate Limit

### Database

* MongoDB Atlas

### Deployment

* Frontend: Vercel
* Backend: Render

---

## Project Structure

```bash
frontend/
│
├── components/
├── pages/
├── services/
├── App.jsx
└── main.jsx

backend/
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── server.js
└── .env
```

---

## Environment Variables

Backend `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_secret_key

GOOGLE_CLIENT_ID=your_google_client_id

FRONTEND_URL=http://localhost:5173
```

Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api

VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

cd YOUR_REPOSITORY
```

### Backend Setup

```bash
cd backend

npm install

npm run dev
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Future Improvements

* Email verification
* Forgot password system
* Refresh token authentication
* Profile management
* Analytics dashboard
* Notifications
* Team invitations
* File uploads
* Rich text editor
* Dark mode customization

---

## Learning Outcomes

This project demonstrates:

* Full Stack MERN Development
* Multi-Tenant SaaS Architecture
* Enterprise RBAC Design
* Authentication & Authorization
* Secure API Development
* MongoDB Data Modeling
* Production Security Practices
* Cloud Database Integration
* Modern UI Development
* Deployment Workflows

---

## Author

Aditya Panchal

Built as a portfolio project to demonstrate real-world full-stack software engineering practices.
