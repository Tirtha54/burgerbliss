# 🍔 BurgerBliss — Full Stack Project

A premium luxury burger restaurant web application built with **React.js** (Frontend), **Node.js + Express** (Backend), and **MySQL** (Database).

---

## 📁 Project Structure

```
burgerbliss/
├── frontend/          → React.js App
├── backend/           → Node.js + Express API
└── database/
    └── schema.sql     → MySQL Schema + Seed Data
```

---

## 🗄️ STEP 1: Setup MySQL Database

1. Open **MySQL Workbench**
2. Connect to your local MySQL server
3. Open a new SQL tab
4. Copy and paste the entire content of `database/schema.sql`
5. Click **Execute (⚡)** to run all queries
6. This will create the `burgerbliss` database, all tables, and seed data (burgers + ingredients)

> **Default Admin Login:**
> - Email: `admin_45@email.com`
> - Password: `Admin@123`

---

## ⚙️ STEP 2: Setup Backend (Node.js)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Configure environment variables
# Open .env file and update your MySQL password:
# DB_PASSWORD=your_mysql_password

# Start the backend server
npm start
# OR for development (auto-restart):
npm run dev
```

Backend will run on: **http://localhost:5000**

---

## 💻 STEP 3: Setup Frontend (React.js)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

Frontend will run on: **http://localhost:3000**

> The React app is configured to proxy API requests to `http://localhost:5000`

---

## 🔐 Authentication & Roles

### User Registration:
- Password must be: 8+ characters, 1 uppercase, 1 number, 1 special character (!@#$%^&*)
- Email must contain @ symbol
- Go to `/signup` to create an account

### Login Options:
- **User Login** → Redirects to Home page
- **Admin Login** → Redirects to Admin Dashboard

### Protected Routes:
- Menu, Customize, Cart, Games → Require user login
- Admin Dashboard → Requires admin role
- Home and About → Public access

---

## 📱 Pages Overview

| Page | Route | Access |
|------|-------|--------|
| Home | `/` | Public |
| About | `/about` | Public |
| Login | `/login` | Public |
| Signup | `/signup` | Public |
| Menu | `/menu` | Logged In |
| Customize | `/customize` | Logged In |
| Cart | `/cart` | Logged In |
| Games | `/games` | Logged In |
| Admin | `/admin` | Admin Only |

---

## 🎮 Games & Rewards

- **Spin & Win** → Spin wheel for random discount (5%, 10%, 15%, ₹50 OFF, Free Fries)
- **Memory Match** → Match emoji pairs, speed determines reward
- **Quiz Challenge** → Answer 3 questions, win ₹30 OFF for 2+ correct
- **Daily Offer** → Mystery reward revealed once per session

Rewards are saved in **localStorage** and automatically applied at checkout.

---

## 🛒 Cart & Checkout

- Add burgers from Menu page or Customize page
- View calories and protein per item
- Adjust quantity with +/- buttons
- Remove items individually
- Rewards auto-applied from Games page
- GST (18%) calculated automatically
- Place order generates a printed bill receipt

---

## 🔧 Admin Dashboard

Access at `/admin` after logging in with admin credentials.

**Features:**
- **Overview**: Today's orders, revenue, active users, popular burger
- **Orders Management**: View all orders with details, update status (Pending → Preparing → Ready → Completed)
- **Manage Menu**: View all burgers, add new burgers with full details
- **Ingredients**: View all customization ingredients
- **Users Management**: View all registered users, total orders, enable/disable accounts
- **Rewards**: View game reward configurations

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | None | Register user |
| POST | `/api/auth/login` | None | Login |
| GET | `/api/menu` | None | Get all burgers |
| POST | `/api/menu` | Admin | Add burger |
| GET | `/api/ingredients` | None | Get all ingredients |
| POST | `/api/orders` | User | Place order |
| GET | `/api/orders/my` | User | Get my orders |
| GET | `/api/orders/admin/all` | Admin | Get all orders |
| PUT | `/api/orders/admin/:id/status` | Admin | Update order status |
| GET | `/api/orders/admin/stats` | Admin | Dashboard stats |
| GET | `/api/users` | Admin | Get all users |
| PUT | `/api/users/:id/toggle` | Admin | Toggle user status |

---

## 🛠️ Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL 8.0 |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Styling | Custom CSS (Glassmorphism, Playfair Display + Poppins) |

---

## 📦 Dependencies

### Backend
```
express, cors, dotenv, mysql2, jsonwebtoken, bcryptjs
```

### Frontend
```
react, react-dom, react-router-dom, axios
```

---

## 🚀 Quick Start (All-in-one)

```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm install && npm start

# Open http://localhost:3000 in browser
```

---

## 🎨 Design System

- **Colors**: Charcoal (#1a1a1a), Muted Beige (#e8dcc8), Brown (#8b6914), Olive (#5c6430)
- **Typography**: Playfair Display (headings) + Poppins (body)
- **Effects**: Glassmorphism, Backdrop blur, Soft shadows, Smooth transitions
- **Border Radius**: 20-24px throughout
- **Theme**: Dark, calm, luxury restaurant aesthetic

---

*BurgerBliss — Where Fire Meets Flavor. 🍔*
