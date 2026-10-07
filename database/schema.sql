-- BurgerBliss Database Schema
-- Run this in MySQL Workbench

CREATE DATABASE IF NOT EXISTS burgerbliss;
USE burgerbliss;

-- Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  role ENUM('user', 'admin') DEFAULT 'user',
  reward_points INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Burgers Table (Menu)
CREATE TABLE burgers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category ENUM('Veg', 'Non-Veg', 'Diet', 'Keto') NOT NULL,
  tags VARCHAR(255),
  kcal INT DEFAULT 0,
  protein INT DEFAULT 0,
  image_url VARCHAR(255),
  is_available TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ingredients Table
CREATE TABLE ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category ENUM('Buns', 'Patties', 'Cheese', 'Sauces', 'Veggies') NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_popular TINYINT(1) DEFAULT 0,
  is_diet TINYINT(1) DEFAULT 0,
  is_keto TINYINT(1) DEFAULT 0,
  kcal INT DEFAULT 0,
  protein INT DEFAULT 0,
  is_available TINYINT(1) DEFAULT 1
);

-- Orders Table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_amount DECIMAL(10,2) NOT NULL,
  gst_amount DECIMAL(10,2) NOT NULL,
  reward_discount DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL,
  status ENUM('Pending', 'Preparing', 'Ready', 'Completed') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  burger_id INT,
  burger_name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_custom TINYINT(1) DEFAULT 0,
  custom_name VARCHAR(100),
  custom_ingredients TEXT,
  kcal INT DEFAULT 0,
  protein INT DEFAULT 0,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (burger_id) REFERENCES burgers(id) ON DELETE SET NULL
);

-- Rewards Table
CREATE TABLE rewards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  reward_type VARCHAR(50),
  reward_value VARCHAR(50),
  is_used TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Admin Settings
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value VARCHAR(255) NOT NULL
);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value) VALUES
('gst_percent', '18'),
('restaurant_name', 'BurgerBliss'),
('restaurant_address', '123, Food Street, Mumbai, Maharashtra'),
('restaurant_phone', '+91 98765 43210');

-- Insert default admin
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@burgerbliss.com', '$2b$10$rQZ9z1kJpX2mN3oP4qR5suVwXyZ0aB1cD2eF3gH4iJ5kL6mN7oP8q', 'admin');
-- Default admin password: Admin@123

