import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isLoggedIn } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="navbar-logo">🍔 BurgerBliss</Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/games">Games</Link>
        <Link to="/customize">Customize</Link>
        <Link to="/cart" className="cart-icon">
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        {isLoggedIn ? (
          <>
            <span style={{ color: 'var(--beige2)', fontSize: '0.85rem', padding: '8px 10px' }}>Hi, {user.name.split(' ')[0]}</span>
            <button onClick={handleLogout} className="nav-btn" style={{ border: 'none', cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="nav-btn">Login</Link>
        )}
      </div>
    </nav>
  );
}
