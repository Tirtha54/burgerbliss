import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function ToastMsg({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      background: type === 'error' ? 'rgba(120,30,20,0.9)' : 'rgba(60,80,30,0.9)',
      backdropFilter: 'blur(20px)', border: `1px solid ${type === 'error' ? 'rgba(200,50,30,0.4)' : 'rgba(100,140,50,0.4)'}`,
      borderRadius: 12, padding: '12px 18px', color: '#fff', fontSize: '0.88rem',
      marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
      animation: 'fadeIn 0.3s ease'
    }}>
      <span>{type === 'error' ? '⚠️' : '✓'}</span> {msg}
    </div>
  );
}

export default function LoginPage() {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (!email.includes('@')) return 'Email must contain @ symbol.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least 1 uppercase letter.';
    if (!/[0-9]/.test(password)) return 'Password must contain at least 1 number.';
    if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least 1 special character (!@#$%^&*).';
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/login', { email, password, role });
      login(res.data.user, res.data.token);
      if (res.data.user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', fontFamily: 'Poppins, sans-serif' }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}} @keyframes slowZoom{from{transform:scale(1)}to{transform:scale(1.06)}}`}</style>
      {/* Left panel */}
      <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute', inset: 0, animation: 'slowZoom 20s ease-in-out infinite alternate',
          background: 'linear-gradient(135deg, #1a0f05 0%, #2a1a08 40%, #0d0b08 100%)'
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.8) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '48px 40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 24 }}>🍔</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', color: '#e8dcc8', marginBottom: 16, lineHeight: 1.3 }}>Welcome Back to<br />BurgerBliss</h1>
          <p style={{ color: '#d4c4a8', fontWeight: 300, lineHeight: 1.7, maxWidth: 300, margin: '0 auto' }}>Sign in to continue your premium flavor journey.</p>
          <div style={{ marginTop: 40, display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['🌿 Fresh Daily', '👨‍🍳 Chef Crafted', '⚡ Fast Delivery'].map(t => (
              <div key={t} style={{ color: '#a07830', fontSize: '0.85rem', fontWeight: 500 }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ background: '#12100d', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
        <div style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '40px 36px', boxShadow: '0 0 60px rgba(160,120,48,0.1), 0 20px 60px rgba(0,0,0,0.5)', animation: 'fadeIn 0.6s ease' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#e8dcc8', marginBottom: 6 }}>Sign In</h2>
          <p style={{ color: '#a07830', fontSize: '0.85rem', marginBottom: 28 }}>Access your BurgerBliss account</p>

          {/* Role selector */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {['user', 'admin'].map(r => (
              <button key={r} onClick={() => setRole(r)} style={{
                flex: 1, padding: '10px', borderRadius: 12, border: '1px solid',
                borderColor: role === r ? '#a07830' : 'rgba(255,255,255,0.1)',
                background: role === r ? 'rgba(160,120,48,0.15)' : 'transparent',
                color: role === r ? '#d4c4a8' : 'rgba(212,196,168,0.5)',
                cursor: 'pointer', fontFamily: 'Poppins', fontSize: '0.88rem', fontWeight: 500,
                textTransform: 'capitalize', transition: 'all 0.2s'
              }}>{r === 'user' ? '👤 User' : '🔐 Admin'}</button>
            ))}
          </div>

          <ToastMsg msg={error} type="error" />

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email Address</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-group" style={{ position: 'relative' }}>
              <label>Password</label>
              <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 48 }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: 36, background: 'none', border: 'none', color: '#a07830', cursor: 'pointer', fontSize: '1rem' }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#d4c4a8', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: '#a07830' }} />
                Remember me
              </label>
              <a href="#" style={{ color: '#a07830', fontSize: '0.85rem', textDecoration: 'none' }}>Forgot Password?</a>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', borderRadius: 12, fontSize: '1rem', marginBottom: 20 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'rgba(212,196,168,0.6)', fontSize: '0.88rem' }}>
            Didn't login yet?{' '}
            <Link to="/signup" style={{ color: '#a07830', textDecoration: 'none', fontWeight: 500 }}>Sign up</Link>
          </p>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`@media(max-width:768px){div[style*="gridTemplateColumns"]{grid-template-columns:1fr!important} div[style*="background:'#12100d'"]:first-of-type{display:none}}`}</style>
    </div>
  );
}