-- Insert Menu Burgers
INSERT INTO burgers (name, description, price, category, tags, kcal, protein) VALUES
('Aloo Tikki Burger', 'Crispy potato patty with fresh veggies', 50, 'Veg', 'Crispy Patty, Fresh Veggies, House Sauce', 280, 6),
('Cheese Veg Burger', 'Loaded with melted cheese and veggies', 90, 'Veg', 'Melted Cheese, Fresh Veggies, Special Sauce', 350, 10),
('Paneer Burger', 'Grilled paneer patty with special sauce', 120, 'Veg', 'Grilled Paneer, Signature Sauce, Chef Special', 320, 18),
('Maharaja Veg Burger', 'Double patty with exotic veggies', 180, 'Veg', 'Double Patty, Exotic Veggies, Royal Sauce', 480, 16),
('Spicy Veg Burger', 'Crispy veg patty with spicy mayo and fresh lettuce', 80, 'Veg', 'Spicy Mayo, Fresh Lettuce, Crispy Patty', 310, 8),
('Corn & Cheese Burger', 'Sweet corn patty loaded with melted cheese', 100, 'Veg', 'Sweet Corn, Melted Cheese, Buttery Bun', 330, 9),
('Mexican Veg Burger', 'Bean patty with jalapeños, salsa & Mexican spices', 130, 'Veg', 'Bean Patty, Jalapeños, Salsa, Mexican Spices', 360, 12),
('Tandoori Veg Burger', 'Tandoori-flavored veg patty with onion & mint sauce', 150, 'Veg', 'Tandoori Patty, Mint Sauce, Onion Rings', 340, 11),
('Mushroom Veg Burger', 'Juicy mushroom patty with garlic sauce and veggies', 140, 'Veg', 'Mushroom Patty, Garlic Sauce, Fresh Veggies', 295, 9),
('Classic Veg Burger', 'Simple veg patty with onion, tomato & house sauce', 70, 'Veg', 'Veg Patty, House Sauce, Classic Style', 260, 7),
('Chicken Burger', 'Juicy grilled chicken patty', 110, 'Non-Veg', 'Grilled Chicken, Signature Sauce, Sesame Bun', 380, 28),
('Chicken Crispy Burger', 'Extra crispy chicken with special sauce', 140, 'Non-Veg', 'Crispy Chicken, Special Sauce, Premium Bun', 420, 30),
('Diet Veg Burger', 'Grilled Veg Diet Patty', 150, 'Diet', 'Grilled Diet Patty, Light Sauce, Whole Grain Bun', 220, 10),
('Diet Paneer Burger', 'Grilled Paneer Diet Patty', 180, 'Diet', 'Grilled Paneer, No Mayo, Diet Friendly', 240, 20),
('Diet Grilled Chicken Burger', 'No mayo, light sauce', 200, 'Diet', 'Grilled Chicken, Light Sauce, Low Calorie', 280, 32),
('Keto Chicken Burger', 'Keto chicken patty', 220, 'Keto', 'Keto Patty, Lettuce Wrap, Zero Carb', 310, 35),
('Keto Paneer Burger', 'Keto paneer patty', 200, 'Keto', 'Keto Paneer, Cheese, Low Carb', 290, 22);

-- Insert Ingredients
INSERT INTO ingredients (name, category, price, is_popular) VALUES
('Soft Bun', 'Buns', 30, 0), ('Sesame Bun', 'Buns', 35, 0), ('Wheat Bun', 'Buns', 40, 1),
('Potato Bun', 'Buns', 45, 0), ('Multigrain', 'Buns', 50, 0), ('Brioche', 'Buns', 60, 0),
('Herb Bun', 'Buns', 55, 0), ('Diet Bun', 'Buns', 65, 1), ('Keto Bun', 'Buns', 70, 0),
('Aloo Tikki', 'Patties', 50, 0), ('Veg Patty', 'Patties', 55, 1), ('Cheese Veg', 'Patties', 65, 0),
('Paneer Patty', 'Patties', 60, 1), ('Chicken', 'Patties', 70, 0), ('Crispy Chicken', 'Patties', 75, 0),
('Grilled Chicken', 'Patties', 72, 0), ('Tandoori Chicken', 'Patties', 78, 0),
('Grilled Veg Diet', 'Patties', 65, 0), ('Keto Chicken', 'Patties', 85, 0),
('Processed Cheese', 'Cheese', 30, 1), ('Cheddar', 'Cheese', 40, 0), ('Mozzarella', 'Cheese', 45, 1),
('Paneer Cheese', 'Cheese', 35, 0), ('Cheese Slice', 'Cheese', 25, 0),
('Mayonnaise', 'Sauces', 15, 1), ('Tandoori Mayo', 'Sauces', 20, 0), ('Schezwan', 'Sauces', 20, 1),
('Ketchup', 'Sauces', 10, 1), ('Mustard', 'Sauces', 15, 0), ('Peri Peri', 'Sauces', 20, 0),
('Cheese Sauce', 'Sauces', 25, 0), ('BBQ Sauce', 'Sauces', 20, 1),
('Lettuce', 'Veggies', 15, 1), ('Tomato', 'Veggies', 10, 1), ('Onion', 'Veggies', 10, 1),
('Pickles', 'Veggies', 12, 0), ('Jalapeños', 'Veggies', 20, 0), ('Mushrooms', 'Veggies', 25, 0),
('Avocado', 'Veggies', 35, 0), ('Bell Peppers', 'Veggies', 18, 0);
