import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.email.includes('@')) return 'Email must contain @ symbol.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(form.password)) return 'Password must have at least 1 uppercase letter.';
    if (!/[0-9]/.test(form.password)) return 'Password must have at least 1 number.';
    if (!/[!@#$%^&*]/.test(form.password)) return 'Password must have at least 1 special character (!@#$%^&*).';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError('');
    try {
      await axios.post('/api/auth/signup', { name: form.name, email: form.email, password: form.password });
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#12100d', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Poppins, sans-serif' }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ width: '100%', maxWidth: 440, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '44px 40px', boxShadow: '0 0 60px rgba(160,120,48,0.1)', animation: 'fadeIn 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🍔</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.9rem', color: '#e8dcc8', marginBottom: 6 }}>Create Account</h2>
          <p style={{ color: '#a07830', fontSize: '0.85rem' }}>Join the BurgerBliss experience</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(120,30,20,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(200,50,30,0.4)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: '0.88rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(50,80,20,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(100,150,40,0.4)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: '0.88rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name', key: 'name', type: 'text', ph: 'Your name' },
            { label: 'Email Address', key: 'email', type: 'email', ph: 'you@example.com' },
          ].map(f => (
            <div className="input-group" key={f.key}>
              <label>{f.label}</label>
              <input className="form-input" type={f.type} placeholder={f.ph} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required />
            </div>
          ))}

          <div className="input-group" style={{ position: 'relative' }}>
            <label>Password</label>
            <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="Min 8 chars, uppercase, number, special char" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: 48 }} />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: 36, background: 'none', border: 'none', color: '#a07830', cursor: 'pointer' }}>
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input className="form-input" type="password" placeholder="Re-enter password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
          </div>

          <div style={{ background: 'rgba(160,120,48,0.08)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: '0.78rem', color: 'rgba(212,196,168,0.7)' }}>
            Password must be: 8+ chars · 1 uppercase · 1 number · 1 special character (!@#$%^&*)
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: 14, borderRadius: 12, fontSize: '1rem', marginBottom: 20 }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'rgba(212,196,168,0.6)', fontSize: '0.88rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#a07830', textDecoration: 'none', fontWeight: 500 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
