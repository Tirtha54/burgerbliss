import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/* ─── SPINNER ─── */
function Spinner({ size = 44, color = '#a07830' }) {
  return (
    <div style={{
      width: size, height: size,
      border: `3px solid rgba(160,120,48,0.15)`,
      borderTop: `3px solid ${color}`,
      borderRadius: '50%',
      animation: 'bbSpin 0.8s linear infinite',
      margin: '0 auto',
    }} />
  );
}

/* ─── SUCCESS CHECKMARK ─── */
function SuccessCheck() {
  return (
    <div style={{
      width: 80, height: 80, borderRadius: '50%',
      background: 'linear-gradient(135deg,#2e7d32,#43a047)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto',
      animation: 'bbPop 0.45s cubic-bezier(.36,1.6,.6,1)',
      boxShadow: '0 8px 32px rgba(67,160,71,0.4)',
    }}>
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
        <polyline points="20 6 9 17 4 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════
   UPI PANEL
══════════════════════════════════════════ */
function UpiPanel({ amount, onSuccess }) {
  const [tab, setTab] = useState('qr');
  const [countdown, setCountdown] = useState(5);
  const [phase, setPhase] = useState('scan'); // scan | verifying | done
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');
  const [idVerified, setIdVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const timerRef = useRef(null);

  // Auto countdown for QR tab
  useEffect(() => {
    if (tab !== 'qr' || phase !== 'scan') return;
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          setPhase('verifying');
          setTimeout(() => { setPhase('done'); onSuccess(); }, 2000);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [tab, phase, onSuccess]);

  const switchTab = (t) => {
    clearInterval(timerRef.current);
    setTab(t);
    setPhase('scan');
    setCountdown(5);
  };

  const verifyUpiId = () => {
    if (!upiId.includes('@')) { setUpiError('Enter a valid UPI ID  e.g. name@okicici'); return; }
    setUpiError(''); setVerifying(true);
    setTimeout(() => { setVerifying(false); setIdVerified(true); }, 1200);
  };

  const payWithId = () => {
    if (!idVerified) return;
    setPhase('verifying');
    setTimeout(() => { setPhase('done'); onSuccess(); }, 2200);
  };

  if (phase === 'verifying') return (
    <div style={{ textAlign: 'center', padding: '24px 0' }}>
      <Spinner size={52} />
      <p style={{ color: '#d4c4a8', marginTop: 18, fontSize: '0.92rem' }}>Verifying payment with your UPI app…</p>
      <p style={{ color: 'rgba(212,196,168,0.4)', fontSize: '0.78rem', marginTop: 4 }}>Do not close this window</p>
    </div>
  );

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 20 }}>
        {[['qr', '📷  Scan QR Code'], ['id', '📝  Enter UPI ID']].map(([t, label]) => (
          <button key={t} onClick={() => switchTab(t)} style={{ flex: 1, padding: '10px', background: tab === t ? 'rgba(160,120,48,0.2)' : 'transparent', border: 'none', color: tab === t ? '#a07830' : 'rgba(212,196,168,0.5)', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: '0.85rem', fontWeight: tab === t ? 600 : 400, transition: 'all .2s' }}>
            {label}
          </button>
        ))}
      </div>

      {/* QR Tab */}
      {tab === 'qr' && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#d4c4a8', fontSize: '0.88rem', marginBottom: 16 }}>Scan with any UPI app to pay <strong style={{ color: '#a07830' }}>₹{amount}</strong></p>

          {/* QR Code */}
          <div style={{ display: 'inline-block', background: '#fff', borderRadius: 16, padding: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', position: 'relative', marginBottom: 12 }}>
            <svg viewBox="0 0 200 200" width="180" height="180" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="200" fill="#fff"/>
              {/* Corner squares */}
              {[[10,10],[130,10],[10,130]].map(([x,y],i) => (
                <g key={i}>
                  <rect x={x} y={y} width={60} height={60} fill="none" stroke="#111" strokeWidth="6"/>
                  <rect x={x+14} y={y+14} width={32} height={32} fill="#111"/>
                </g>
              ))}
              {/* Data dots */}
              {[[82,10],[96,10],[110,10],[82,24],[96,24],[82,38],[110,38],[82,52],[96,52],[110,52],[10,82],[24,82],[38,82],[52,82],[65,82],[82,82],[96,82],[110,82],[124,82],[138,82],[152,82],[166,82],[180,82],[10,96],[38,96],[82,96],[110,96],[138,96],[166,96],[10,110],[24,110],[52,110],[96,110],[124,110],[152,110],[180,110],[10,124],[38,124],[82,124],[96,124],[138,124],[166,124],[82,138],[110,138],[124,138],[152,138],[82,152],[96,152],[124,152],[138,152],[166,152],[96,166],[110,166],[138,166],[166,166],[180,166],[82,180],[110,180],[138,180],[152,180]].map(([x,y],i) => (
                <rect key={i} x={x} y={y} width={11} height={11} fill="#111" rx={1}/>
              ))}
              {/* BurgerBliss B logo in centre */}
              <rect x={82} y={82} width={36} height={36} fill="#fff" rx={5}/>
              <text x={100} y={106} textAnchor="middle" fontSize={22} fontWeight="bold" fill="#a07830" fontFamily="serif">B</text>
            </svg>

            {/* Countdown ring */}
            <div style={{ position: 'absolute', bottom: -18, right: -18, background: '#12100d', borderRadius: '50%', padding: 3 }}>
              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(160,120,48,0.2)" strokeWidth="4"/>
                <circle cx="24" cy="24" r="20" fill="none" stroke="#a07830" strokeWidth="4"
                  strokeDasharray={`${(countdown / 5) * 125.6} 125.6`}
                  strokeLinecap="round" transform="rotate(-90 24 24)"
                  style={{ transition: 'stroke-dasharray 1s linear' }}/>
                <text x="24" y="29" textAnchor="middle" fontSize="15" fontWeight="700" fill="#a07830">{countdown}</text>
              </svg>
            </div>
          </div>

          <p style={{ color: 'rgba(212,196,168,0.5)', fontSize: '0.8rem', marginTop: 24 }}>
            Auto-confirming in <strong style={{ color: '#a07830' }}>{countdown}s</strong>
          </p>
          <p style={{ color: 'rgba(212,196,168,0.4)', fontSize: '0.78rem', marginTop: 4 }}>UPI ID: <strong>burgerbliss@upi</strong></p>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
            {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
              <span key={app} style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 20, fontSize: '0.75rem', color: 'rgba(212,196,168,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>{app}</span>
            ))}
          </div>
        </div>
      )}

      {/* UPI ID Tab */}
      {tab === 'id' && (
        <div>
          <p style={{ color: '#d4c4a8', fontSize: '0.88rem', marginBottom: 14 }}>Enter your UPI ID to pay <strong style={{ color: '#a07830' }}>₹{amount}</strong></p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
            <input
              value={upiId}
              onChange={e => { setUpiId(e.target.value); setIdVerified(false); setUpiError(''); }}
              placeholder="yourname@okicici"
              style={{ flex: 1, padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${idVerified ? '#43a047' : upiError ? '#e53935' : 'rgba(255,255,255,0.12)'}`, borderRadius: 12, color: '#e8dcc8', fontFamily: 'Poppins,sans-serif', fontSize: '0.9rem', outline: 'none' }}
            />
            <button onClick={verifyUpiId} disabled={verifying || idVerified}
              style={{ padding: '11px 16px', background: 'rgba(160,120,48,0.12)', border: '1px solid rgba(160,120,48,0.3)', borderRadius: 12, color: '#a07830', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              {verifying ? '…' : idVerified ? '✓ Verified' : 'Verify'}
            </button>
          </div>
          {upiError && <p style={{ color: '#e57373', fontSize: '0.78rem', marginBottom: 8 }}>{upiError}</p>}
          {idVerified && <p style={{ color: '#81c784', fontSize: '0.82rem', marginBottom: 12 }}>✓ Account verified — Ready to pay</p>}
          <button className="btn-primary" onClick={payWithId} disabled={!idVerified}
            style={{ width: '100%', borderRadius: 14, padding: '13px', marginTop: 8, opacity: idVerified ? 1 : 0.4 }}>
            Pay ₹{amount}
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   CARD PANEL
══════════════════════════════════════════ */
function CardPanel({ amount, onSuccess }) {
  const [form, setForm] = useState({ name: '', number: '', expiry: '', cvv: '', ifsc: '', bank: '', saveCard: false });
  const [errors, setErrors] = useState({});
  const [flip, setFlip] = useState(false);
  const [phase, setPhase] = useState('form'); // form | otp | processing
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [ifscLoading, setIfscLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const fmtCard = v => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExp = v => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; };

  const lookupIfsc = v => {
    if (v.length === 11) {
      setIfscLoading(true);
      const map = { SBIN: 'State Bank of India', HDFC: 'HDFC Bank', ICIC: 'ICICI Bank', UTIB: 'Axis Bank', KKBK: 'Kotak Mahindra Bank', PUNB: 'Punjab National Bank' };
      setTimeout(() => { set('bank', map[v.slice(0, 4).toUpperCase()] || 'Your Bank'); setIfscLoading(false); }, 800);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Cardholder name required';
    if (form.number.replace(/\s/g, '').length !== 16) e.number = 'Enter valid 16-digit card number';
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = 'Enter MM/YY';
    else { const [m, y] = form.expiry.split('/').map(Number); if (m < 1 || m > 12 || y < 24) e.expiry = 'Card expired or invalid'; }
    if (form.cvv.length < 3) e.cvv = 'CVV must be 3–4 digits';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const inp = (hasErr) => ({
    width: '100%', padding: '10px 13px',
    background: 'rgba(255,255,255,0.06)',
    border: `1.5px solid ${hasErr ? '#e53935' : 'rgba(255,255,255,0.12)'}`,
    borderRadius: 11, color: '#e8dcc8',
    fontFamily: 'Poppins,sans-serif', fontSize: '0.88rem', outline: 'none',
  });

  const lbl = { display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'rgba(212,196,168,0.45)', marginBottom: 5, fontWeight: 600 };

  /* OTP Screen */
  if (phase === 'otp') return (
    <div style={{ textAlign: 'center', padding: '12px 0' }}>
      <div style={{ fontSize: '2.6rem', marginBottom: 10 }}>🔐</div>
      <h3 style={{ fontFamily: 'Playfair Display,serif', color: '#e8dcc8', fontSize: '1.2rem', marginBottom: 8 }}>3D Secure Verification</h3>
      <p style={{ color: 'rgba(212,196,168,0.55)', fontSize: '0.85rem', marginBottom: 20 }}>OTP sent to your registered mobile <strong style={{ color: '#d4c4a8' }}>**12</strong></p>
      {/* 6-box OTP input */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <input key={i} id={`otp-${i}`} type="text" maxLength={1}
            value={otp[i] || ''}
            onChange={e => {
              const v = e.target.value.replace(/\D/g, '');
              const arr = otp.split(''); arr[i] = v; setOtp(arr.join(''));
              if (v && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
            }}
            onKeyDown={e => { if (e.key === 'Backspace' && !otp[i] && i > 0) document.getElementById(`otp-${i - 1}`)?.focus(); }}
            style={{ width: 44, height: 52, textAlign: 'center', fontSize: '1.3rem', fontWeight: 700, background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#e8dcc8', outline: 'none', fontFamily: 'Poppins,sans-serif' }}
          />
        ))}
      </div>
      {otpError && <p style={{ color: '#e57373', fontSize: '0.8rem', marginBottom: 10 }}>{otpError}</p>}
      <button className="btn-primary" onClick={() => {
        if (otp.length < 4) { setOtpError('Enter a valid OTP'); return; }
        setOtpError(''); setPhase('processing');
        setTimeout(() => onSuccess(), 2400);
      }} style={{ width: '100%', borderRadius: 14, padding: 13 }}>Verify & Pay ₹{amount}</button>
      <button onClick={() => setPhase('form')} style={{ background: 'transparent', border: 'none', color: 'rgba(212,196,168,0.4)', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: '0.82rem', marginTop: 12 }}>← Go Back</button>
    </div>
  );

  /* Processing Screen */
  if (phase === 'processing') return (
    <div style={{ textAlign: 'center', padding: '28px 0' }}>
      <Spinner size={52} />
      <p style={{ color: '#d4c4a8', marginTop: 20, fontSize: '0.92rem' }}>Processing your payment…</p>
      <p style={{ color: 'rgba(212,196,168,0.4)', fontSize: '0.78rem', marginTop: 4 }}>Do not refresh or close this window</p>
    </div>
  );

  /* Card Form */
  return (
    <div>
      {/* Flip Card Preview */}
      <div style={{ marginBottom: 8, cursor: 'pointer', perspective: 900 }} onClick={() => setFlip(f => !f)}>
        <div style={{ width: '100%', height: 170, position: 'relative', transformStyle: 'preserve-3d', transition: 'transform 0.6s', transform: flip ? 'rotateY(180deg)' : 'rotateY(0)' }}>
          {/* Front */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(135deg,#1a1208,#3d2c0a,#1a1208)', border: '1px solid rgba(160,120,48,0.3)', padding: '18px 22px', backfaceVisibility: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.4rem' }}>💳</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>BurgerBliss Bank</span>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', letterSpacing: '2px' }}>{form.number || '•••• •••• •••• ••••'}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div><div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>Card Holder</div><div style={{ color: '#fff', fontWeight: 600, fontSize: '0.82rem' }}>{form.name || 'YOUR NAME'}</div></div>
              <div><div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>Expires</div><div style={{ color: '#fff', fontWeight: 600, fontSize: '0.82rem' }}>{form.expiry || 'MM/YY'}</div></div>
            </div>
          </div>
          {/* Back */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(135deg,#111,#2a2a2a)', border: '1px solid rgba(255,255,255,0.08)', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', overflow: 'hidden' }}>
            <div style={{ background: '#0a0a0a', height: 42, marginTop: 20, marginBottom: 14 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px' }}>
              <div style={{ flex: 1, height: 34, background: 'repeating-linear-gradient(45deg,#e0e0e0,#e0e0e0 3px,#fff 3px,#fff 8px)', borderRadius: 4 }} />
              <div style={{ width: 56, height: 34, background: '#fff', borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: '#555', marginBottom: 1 }}>CVV</div>
                <div style={{ letterSpacing: 3, fontWeight: 700, color: '#111', fontSize: '0.9rem' }}>{form.cvv ? '•'.repeat(form.cvv.length) : '•••'}</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', textAlign: 'center', marginTop: 14 }}>Tap to flip</p>
          </div>
        </div>
      </div>
      <p style={{ color: 'rgba(212,196,168,0.3)', fontSize: '0.7rem', textAlign: 'center', marginBottom: 16 }}>Tap card to preview back / CVV</p>

      {/* Form Fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>

        <div style={{ gridColumn: '1 / -1', marginBottom: 13 }}>
          <label style={lbl}>Cardholder Name</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="As on card" style={inp(!!errors.name)} />
          {errors.name && <p style={{ color: '#e57373', fontSize: '0.75rem', marginTop: 3 }}>{errors.name}</p>}
        </div>

        <div style={{ gridColumn: '1 / -1', marginBottom: 13 }}>
          <label style={lbl}>Card Number</label>
          <input value={form.number} onChange={e => set('number', fmtCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} style={{ ...inp(!!errors.number), letterSpacing: '1.5px' }} />
          {errors.number && <p style={{ color: '#e57373', fontSize: '0.75rem', marginTop: 3 }}>{errors.number}</p>}
        </div>

        <div style={{ marginBottom: 13 }}>
          <label style={lbl}>Expiry (MM/YY)</label>
          <input value={form.expiry} onChange={e => set('expiry', fmtExp(e.target.value))} placeholder="MM/YY" maxLength={5} style={inp(!!errors.expiry)} />
          {errors.expiry && <p style={{ color: '#e57373', fontSize: '0.75rem', marginTop: 3 }}>{errors.expiry}</p>}
        </div>

        <div style={{ marginBottom: 13 }}>
          <label style={lbl}>CVV</label>
          <input value={form.cvv} onChange={e => set('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
            onFocus={() => setFlip(true)} onBlur={() => setFlip(false)}
            placeholder="•••" maxLength={4} type="password" style={inp(!!errors.cvv)} />
          {errors.cvv && <p style={{ color: '#e57373', fontSize: '0.75rem', marginTop: 3 }}>{errors.cvv}</p>}
        </div>

        <div style={{ marginBottom: 13 }}>
          <label style={lbl}>IFSC Code</label>
          <input value={form.ifsc} onChange={e => { const v = e.target.value.toUpperCase(); set('ifsc', v); lookupIfsc(v); }} placeholder="SBIN0001234" maxLength={11} style={inp(false)} />
          <p style={{ color: 'rgba(212,196,168,0.35)', fontSize: '0.7rem', marginTop: 3 }}>{ifscLoading ? 'Fetching bank…' : 'Auto-fetches bank name'}</p>
        </div>

        <div style={{ marginBottom: 13 }}>
          <label style={lbl}>Bank Name</label>
          <input value={form.bank} onChange={e => set('bank', e.target.value)} placeholder="Auto-filled or type" style={inp(false)} />
        </div>

      </div>

      {/* Save Card */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, cursor: 'pointer' }}>
        <input type="checkbox" checked={form.saveCard} onChange={e => set('saveCard', e.target.checked)} style={{ accentColor: '#a07830', width: 16, height: 16 }} />
        <span style={{ color: 'rgba(212,196,168,0.55)', fontSize: '0.84rem' }}>Save this card for faster checkout</span>
      </label>

      <p style={{ fontSize: '0.72rem', color: 'rgba(212,196,168,0.25)', marginBottom: 14 }}>🔒 256-bit SSL encrypted · PCI DSS Compliant · Demo only</p>

      <button className="btn-primary" onClick={() => { if (validate()) setPhase('otp'); }}
        style={{ width: '100%', borderRadius: 14, padding: '13px', fontSize: '1rem' }}>
        Pay Now — ₹{amount}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   NET BANKING PANEL
══════════════════════════════════════════ */
const BANKS = [
  { id: 'SBI',    name: 'State Bank of India',  color: '#1565C0', emoji: '🏛️' },
  { id: 'HDFC',   name: 'HDFC Bank',            color: '#B71C1C', emoji: '🔴' },
  { id: 'ICICI',  name: 'ICICI Bank',           color: '#E65100', emoji: '🟠' },
  { id: 'AXIS',   name: 'Axis Bank',            color: '#4A148C', emoji: '🟣' },
  { id: 'KOTAK',  name: 'Kotak Mahindra',       color: '#E65100', emoji: '🦁' },
  { id: 'PNB',    name: 'Punjab National',      color: '#1B5E20', emoji: '🟢' },
  { id: 'BOB',    name: 'Bank of Baroda',       color: '#F57F17', emoji: '🌟' },
  { id: 'YES',    name: 'Yes Bank',             color: '#0D47A1', emoji: '🔷' },
  { id: 'INDUS',  name: 'IndusInd Bank',        color: '#880E4F', emoji: '🌸' },
  { id: 'UNION',  name: 'Union Bank',           color: '#004D40', emoji: '🏦' },
  { id: 'CANARA', name: 'Canara Bank',          color: '#37474F', emoji: '🏢' },
  { id: 'IDFC',   name: 'IDFC First Bank',      color: '#1A237E', emoji: '🔹' },
];

function NetBankingPanel({ amount, onSuccess }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState('select'); // select | login | processing
  const [userId, setUserId] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [progress, setProgress] = useState(0);

  const filtered = BANKS.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase())
  );

  const submitLogin = () => {
    if (!userId.trim() || !pass.trim()) { setLoginError('Please enter both User ID and Password'); return; }
    setLoginError(''); setPhase('processing');
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 16 + 5;
      setProgress(Math.min(p, 95));
      if (p >= 95) clearInterval(iv);
    }, 300);
    setTimeout(() => { setProgress(100); clearInterval(iv); setTimeout(() => onSuccess(), 500); }, 3200);
  };

  const loginInp = { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 11, color: '#e8dcc8', fontFamily: 'Poppins,sans-serif', fontSize: '0.9rem', outline: 'none' };
  const lbl = { display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'rgba(212,196,168,0.45)', marginBottom: 5, fontWeight: 600 };

  /* Mock Bank Login */
  if (phase === 'login') return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: selected.color }}>
        <span style={{ fontSize: '1.4rem' }}>{selected.emoji}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{selected.name}</div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>Secure Net Banking Portal</div>
        </div>
        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)' }}>🔒 SSL</span>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 18px 20px' }}>
        <div style={{ background: 'rgba(46,125,50,0.1)', border: '1px solid rgba(46,125,50,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: '0.75rem', color: '#81c784', marginBottom: 16 }}>
          ⚡ Demo portal — no real credentials needed
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
          {[['Merchant', 'BurgerBliss'], ['Amount', `₹${amount}`], ['Ref No', `BB${Date.now().toString().slice(-8)}`]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 5 }}>
              <span style={{ color: 'rgba(212,196,168,0.5)' }}>{k}</span>
              <strong style={{ color: k === 'Amount' ? '#a07830' : '#d4c4a8' }}>{v}</strong>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 13 }}>
          <label style={lbl}>Customer ID / User ID</label>
          <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="Enter your Customer ID" style={loginInp} autoComplete="off" />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={lbl}>Net Banking Password</label>
          <div style={{ position: 'relative' }}>
            <input value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter your password"
              type={showPass ? 'text' : 'password'} style={loginInp} autoComplete="off" />
            <button onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {loginError && <p style={{ color: '#e57373', fontSize: '0.78rem', marginBottom: 10 }}>{loginError}</p>}

        <button className="btn-primary" onClick={submitLogin}
          style={{ width: '100%', borderRadius: 12, padding: '13px', background: selected.color, boxShadow: 'none', marginTop: 4 }}>
          Login & Pay ₹{amount}
        </button>

        <button onClick={() => { setPhase('select'); setUserId(''); setPass(''); }}
          style={{ background: 'transparent', border: 'none', color: 'rgba(212,196,168,0.4)', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: '0.82rem', marginTop: 12, display: 'block', width: '100%', textAlign: 'center' }}>
          ← Change Bank
        </button>
      </div>
    </div>
  );

  /* Processing */
  if (phase === 'processing') return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 20, padding: '12px 18px', background: selected.color, borderRadius: 12 }}>
        <span>{selected.emoji}</span>
        <span style={{ color: '#fff', fontWeight: 600 }}>{selected.name}</span>
      </div>
      <Spinner size={50} color={selected.color} />
      <p style={{ color: '#d4c4a8', marginTop: 18, fontSize: '0.9rem', fontWeight: 500 }}>Processing your transaction…</p>
      <p style={{ color: 'rgba(212,196,168,0.4)', fontSize: '0.75rem', marginTop: 4 }}>Do not press back or refresh</p>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, height: 6, margin: '20px 0 8px', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 20, background: selected.color, width: `${progress}%`, transition: 'width 0.3s ease' }} />
      </div>
      <p style={{ color: 'rgba(212,196,168,0.35)', fontSize: '0.72rem' }}>{Math.round(progress)}% Complete</p>
    </div>
  );

  /* Bank Selection Grid */
  return (
    <div>
      <p style={{ color: 'rgba(212,196,168,0.55)', fontSize: '0.85rem', marginBottom: 14 }}>Select your bank to continue</p>
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.45 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bank…"
          style={{ width: '100%', padding: '11px 14px 11px 36px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e8dcc8', fontFamily: 'Poppins,sans-serif', fontSize: '0.88rem', outline: 'none' }} />
      </div>

      <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'rgba(212,196,168,0.3)', marginBottom: 10, fontWeight: 600 }}>
        {search ? `Results (${filtered.length})` : 'Popular Banks'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
        {filtered.map(bank => (
          <button key={bank.id} onClick={() => { setSelected(bank); setPhase('login'); }}
            style={{ background: 'rgba(255,255,255,0.04)', border: `1.5px solid ${bank.color}40`, borderRadius: 14, padding: '13px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Poppins,sans-serif', transition: 'all .18s' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 5 }}>{bank.emoji}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#d4c4a8', textAlign: 'center', lineHeight: 1.3 }}>{bank.name}</div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '24px', color: 'rgba(212,196,168,0.3)', fontSize: '0.85rem' }}>
            No banks found for "{search}"
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   COD PANEL
══════════════════════════════════════════ */
function CodPanel({ amount, onSuccess }) {
  const [agreed, setAgreed] = useState(false);
  const [phase, setPhase] = useState('info'); // info | confirm
  const codFee = 49;
  const total = (parseFloat(amount) + codFee).toFixed(2);

  if (phase === 'confirm') return (
    <div style={{ textAlign: 'center', padding: '10px 0' }}>
      <div style={{ fontSize: '3rem', marginBottom: 10 }}>📦</div>
      <h3 style={{ fontFamily: 'Playfair Display,serif', color: '#e8dcc8', fontSize: '1.2rem', marginBottom: 14 }}>Confirm Your Order</h3>
      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '16px 18px', marginBottom: 18, textAlign: 'left' }}>
        {[['Item Total', `₹${amount}`], ['COD Handling Fee', `₹${codFee}`], ['Pay on Delivery', `₹${total}`]].map(([k, v], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: i === 2 ? '0.95rem' : '0.85rem', fontWeight: i === 2 ? 700 : 400, color: i === 2 ? '#e8dcc8' : 'rgba(212,196,168,0.55)', marginBottom: 8, paddingTop: i === 2 ? 8 : 0, borderTop: i === 2 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
            <span>{k}</span><span style={{ color: i === 2 ? '#a07830' : 'inherit' }}>{v}</span>
          </div>
        ))}
      </div>
      <p style={{ color: 'rgba(212,196,168,0.45)', fontSize: '0.8rem', marginBottom: 18, lineHeight: 1.6 }}>
        Our delivery partner will collect <strong style={{ color: '#d4c4a8' }}>₹{total}</strong> in cash or UPI when your order arrives.
      </p>
      <button className="btn-primary" onClick={onSuccess} style={{ width: '100%', borderRadius: 14, padding: 13 }}>
        ✅ Confirm & Place Order
      </button>
      <button onClick={() => setPhase('info')} style={{ background: 'transparent', border: 'none', color: 'rgba(212,196,168,0.4)', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: '0.82rem', marginTop: 12, display: 'block', width: '100%', textAlign: 'center' }}>← Go Back</button>
    </div>
  );

  return (
    <div>
      <div style={{ background: 'rgba(255,167,38,0.07)', border: '1px solid rgba(255,167,38,0.18)', borderRadius: 14, padding: '12px 16px', marginBottom: 18 }}>
        <div style={{ fontWeight: 600, color: '#ffb74d', marginBottom: 5, fontSize: '0.88rem' }}>⚠️ Cash on Delivery — Things to know</div>
        <p style={{ color: 'rgba(212,196,168,0.5)', fontSize: '0.8rem', lineHeight: 1.6 }}>Keep exact change of <strong style={{ color: '#d4c4a8' }}>₹{total}</strong> ready. Our partner may not always have change for large notes.</p>
      </div>

      {[
        ['📋', 'Order Confirmed', 'You\'ll receive an SMS + email with your Order ID and delivery window.'],
        ['🚴', 'Out for Delivery', 'Our partner will call before arriving. Ensure someone is home.'],
        ['💵', 'Pay on Delivery', `Pay ₹${total} in cash or UPI scan when you receive the order.`],
        ['🧾', 'Get Receipt', 'A digital receipt will be sent via SMS/email as proof of payment.'],
      ].map(([icon, title, desc], i) => (
        <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'flex-start' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(160,120,48,0.12)', border: '1px solid rgba(160,120,48,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0, marginTop: 1 }}>{icon}</div>
          <div>
            <div style={{ color: '#d4c4a8', fontWeight: 600, fontSize: '0.88rem', marginBottom: 2 }}>{title}</div>
            <div style={{ color: 'rgba(212,196,168,0.45)', fontSize: '0.78rem', lineHeight: 1.5 }}>{desc}</div>
          </div>
        </div>
      ))}

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 18 }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ accentColor: '#a07830', marginTop: 2, width: 16, height: 16, flexShrink: 0 }} />
        <span style={{ color: 'rgba(212,196,168,0.5)', fontSize: '0.82rem', lineHeight: 1.5 }}>I confirm I'll be at the delivery address and will pay ₹{total} on delivery.</span>
      </label>

      <button className="btn-primary" onClick={() => setPhase('confirm')} disabled={!agreed}
        style={{ width: '100%', borderRadius: 14, padding: 13, opacity: agreed ? 1 : 0.4 }}>
        Place Order (Pay on Delivery)
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   SUCCESS SCREEN
══════════════════════════════════════════ */
function PaymentSuccess({ bill, method, navigate }) {
  useEffect(() => {
    const t = setTimeout(() => navigate('/'), 8000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div style={{ background: '#12100d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(67,160,71,0.25)', borderRadius: 24, padding: '44px 36px', maxWidth: 500, width: '100%', textAlign: 'center', animation: 'bbSlideUp 0.5s ease' }}>
        <SuccessCheck />
        <h2 style={{ fontFamily: 'Playfair Display,serif', color: '#e8dcc8', fontSize: '1.8rem', marginTop: 20, marginBottom: 6 }}>Payment Successful!</h2>
        <p style={{ color: 'rgba(212,196,168,0.5)', fontSize: '0.88rem', marginBottom: 4 }}>Paid via <strong style={{ color: '#a07830' }}>{method}</strong></p>
        <p style={{ color: 'rgba(212,196,168,0.3)', fontSize: '0.78rem', marginBottom: 24 }}>Redirecting to home in 8 seconds…</p>

        {/* Bill Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '18px 20px', marginBottom: 22, textAlign: 'left' }}>
          <div style={{ fontSize: '1.4rem', textAlign: 'center', marginBottom: 8 }}>🍔</div>
          <div style={{ fontFamily: 'Playfair Display,serif', color: '#e8dcc8', fontSize: '1.05rem', textAlign: 'center', marginBottom: 2 }}>{bill.restaurantName}</div>
          <div style={{ color: 'rgba(212,196,168,0.35)', fontSize: '0.7rem', textAlign: 'center', marginBottom: 16 }}>{bill.restaurantAddress}</div>

          {[['Order ID', `#${bill.orderId}`], ['Customer', bill.userName], ['Date', bill.date]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.82rem' }}>
              <span style={{ color: 'rgba(212,196,168,0.4)' }}>{k}</span>
              <span style={{ color: '#e8dcc8' }}>{v}</span>
            </div>
          ))}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12, marginTop: 8 }}>
            {bill.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.82rem' }}>
                <span style={{ color: '#d4c4a8' }}>{item.name} × {item.quantity}</span>
                <span style={{ color: '#a07830' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12, marginTop: 8 }}>
            {[
              ['Subtotal', `₹${bill.subtotal}`],
              bill.discount > 0 ? ['Reward Discount', `-₹${bill.discount}`] : null,
              [`GST (${bill.gstPercent}%)`, `₹${bill.gst}`],
            ].filter(Boolean).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.82rem' }}>
                <span style={{ color: 'rgba(212,196,168,0.4)' }}>{k}</span>
                <span style={{ color: k.includes('Discount') ? '#81c784' : '#d4c4a8' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.07)', fontWeight: 700 }}>
              <span style={{ fontFamily: 'Playfair Display,serif', color: '#e8dcc8', fontSize: '1rem' }}>Total Paid</span>
              <span style={{ color: '#a07830', fontSize: '1.1rem' }}>₹{bill.final}</span>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(160,120,48,0.07)', borderRadius: 12, padding: 14, color: '#a07830', fontSize: '0.88rem', fontStyle: 'italic', marginBottom: 22 }}>
          Thank you! Your order is being prepared 🙌
        </div>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ width: '100%', borderRadius: 14, padding: 14 }}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAYMENT PAGE
══════════════════════════════════════════ */
const METHODS = [
  { id: 'upi',  label: 'UPI',                 icon: '📱', sub: 'GPay · PhonePe · Paytm · BHIM · QR Code' },
  { id: 'card', label: 'Credit / Debit Card',  icon: '💳', sub: 'Visa · Mastercard · Rupay · Amex' },
  { id: 'nb',   label: 'Net Banking',          icon: '🏦', sub: 'All major Indian banks supported' },
  { id: 'cod',  label: 'Cash on Delivery',     icon: '📦', sub: 'Pay when your order arrives' },
];

export default function PaymentPage() {
  const { cart, clearCart, total } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [selected, setSelected] = useState('upi');
  const [bill, setBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');

  const savedRewards = JSON.parse(localStorage.getItem('bb_rewards') || '[]');
  const unusedReward = savedRewards.find(r => !r.used);
  let rewardDiscount = 0;
  if (unusedReward) {
    const val = unusedReward.value;
    if (val.includes('%')) rewardDiscount = (total * parseInt(val)) / 100;
    else if (val.includes('₹')) rewardDiscount = parseInt(val.replace('₹', ''));
  }
  const gstPct = 18;
  const afterDiscount = total - rewardDiscount;
  const gst = (afterDiscount * gstPct) / 100;
  const finalTotal = afterDiscount + gst;
  const displayAmount = finalTotal.toFixed(2);

  const placeOrder = async (methodLabel) => {
    setPaymentMethod(methodLabel);
    try {
      const items = cart.map(item => ({
        burger_id: item.id && !item.is_custom ? item.id : null,
        name: item.name, price: item.price, quantity: item.quantity,
        is_custom: item.is_custom || false,
        custom_name: item.is_custom ? item.name : null,
        custom_ingredients: item.custom_ingredients || null,
        kcal: item.kcal || 0, protein: item.protein || 0,
      }));
      const res = await axios.post('/api/orders', { items, reward_discount: rewardDiscount, payment_method: methodLabel }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (unusedReward) {
        const updated = savedRewards.map(r => r.id === unusedReward.id ? { ...r, used: true } : r);
        localStorage.setItem('bb_rewards', JSON.stringify(updated));
      }
      clearCart();
      setBill(res.data.bill);
    } catch {
      alert('Failed to place order. Please try again.');
    }
  };

  if (bill) return <PaymentSuccess bill={bill} method={paymentMethod} navigate={navigate} />;
  if (cart.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="page" style={{ background: '#12100d', minHeight: '100vh' }}>
      <style>{`
        @keyframes bbSpin    { to { transform: rotate(360deg); } }
        @keyframes bbPop     { 0%{transform:scale(0)} 60%{transform:scale(1.15)} 100%{transform:scale(1)} }
        @keyframes bbSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bbSlideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @media(max-width:700px){ .bb-pay-grid{ grid-template-columns:1fr !important; } }
      `}</style>

      <div style={{ padding: '40px 20px', maxWidth: 980, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Playfair Display,serif', color: '#e8dcc8', marginBottom: 6, fontSize: 'clamp(1.6rem,3vw,2.2rem)' }}>
          Secure Checkout 🔒
        </h1>
        <p style={{ color: 'rgba(212,196,168,0.35)', fontSize: '0.85rem', marginBottom: 32 }}>
          Home → Cart → <strong style={{ color: '#a07830' }}>Payment</strong>
        </p>

        <div className="bb-pay-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 22, alignItems: 'start' }}>

          {/* ── LEFT: Payment Methods ── */}
          <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ fontFamily: 'Playfair Display,serif', color: '#e8dcc8', fontSize: '1rem', fontWeight: 700, padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              Select Payment Method
            </div>

            {METHODS.map(m => (
              <div key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Method Header Row */}
                <div onClick={() => setSelected(m.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 20px', cursor: 'pointer', background: selected === m.id ? 'rgba(160,120,48,0.07)' : 'transparent', transition: 'background .2s' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${selected === m.id ? '#a07830' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {selected === m.id && <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#a07830' }} />}
                  </div>
                  <span style={{ fontSize: '1.3rem' }}>{m.icon}</span>
                  <div>
                    <div style={{ color: '#e8dcc8', fontSize: '0.92rem', fontWeight: 600 }}>{m.label}</div>
                    <div style={{ color: 'rgba(212,196,168,0.38)', fontSize: '0.74rem', marginTop: 1 }}>{m.sub}</div>
                  </div>
                </div>

                {/* Expanded Panel */}
                {selected === m.id && (
                  <div style={{ padding: '4px 20px 22px 52px', borderTop: '1px solid rgba(255,255,255,0.04)', animation: 'bbSlideDown .2s ease' }}>
                    {m.id === 'upi'  && <UpiPanel         amount={displayAmount} onSuccess={() => placeOrder('UPI')} />}
                    {m.id === 'card' && <CardPanel        amount={displayAmount} onSuccess={() => placeOrder('Credit/Debit Card')} />}
                    {m.id === 'nb'   && <NetBankingPanel  amount={displayAmount} onSuccess={() => placeOrder('Net Banking')} />}
                    {m.id === 'cod'  && <CodPanel         amount={displayAmount} onSuccess={() => placeOrder('Cash on Delivery')} />}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div>
            <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden', position: 'sticky', top: 90 }}>
              <div style={{ fontFamily: 'Playfair Display,serif', color: '#e8dcc8', fontSize: '1rem', fontWeight: 700, padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                Order Summary
              </div>

              <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {cart.map(item => (
                  <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      <div style={{ color: '#d4c4a8', fontSize: '0.87rem', fontWeight: 500 }}>{item.name}</div>
                      <div style={{ color: 'rgba(212,196,168,0.38)', fontSize: '0.74rem' }}>× {item.quantity}</div>
                    </div>
                    <div style={{ color: '#a07830', fontWeight: 600, fontSize: '0.9rem' }}>₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '14px 18px' }}>
                {[
                  ['Subtotal', `₹${total.toFixed(2)}`],
                  rewardDiscount > 0 ? ['Reward Discount 🎮', `-₹${rewardDiscount.toFixed(2)}`] : null,
                  [`GST (${gstPct}%)`, `₹${gst.toFixed(2)}`],
                ].filter(Boolean).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9, fontSize: '0.84rem' }}>
                    <span style={{ color: 'rgba(212,196,168,0.48)' }}>{k}</span>
                    <span style={{ color: k.includes('Discount') ? '#81c784' : '#d4c4a8' }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)', fontWeight: 700 }}>
                  <span style={{ fontFamily: 'Playfair Display,serif', color: '#e8dcc8', fontSize: '1.05rem' }}>Total</span>
                  <span style={{ color: '#a07830', fontSize: '1.1rem' }}>₹{displayAmount}</span>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'rgba(212,196,168,0.25)', marginTop: 12 }}>🔒 100% Secure · Demo Simulation</p>
              </div>
            </div>

            <button onClick={() => navigate('/cart')}
              style={{ marginTop: 10, width: '100%', padding: '11px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: 'rgba(212,196,168,0.38)', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: '0.85rem' }}>
              ← Back to Cart
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}