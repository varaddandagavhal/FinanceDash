# Finance Dashboard Backend & Dashboard

A clean, minimal, and well-structured finance management system built for the Data Processing and Access Control assignment.

## 🚀 Overview
This system provides a full-stack experience for managing financial records with robust Role-Based Access Control (RBAC). It includes specialized summary analytics (income/expense/balance/category totals) and detailed records management.

### Architecture
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose ODM)
- **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons
- **Access Control**: Custom RBAC Middleware using header-based simulation (`x-user-role`).

---

## 🔐 Role System
We implemented three distinct access levels:

1. **Admin**: Full control. Can manage (CRUD) all records and users.
2. **Analyst**: Focused on insights. Can view general summaries and detailed record tables, but cannot modify data.
3. **Viewer**: Read-only dashboard access. Can see aggregated summary data only.

---

## 🛠️ Features
- **Summary APIs**: Real-time aggregation of total income, expense, balance, and category-wise totals using MongoDB Aggregation pipelines.
- **Filtering**: Search records by type, category, or date range.
- **RBAC Middleware**: Unified authorization layer protecting all sensitive endpoints.
- **Clean UI**: Modern, dark-themed dashboard built with React and Tailwind CSS v4.

---

## 📦 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Requires a local MongoDB connection (default: `localhost:27017/finance_dashboard`)*.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Test Roles
Use the **Role Switcher** in the sidebar to test permissions:
- Switch to **Admin** to Delete/Add records.
- Switch to **Viewer** to see how access to the "Records" tab and management actions are restricted.

---

## 🔥 Assumptions & Tradeoffs
1. **Mock Auth**: For the scope of this assignment, we use `x-user-role` headers to simulate identified users rather than a full JWT/Passport implementation to prioritize transparency of the access control logic.
2. **Soft Delete**: Not implemented for simplicity, but easily addable by adding a `deletedAt` field to the schema.
3. **Validation**: We use Mongoose's built-in schema validation for `required`, `min`, and `enum` fields to keep the code clean and readable.

---

## 📂 Folder Structure
- `/backend/models`: Data Schemas (User, Record)
- `/backend/controllers`: Core Business Logic (Aggregation & CRUD)
- `/backend/middleware`: RBAC Authorization logic
- `/frontend/src`: React components and API integration layer
