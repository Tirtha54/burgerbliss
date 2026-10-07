import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './index.css';

import Navbar from './components/Navbar';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MenuPage from './pages/MenuPage';
import CustomizePage from './pages/CustomizePage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import GamesPage from './pages/GamesPage';
import AboutPage from './pages/AboutPage';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      {user?.role !== 'admin' && <Navbar />}
      <Toast />
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/signup"    element={<SignupPage />} />
        <Route path="/about"     element={<AboutPage />} />
        <Route path="/menu"      element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
        <Route path="/customize" element={<ProtectedRoute><CustomizePage /></ProtectedRoute>} />
        <Route path="/cart"      element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/payment"   element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/games"     element={<ProtectedRoute><GamesPage /></ProtectedRoute>} />
        <Route path="/admin"     element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="*"          element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}