import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const CATS = ['Buns', 'Patties', 'Cheese', 'Sauces', 'Veggies'];

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

export default function CustomizePage() {
  const [ingredients, setIngredients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState('Buns');
  const [burgerName, setBurgerName] = useState('');
  const [toasts, setToasts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get('/api/ingredients').then(r => setIngredients(r.data)).catch(() => {});
  }, []);

  const showToast = (msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const addIngredient = (ing) => {
    if (selected.find(s => s.id === ing.id)) {
      setSelected(prev => prev.filter(s => s.id !== ing.id));
    } else {
      setSelected(prev => [...prev, ing]);
    }
  };

  const removeIngredient = (id) => setSelected(prev => prev.filter(s => s.id !== id));

  const totalPrice = selected.reduce((sum, s) => sum + parseFloat(s.price), 0);

  const handleAddToCart = () => {
    if (selected.length === 0) { showToast('Please select at least one ingredient!'); return; }
    const name = burgerName.trim() || 'Custom Burger';
    const customIngredients = selected.map(s => s.name).join(', ');
    addToCart({
      id: `custom_${Date.now()}`, cartId: Date.now(),
      name, price: totalPrice, is_custom: true,
      custom_ingredients: customIngredients,
      kcal: 0, protein: 0, quantity: 1
    });
    showToast('Customised Burger added to cart!');
    setSelected([]); setBurgerName('');
  };

  const filteredIngredients = ingredients.filter(i => i.category === activeTab);

  const hasBun = selected.some(s => s.category === 'Buns');
  const hasTopBun = hasBun;

  // Group selected by category for display
  const orderedSelected = [
    ...selected.filter(s => s.category === 'Patties'),
    ...selected.filter(s => s.category === 'Cheese'),
    ...selected.filter(s => s.category === 'Veggies'),
    ...selected.filter(s => s.category === 'Sauces'),
  ];

  return (
    <div className="page" style={{ background: '#12100d', minHeight: '100vh' }}>
      <div style={{ padding: '40px 32px', maxWidth: '100%', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: '#a07830', marginBottom: 8 }}>BurgerBliss</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem,3vw,2.8rem)', color: '#e8dcc8' }}>Build Your Perfect Burger</h1>
          <p style={{ color: '#d4c4a8', fontWeight: 300, marginTop: 8 }}>Select ingredients from the library to craft your masterpiece.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 300px', gap: 24, minHeight: 600 }}>
          {/* LEFT: Ingredients Library */}
          <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 20, overflowY: 'auto', maxHeight: '75vh' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', marginBottom: 16, fontSize: '1.1rem' }}>Ingredients Library</h3>
            {/* Category tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {CATS.map(c => (
                <button key={c} onClick={() => setActiveTab(c)} style={{
                  padding: '5px 12px', borderRadius: 20, border: '1px solid',
                  borderColor: activeTab === c ? '#a07830' : 'rgba(255,255,255,0.1)',
                  background: activeTab === c ? 'rgba(160,120,48,0.2)' : 'transparent',
                  color: activeTab === c ? '#d4c4a8' : 'rgba(212,196,168,0.5)',
                  cursor: 'pointer', fontFamily: 'Poppins', fontSize: '0.78rem', fontWeight: 500, transition: 'all 0.2s'
                }}>{c}</button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredIngredients.map(ing => {
                const isSelected = selected.find(s => s.id === ing.id);
                return (
                  <div key={ing.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', borderRadius: 12, border: '1px solid',
                    borderColor: isSelected ? 'rgba(160,120,48,0.5)' : 'rgba(255,255,255,0.07)',
                    background: isSelected ? 'rgba(160,120,48,0.1)' : 'rgba(255,255,255,0.02)',
                    transition: 'all 0.2s'
                  }}>
                    <div>
                      <div style={{ color: '#e8dcc8', fontSize: '0.88rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {ing.name}
                        {ing.is_popular ? <span style={{ fontSize: '0.65rem', background: 'rgba(160,120,48,0.2)', color: '#a07830', borderRadius: 10, padding: '1px 6px' }}>Popular</span> : null}
                        {ing.is_diet ? <span style={{ fontSize: '0.65rem', background: 'rgba(92,100,48,0.2)', color: '#7a8540', borderRadius: 10, padding: '1px 6px' }}>Diet</span> : null}
                        {ing.is_keto ? <span style={{ fontSize: '0.65rem', background: 'rgba(50,80,100,0.2)', color: '#6090a0', borderRadius: 10, padding: '1px 6px' }}>Keto</span> : null}
                      </div>
                      <div style={{ color: '#a07830', fontSize: '0.82rem', marginTop: 2 }}>₹{ing.price}</div>
                    </div>
                    <button onClick={() => addIngredient(ing)} style={{
                      width: 28, height: 28, borderRadius: '50%', border: '1px solid',
                      borderColor: isSelected ? '#a07830' : 'rgba(255,255,255,0.2)',
                      background: isSelected ? '#a07830' : 'transparent',
                      color: '#fff', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}>
                      {isSelected ? '✓' : '+'}
                    </button>
                  </div>
                );
              })}
              {filteredIngredients.length === 0 && (
                <div style={{ color: 'rgba(212,196,168,0.4)', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>Loading...</div>
              )}
            </div>
          </div>

          {/* MIDDLE: Live Preview */}
          <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', fontSize: '1.1rem' }}>Live Preview</h3>
              <div style={{ color: '#a07830', fontWeight: 700, fontSize: '1.1rem' }}>₹{totalPrice}</div>
            </div>

            {/* Burger name input */}
            <input
              className="form-input" placeholder="Name your burger (optional)"
              value={burgerName} onChange={e => setBurgerName(e.target.value)}
              style={{ width: '100%', marginBottom: 24, textAlign: 'center', fontSize: '0.9rem' }}
            />

            {/* Visual Stack */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 300 }}>
              {selected.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'rgba(212,196,168,0.3)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: 12 }}>🍔</div>
                  <p style={{ fontSize: '0.9rem' }}>Select ingredients to start building</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, width: '100%', maxWidth: 280 }}>
                  {/* Top Bun */}
                  <div style={{
                    width: '100%', textAlign: 'center', padding: '14px 20px', borderRadius: '50% 50% 0 0 / 30% 30% 0 0',
                    background: 'linear-gradient(180deg, #8B6914 0%, #a07830 100%)',
                    color: '#fff', fontWeight: 600, fontSize: '0.9rem', letterSpacing: 1,
                    boxShadow: '0 -2px 12px rgba(160,120,48,0.3)', fontFamily: 'Playfair Display, serif',
                    animation: 'fadeIn 0.4s ease'
                  }}>
                    {selected.find(s => s.category === 'Buns')?.name || 'Top Bun'}
                  </div>

                  {/* Selected ingredients in order */}
                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 0' }}>
                    {orderedSelected.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(212,196,168,0.35)', fontSize: '0.82rem' }}>
                        Select patty, cheese, veggies...
                      </div>
                    ) : orderedSelected.map((ing, i) => (
                      <div key={ing.id} style={{
                        textAlign: 'center', padding: '8px 16px', color: '#e8dcc8', fontSize: '0.88rem',
                        borderBottom: i < orderedSelected.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        animation: 'fadeIn 0.3s ease',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8
                      }}>
                        <span style={{ color: '#a07830', fontSize: '0.7rem' }}>
                          {ing.category === 'Patties' ? '🥩' : ing.category === 'Cheese' ? '🧀' : ing.category === 'Veggies' ? '🥗' : '🫙'}
                        </span>
                        {ing.name}
                        <button onClick={() => removeIngredient(ing.id)} style={{ background: 'none', border: 'none', color: 'rgba(212,196,168,0.3)', cursor: 'pointer', fontSize: '0.75rem', marginLeft: 4 }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Bun */}
                  <div style={{
                    width: '100%', textAlign: 'center', padding: '10px 20px', borderRadius: '0 0 8px 8px',
                    background: 'linear-gradient(180deg, #8B6914 0%, #6b4f10 100%)',
                    color: '#fff', fontWeight: 500, fontSize: '0.85rem',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                  }}>
                    Bottom Bun
                  </div>
                </div>
              )}
            </div>
            <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
          </div>

          {/* RIGHT: Order Summary */}
          <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', marginBottom: 16, fontSize: '1.1rem' }}>Order Summary</h3>

            {selected.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(212,196,168,0.35)', fontSize: '0.85rem', textAlign: 'center' }}>
                No ingredients selected yet
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto', maxHeight: '45vh' }}>
                {CATS.map(cat => {
                  const catItems = selected.filter(s => s.category === cat);
                  if (catItems.length === 0) return null;
                  return (
                    <div key={cat} style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#a07830', marginBottom: 6, fontWeight: 500 }}>{cat}</div>
                      {catItems.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ color: '#d4c4a8', fontSize: '0.85rem' }}>{item.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: '#a07830', fontSize: '0.85rem' }}>₹{item.price}</span>
                            <button onClick={() => removeIngredient(item.id)} style={{ background: 'none', border: 'none', color: 'rgba(212,196,168,0.3)', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', fontSize: '1rem' }}>Total</span>
                <span style={{ color: '#a07830', fontWeight: 700, fontSize: '1.2rem' }}>₹{totalPrice}</span>
              </div>
              <button className="btn-primary" onClick={handleAddToCart} style={{ width: '100%', borderRadius: 12, padding: '12px' }}>
                Add to Cart
              </button>
              {selected.length > 0 && (
                <button onClick={() => setSelected([])} style={{ width: '100%', marginTop: 8, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'rgba(212,196,168,0.5)', cursor: 'pointer', fontFamily: 'Poppins', fontSize: '0.85rem' }}>
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toast items={toasts} />
      <style>{`@media(max-width:1024px){div[style*="gridTemplateColumns:'300px"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
