# BurgerBliss

A burger ordering web app (React + Node/Express + MySQL).

## Setup
1. Install MySQL Server and run `database/schema.sql` in MySQL Workbench.
2. Create `backend/.env`:
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=burgerbliss
3. Backend: `cd backend`, `npm install`, `npm start` (port 5000)
4. Frontend: `cd frontend`, `npm install`, `npm start` (port 3000)

Default admin: admin@burgerbliss.com / Admin@123