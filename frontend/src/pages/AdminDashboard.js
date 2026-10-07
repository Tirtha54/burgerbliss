import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SIDEBAR = [
  { id: 'overview', label: 'Dashboard', icon: '📊' },
  { id: 'orders', label: 'Orders', icon: '📦' },
  { id: 'menu', label: 'Manage Menu', icon: '🍔' },
  { id: 'ingredients', label: 'Ingredients', icon: '🧩' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'rewards', label: 'Rewards', icon: '🎮' },
];

const STATUS_COLORS = { Pending: '#8B6914', Preparing: '#5c6430', Ready: '#a07830', Completed: '#4a5228' };

function StatCard({ icon, label, value }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ fontSize: '2.2rem' }}>{icon}</div>
      <div>
        <div style={{ color: 'rgba(212,196,168,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>{label}</div>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#a07830', fontWeight: 700 }}>{value}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [active, setActive] = useState('overview');
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [burgers, setBurgers] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [users, setUsers] = useState([]);
  const [editBurger, setEditBurger] = useState(null);
  const [newBurger, setNewBurger] = useState({ name: '', description: '', price: '', category: 'Veg', tags: '', kcal: '', protein: '' });
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (active === 'overview') {
      axios.get('/api/orders/admin/stats', { headers }).then(r => setStats(r.data)).catch(() => {});
    }
    if (active === 'orders') {
      axios.get('/api/orders/admin/all', { headers }).then(r => setOrders(r.data)).catch(() => {});
    }
    if (active === 'menu') {
      axios.get('/api/menu').then(r => setBurgers(r.data)).catch(() => {});
    }
    if (active === 'ingredients') {
      axios.get('/api/ingredients').then(r => setIngredients(r.data)).catch(() => {});
    }
    if (active === 'users') {
      axios.get('/api/users', { headers }).then(r => setUsers(r.data)).catch(() => {});
    }
  }, [active]);

  const updateOrderStatus = async (id, status) => {
    await axios.put(`/api/orders/admin/${id}/status`, { status }, { headers });
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const addBurger = async () => {
    if (!newBurger.name || !newBurger.price) return;
    await axios.post('/api/menu', newBurger, { headers });
    const r = await axios.get('/api/menu');
    setBurgers(r.data);
    setNewBurger({ name: '', description: '', price: '', category: 'Veg', tags: '', kcal: '', protein: '' });
  };

  const toggleUser = async (id) => {
    await axios.put(`/api/users/${id}/toggle`, {}, { headers });
    setUsers(users.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u));
  };

  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 12px', color: '#e8dcc8', fontFamily: 'Poppins', fontSize: '0.85rem', outline: 'none', width: '100%' };
  const thStyle = { padding: '10px 14px', textAlign: 'left', color: 'rgba(212,196,168,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500 };
  const tdStyle = { padding: '12px 14px', color: '#d4c4a8', fontSize: '0.88rem', borderBottom: '1px solid rgba(255,255,255,0.04)' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0d0a', fontFamily: 'Poppins, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '28px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0 }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#e8dcc8', marginBottom: 32, padding: '0 8px' }}>🍔 BurgerBliss</div>
        {SIDEBAR.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: active === s.id ? 'rgba(160,120,48,0.2)' : 'transparent',
            color: active === s.id ? '#a07830' : 'rgba(212,196,168,0.6)',
            fontFamily: 'Poppins', fontSize: '0.88rem', fontWeight: active === s.id ? 600 : 400, marginBottom: 4, transition: 'all 0.2s',
            borderLeft: active === s.id ? '2px solid #a07830' : '2px solid transparent'
          }}>
            <span>{s.icon}</span> {s.label}
          </button>
        ))}
        <button onClick={() => { logout(); navigate('/'); }} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'rgba(120,30,20,0.1)', color: 'rgba(200,100,80,0.7)', fontFamily: 'Poppins', fontSize: '0.88rem' }}>
          🚪 Logout
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 220, padding: '32px 36px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', fontSize: '1.8rem' }}>
            {SIDEBAR.find(s => s.id === active)?.label}
          </h2>
          <div style={{ padding: '6px 14px', background: 'rgba(160,120,48,0.15)', border: '1px solid rgba(160,120,48,0.3)', borderRadius: 20, color: '#a07830', fontSize: '0.8rem' }}>
            🔐 Admin
          </div>
        </div>

        {/* OVERVIEW */}
        {active === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 36 }}>
              <StatCard icon="📦" label="Orders Today" value={stats.total_orders || 0} />
              <StatCard icon="💰" label="Revenue Today" value={`₹${stats.total_revenue || 0}`} />
              <StatCard icon="👥" label="Active Users" value={stats.active_users || 0} />
              <StatCard icon="🏆" label="Top Burger" value={stats.popular_burger || 'N/A'} />
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '24px', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', marginBottom: 16 }}>Quick Overview</h3>
              <p style={{ color: 'rgba(212,196,168,0.6)', lineHeight: 1.8, fontSize: '0.9rem' }}>
                Welcome to the BurgerBliss Admin Dashboard. Use the sidebar to manage your menu, view orders, and monitor your restaurant's performance. Click on Orders to view and update order statuses, or Manage Menu to add or edit burgers.
              </p>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {active === 'orders' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Date', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: 40, color: 'rgba(212,196,168,0.3)' }}>No orders yet</td></tr>
                ) : orders.map(order => (
                  <tr key={order.id}>
                    <td style={tdStyle}>#{order.id}</td>
                    <td style={tdStyle}><div>{order.user_name || 'Guest'}</div><div style={{ color: 'rgba(212,196,168,0.4)', fontSize: '0.75rem' }}>{order.user_email}</div></td>
                    <td style={{ ...tdStyle, maxWidth: 200 }}><div style={{ fontSize: '0.82rem', color: 'rgba(212,196,168,0.7)' }}>{order.order_items?.map(i => `${i.burger_name} ×${i.quantity}`).join(', ')}</div></td>
                    <td style={tdStyle}><span style={{ color: '#a07830', fontWeight: 600 }}>₹{parseFloat(order.final_amount).toFixed(2)}</span></td>
                    <td style={tdStyle}>
                      <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 500, background: `${STATUS_COLORS[order.status]}22`, color: STATUS_COLORS[order.status], border: `1px solid ${STATUS_COLORS[order.status]}44` }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontSize: '0.78rem' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)} style={{ ...inputStyle, width: 'auto', padding: '4px 8px', cursor: 'pointer' }}>
                        {['Pending', 'Preparing', 'Ready', 'Completed'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MENU */}
        {active === 'menu' && (
          <div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', padding: '24px', marginBottom: 24 }}>
              <h3 style={{ color: '#e8dcc8', fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>Add New Burger</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {[['Name', 'name', 'text'], ['Description', 'description', 'text'], ['Price', 'price', 'number'], ['Tags', 'tags', 'text'], ['Kcal', 'kcal', 'number'], ['Protein', 'protein', 'number']].map(([label, key, type]) => (
                  <div key={key}>
                    <div style={{ color: 'rgba(212,196,168,0.5)', fontSize: '0.75rem', marginBottom: 4, textTransform: 'uppercase' }}>{label}</div>
                    <input style={inputStyle} type={type} value={newBurger[key]} onChange={e => setNewBurger({ ...newBurger, [key]: e.target.value })} placeholder={label} />
                  </div>
                ))}
                <div>
                  <div style={{ color: 'rgba(212,196,168,0.5)', fontSize: '0.75rem', marginBottom: 4, textTransform: 'uppercase' }}>Category</div>
                  <select style={inputStyle} value={newBurger.category} onChange={e => setNewBurger({ ...newBurger, category: e.target.value })}>
                    {['Veg', 'Non-Veg', 'Diet', 'Keto'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn-primary" onClick={addBurger} style={{ marginTop: 16, borderRadius: 10, padding: '10px 24px' }}>+ Add Burger</button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Name', 'Category', 'Price', 'Tags', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {burgers.map(b => (
                    <tr key={b.id}>
                      <td style={tdStyle}><div style={{ fontWeight: 500 }}>{b.name}</div><div style={{ color: 'rgba(212,196,168,0.4)', fontSize: '0.77rem' }}>{b.description}</div></td>
                      <td style={tdStyle}><span style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(160,120,48,0.1)', border: '1px solid rgba(160,120,48,0.2)', color: '#a07830', fontSize: '0.78rem' }}>{b.category}</span></td>
                      <td style={{ ...tdStyle, color: '#a07830', fontWeight: 600 }}>₹{b.price}</td>
                      <td style={{ ...tdStyle, fontSize: '0.8rem', color: 'rgba(212,196,168,0.5)' }}>{b.tags?.split(',').slice(0, 2).join(', ')}</td>
                      <td style={tdStyle}><span style={{ color: b.is_available ? '#7a8540' : '#c0392b', fontSize: '0.82rem' }}>{b.is_available ? '● Active' : '○ Disabled'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INGREDIENTS */}
        {active === 'ingredients' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['Name', 'Category', 'Price', 'Tags'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {ingredients.map(ing => (
                  <tr key={ing.id}>
                    <td style={tdStyle}>{ing.name}</td>
                    <td style={tdStyle}><span style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(92,100,48,0.1)', color: '#7a8540', fontSize: '0.78rem', border: '1px solid rgba(92,100,48,0.2)' }}>{ing.category}</span></td>
                    <td style={{ ...tdStyle, color: '#a07830', fontWeight: 600 }}>₹{ing.price}</td>
                    <td style={tdStyle}>
                      {ing.is_popular ? <span style={{ marginRight: 6, fontSize: '0.72rem', background: 'rgba(160,120,48,0.1)', color: '#a07830', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(160,120,48,0.2)' }}>Popular</span> : null}
                      {ing.is_diet ? <span style={{ marginRight: 6, fontSize: '0.72rem', background: 'rgba(92,100,48,0.1)', color: '#7a8540', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(92,100,48,0.2)' }}>Diet</span> : null}
                      {ing.is_keto ? <span style={{ fontSize: '0.72rem', background: 'rgba(50,80,100,0.1)', color: '#6090a0', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(50,80,100,0.2)' }}>Keto</span> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* USERS */}
        {active === 'users' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['ID', 'Name', 'Email', 'Phone', 'Orders', 'Status', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: 40, color: 'rgba(212,196,168,0.3)' }}>No users yet</td></tr>
                ) : users.map(u => (
                  <tr key={u.id}>
                    <td style={tdStyle}>#{u.id}</td>
                    <td style={tdStyle}>{u.name}</td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>{u.phone || '—'}</td>
                    <td style={tdStyle}>{u.total_orders}</td>
                    <td style={tdStyle}><span style={{ color: u.is_active ? '#7a8540' : '#c0392b', fontSize: '0.82rem' }}>{u.is_active ? '● Active' : '○ Disabled'}</span></td>
                    <td style={tdStyle}>
                      <button onClick={() => toggleUser(u.id)} style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(212,196,168,0.6)', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'Poppins' }}>
                        {u.is_active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REWARDS */}
        {active === 'rewards' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', padding: '32px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', marginBottom: 16 }}>Rewards Configuration</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
              {[['Spin & Win', '5%, 10%, 15%, ₹50, Free Fries'], ['Memory Match', 'Speed-based: 5%-20%'], ['Quiz Challenge', '₹30 OFF for 2+ correct'], ['Daily Offer', '₹20-₹50 or Free Fries']].map(([game, reward]) => (
                <div key={game} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px' }}>
                  <div style={{ color: '#e8dcc8', fontWeight: 500, marginBottom: 6, fontSize: '0.9rem' }}>{game}</div>
                  <div style={{ color: 'rgba(212,196,168,0.5)', fontSize: '0.82rem' }}>{reward}</div>
                </div>
              ))}
            </div>
            <p style={{ color: 'rgba(212,196,168,0.4)', fontSize: '0.85rem' }}>Rewards are automatically saved in localStorage and applied to the cart during checkout.</p>
          </div>
        )}
      </div>
    </div>
  );
}
