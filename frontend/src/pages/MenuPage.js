import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['All', 'Veg', 'Non-Veg', 'Diet', 'Keto'];
function Toast({ items }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map(t => (
        <div key={t.id} style={{
          background: 'rgba(26,18,8,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(160,120,48,0.3)',
          borderRadius: 14, padding: '14px 20px', color: '#e8dcc8', fontSize: '0.9rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 10, minWidth: 260,
          animation: 'slideUp 0.3s ease-out'
        }}>
          <span style={{ color: '#a07830', fontWeight: 700 }}>✓</span> {t.message}
        </div>
      ))}
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

export default function MenuPage() {
  const [burgers, setBurgers] = useState([]);
  const [category, setCategory] = useState('All');
  const [toasts, setToasts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        const res = await axios.get(`/api/menu${category !== 'All' ? `?category=${category}` : ''}`);
        setBurgers(res.data);
      } catch {
        // fallback static data
        setBurgers([]);
      }
    };
    fetchBurgers();
  }, [category]);

  const showToast = (msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleAdd = (burger) => {
    addToCart({ ...burger, cartId: Date.now() });
    showToast(`${burger.name} added to cart`);
  };

  return (
    <div className="page" style={{ background: '#12100d', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ padding: '60px 40px 40px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: '#a07830', marginBottom: 10 }}>BurgerBliss</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,4vw,3rem)', color: '#e8dcc8', marginBottom: 10 }}>Our Crafted Menu</h1>
        <p style={{ color: '#d4c4a8', fontWeight: 300 }}>Every burger, a masterpiece of flavor and craft.</p>
      </div>

     <div style={{ padding: '40px', maxWidth: 1200, margin: '0 auto' }}>
  {/* Filter tabs */}
  <div className="filter-tabs">
    {CATEGORIES.map(cat => (
      <button 
        key={cat} 
        className={`tab-btn${category === cat ? ' active' : ''}`} 
        onClick={() => setCategory(cat)}
      >
        {cat}
      </button>
    ))}
  </div>

        {/* Grid */}
        <div className="burger-grid">
          {burgers.map(burger => (
            <div key={burger.id} className="burger-card">
              <div style={{ 
                 height: 180,
                 background: 'linear-gradient(135deg, #2a1a08 0%, #1a1208 60%, #0d0b08 100%)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 borderBottom: '1px solid rgba(255,255,255,0.05)',
                 position: 'relative', overflow: 'hidden'
                   }}>
               <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(160,120,48,0.08) 0%, transparent 70%)'
           }}/>
       <div style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '3.5rem', color: 'rgba(160,120,48,0.15)',
          fontWeight: 700, letterSpacing: 2, userSelect: 'none'
           }}>
          BB
          </div>
         </div>
              <div className="burger-info">
                
                <div className="burger-name">{burger.name}</div>
                <div className="burger-desc">{burger.description}</div>
                {burger.tags && (
                  <div className="ingredient-tags">
                    {burger.tags.split(',').slice(0, 3).map((tag, i) => (
                      <span key={i} className="tag">{tag.trim()}</span>
                    ))}
                  </div>
                )}
                {(burger.kcal > 0 || burger.protein > 0) && (
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    {burger.kcal > 0 && <span style={{ fontSize: '0.75rem', color: 'rgba(212,196,168,0.5)' }}>🔥 {burger.kcal} kcal</span>}
                    {burger.protein > 0 && <span style={{ fontSize: '0.75rem', color: 'rgba(212,196,168,0.5)' }}>💪 {burger.protein}g protein</span>}
                  </div>
                )}
                <div className="burger-footer">
                  <span className="burger-price">₹{burger.price}</span>
                  <button className="add-btn" onClick={() => handleAdd(burger)}>+ Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {burgers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(212,196,168,0.4)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🍔</div>
            <p>Loading delicious burgers...</p>
          </div>
        )}
      </div>

      <Toast items={toasts} />
    </div>
  );
}
