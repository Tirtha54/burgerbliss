import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const C = {
  bg:         '#0e0c09',
  gold:       '#a07830',
  goldLight:  '#c9973d',
  beige:      '#e8dcc8',
  beige2:     '#d4c4a8',
  muted:      'rgba(212,196,168,0.5)',
  mutedDim:   'rgba(212,196,168,0.25)',
  border:     'rgba(255,255,255,0.08)',
  borderGold: 'rgba(160,120,48,0.3)',
  green:      '#4caf7d',
  olive:      '#7a8540',
};

const GLOBAL_CSS = `
  @keyframes oc-fadein { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes oc-pop    { 0%{transform:scale(0.5);opacity:0} 65%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes oc-check  { from{stroke-dashoffset:60} to{stroke-dashoffset:0} }
  @keyframes oc-ring   { from{stroke-dashoffset:251;opacity:0} to{stroke-dashoffset:0;opacity:1} }
  @keyframes oc-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes oc-badge  { from{opacity:0;transform:scale(.8) translateX(-8px)} to{opacity:1;transform:scale(1) translateX(0)} }
`;

function injectStyles() {
  if (document.getElementById('oc-styles')) return;
  const s = document.createElement('style');
  s.id = 'oc-styles';
  s.textContent = GLOBAL_CSS;
  document.head.appendChild(s);
}

function Row({ k, v, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
      <span style={{ color: C.muted, fontSize: '0.83rem' }}>{k}</span>
      <span style={{ color: highlight ? C.goldLight : C.beige2, fontSize: '0.83rem', fontWeight: highlight ? 600 : 400 }}>{v}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '1.2px', color: C.gold, marginBottom: 12 }}>{title}</div>
      <div style={{ background: 'rgba(255,255,255,0.035)', border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 18px' }}>
        {children}
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  useEffect(() => { injectStyles(); }, []);

  const navigate  = useNavigate();
  const location  = useLocation();
  const bill      = location.state?.bill;
  const [vis, setVis] = useState(false);

  useEffect(() => {
    if (!bill) { navigate('/', { replace: true }); return; }
    const t = setTimeout(() => setVis(true), 80);
    return () => clearTimeout(t);
  }, []);

  if (!bill) return null;

  return (
    <div style={{
      background: C.bg, minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '80px 20px 40px',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <div style={{
        background: 'rgba(14,12,9,0.9)', backdropFilter: 'blur(24px)',
        border: `1px solid ${C.borderGold}`,
        borderRadius: 24, padding: '44px 36px',
        maxWidth: 500, width: '100%',
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(22px)',
        transition: 'opacity .5s ease, transform .5s ease',
      }}>

        {/* Hero checkmark */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-block', animation: 'oc-pop .5s ease' }}>
            <svg width="88" height="88" viewBox="0 0 88 88">
              <circle cx="44" cy="44" r="40" fill="rgba(76,175,125,.1)"
                stroke={C.green} strokeWidth="2.5"
                strokeDasharray="251" strokeDashoffset="251"
                style={{ animation: 'oc-ring .6s .1s ease forwards' }} />
              <polyline points="25,45 38,57 63,30" fill="none"
                stroke={C.green} strokeWidth="4"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="60" strokeDashoffset="60"
                style={{ animation: 'oc-check .4s .5s ease forwards' }} />
            </svg>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            color: C.beige, fontSize: '2rem',
            marginTop: 16, marginBottom: 6,
            animation: 'oc-fadein .4s .3s ease both',
          }}>
            Order Confirmed!
          </h2>
          <p style={{ color: C.muted, fontSize: '0.88rem', animation: 'oc-fadein .4s .45s ease both' }}>
            Your food is on its way 🍔
          </p>
        </div>

        {/* ETA badge */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          background: 'rgba(76,175,125,.08)', border: '1px solid rgba(76,175,125,.25)',
          borderRadius: 14, padding: '12px 20px', marginBottom: 28,
          animation: 'oc-badge .4s .5s ease both',
        }}>
          <span style={{ fontSize: '1.4rem', animation: 'oc-float 3s ease-in-out infinite' }}>🛵</span>
          <div>
            <div style={{ color: C.green, fontWeight: 600, fontSize: '0.9rem' }}>Estimated Delivery</div>
            <div style={{ color: C.muted, fontSize: '0.8rem' }}>25 – 35 minutes</div>
          </div>
        </div>

        {/* Restaurant */}
        <div style={{
          textAlign: 'center', marginBottom: 24, paddingBottom: 20,
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", color: C.goldLight, fontSize: '1.15rem', marginBottom: 4 }}>
            {bill.restaurantName}
          </div>
          <div style={{ color: C.mutedDim, fontSize: '0.75rem' }}>{bill.restaurantAddress}</div>
          <div style={{ color: C.mutedDim, fontSize: '0.75rem' }}>{bill.restaurantPhone}</div>
        </div>

        {/* Order meta */}
        <Section title="Order Details">
          <Row k="Order ID" v={`#${bill.orderId}`} />
          <Row k="Customer"  v={bill.userName} />
          <Row k="Date"      v={bill.date} />
        </Section>

        {/* Items */}
        <Section title="Items Ordered">
          {bill.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i < bill.items.length - 1 ? 8 : 0 }}>
              <span style={{ color: C.beige2, fontSize: '0.87rem' }}>{item.name} × {item.quantity}</span>
              <span style={{ color: C.gold, fontSize: '0.87rem', fontWeight: 500 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </Section>

        {/* Totals */}
        <Section title="Payment Summary">
          <Row k="Subtotal" v={`₹${bill.subtotal}`} />
          {bill.discount > 0 && <Row k="Reward Discount" v={`−₹${bill.discount}`} />}
          <Row k={`GST (${bill.gstPercent}%)`} v={`₹${bill.gst}`} />
          <div style={{ height: 1, background: C.border, margin: '10px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", color: C.beige, fontSize: '1.05rem' }}>Total Paid</span>
            <span style={{ color: C.gold, fontWeight: 700, fontSize: '1.1rem' }}>₹{bill.final}</span>
          </div>
        </Section>

        {/* Thank you note */}
        <div style={{
          background: 'rgba(160,120,48,.06)', border: `1px solid rgba(160,120,48,.15)`,
          borderRadius: 12, padding: '12px 16px', textAlign: 'center',
          color: C.gold, fontSize: '0.88rem', fontStyle: 'italic', marginBottom: 24,
        }}>
          Thank you for choosing BurgerBliss! Come back soon 🙏
        </div>

        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%', padding: '14px',
            background: `linear-gradient(135deg, #8b6914, ${C.gold})`,
            border: 'none', borderRadius: 14,
            color: '#fff', fontFamily: "'Poppins', sans-serif",
            fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
            letterSpacing: '.3px',
          }}
        >
          Continue Shopping
        </button>

        <button
          onClick={() => navigate('/menu')}
          style={{
            width: '100%', padding: '12px', marginTop: 10,
            background: 'transparent', border: `1px solid ${C.border}`,
            borderRadius: 14, color: C.muted,
            fontFamily: "'Poppins', sans-serif", fontSize: '0.88rem', cursor: 'pointer',
          }}
        >
          Browse Menu Again
        </button>
      </div>
    </div>
  );
}