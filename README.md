# 💰 Expense Tracker

A full-stack expense tracking web application built with the PERN stack (PostgreSQL, Express, React, Node.js).

## Features

- 🔐 User authentication with JWT (Register/Login)
- ➕ Add, edit, and delete expenses
- 📊 Dashboard with spending summary and pie chart by category
- 📋 Expense table with full CRUD operations
- 🗂️ Category-based organization (Food, Transport, Shopping, Bills, Health, Education, Other)

## Tech Stack

**Frontend**
- React (Vite)
- React Router DOM
- Recharts
- Axios

**Backend**
- Node.js
- Express
- PostgreSQL
- JWT Authentication
- bcryptjs

## Project Structure

```
expense-tracker/
├── client/     # React frontend
└── server/     # Express backend
```

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL

### Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the server folder:
```
PORT=5000
JWT_SECRET=your_secret_key
DB_USER=postgres
DB_HOST=localhost
DB_NAME=expense_tracker
DB_PASSWORD=your_password
DB_PORT=5432
```
Then run:
```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

Open your browser at `http://localhost:5173`

## Database Setup

Run these SQL commands in PostgreSQL:

```sql
CREATE DATABASE expense_tracker;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(50),
  note TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Author

**Duresa Chemeda** — [@DuDu21cs](https://github.com/DuDu21cs)