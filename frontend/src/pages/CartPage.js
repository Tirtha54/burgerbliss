import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, total } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [bill, setBill]               = useState(null);
  const [loading, setLoading]         = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStep, setPaymentStep] = useState(false); // show payment selector
  const [paymentDone, setPaymentDone] = useState(false); // UPI/Card processing screen

  // ── Rewards ──────────────────────────────────────────────────
  const savedRewards = JSON.parse(localStorage.getItem('bb_rewards') || '[]');
  const unusedReward = savedRewards.find(r => !r.used);
  let rewardDiscount = 0;
  if (unusedReward) {
    const val = unusedReward.value;
    if (val.includes('%'))  rewardDiscount = (total * parseInt(val)) / 100;
    else if (val.includes('₹')) rewardDiscount = parseInt(val.replace('₹', ''));
  }

  const gstPercent  = 18;
  const afterDiscount = total - rewardDiscount;
  const gst         = (afterDiscount * gstPercent) / 100;
  const finalTotal  = afterDiscount + gst;

  // ── Payment methods ───────────────────────────────────────────
  const PAYMENT_METHODS = [
    { id: 'upi',  label: 'UPI',         icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'card', label: 'Credit/Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
    { id: 'cod',  label: 'Cash on Delivery', icon: '💵', desc: 'Pay when food arrives' },
    { id: 'nb',   label: 'Net Banking',  icon: '🏦', desc: 'All major banks supported' },
  ];

  // ── Step 1: user clicks Place Order → show payment selector ───
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setPaymentStep(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Step 2: user selects method & confirms → process payment ──
  const handleConfirmPayment = async () => {
    if (!paymentMethod) {
      showToast('Please select a payment method!', 'error');
      return;
    }

    // For UPI / Card → show a brief "processing" animation
    if (paymentMethod === 'upi' || paymentMethod === 'card') {
      setPaymentDone(true);
      await new Promise(r => setTimeout(r, 2000)); // 2s processing delay
      setPaymentDone(false);
    }

    setLoading(true);
    try {
      const items = cart.map(item => ({
        burger_id: item.id && !item.is_custom ? item.id : null,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        is_custom: item.is_custom || false,
        custom_name: item.is_custom ? item.name : null,
        custom_ingredients: item.custom_ingredients || null,
        kcal: item.kcal || 0,
        protein: item.protein || 0,
      }));

      const res = await axios.post(
        '/api/orders',
        { items, reward_discount: rewardDiscount, payment_method: paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Mark reward as used
      if (unusedReward) {
        const updated = savedRewards.map(r =>
          r.id === unusedReward.id ? { ...r, used: true } : r
        );
        localStorage.setItem('bb_rewards', JSON.stringify(updated));
      }

      clearCart();
      setBill({ ...res.data.bill, paymentMethod });
      setPaymentStep(false);

      // Success toast
      const methodLabel = PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label || paymentMethod;
      showToast(`✅ Payment successful via ${methodLabel}! Order #${res.data.bill.orderId} placed.`, 'success');

    } catch (err) {
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── PAYMENT PROCESSING SCREEN ─────────────────────────────────
  if (paymentDone) {
    return (
      <div style={{ background: '#12100d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 20, animation: 'spin 1s linear infinite' }}>⏳</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', marginBottom: 8 }}>Processing Payment...</h2>
          <p style={{ color: 'rgba(212,196,168,0.5)' }}>Please wait while we confirm your {paymentMethod === 'upi' ? 'UPI' : 'card'} payment</p>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 8 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: '#a07830', animation: `bounce 0.8s ${i * 0.2}s infinite alternate` }} />
            ))}
          </div>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }
        `}</style>
      </div>
    );
  }

  // ── PAYMENT METHOD SELECTION SCREEN ──────────────────────────
  if (paymentStep) {
    return (
      <div style={{ background: '#12100d', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          {/* Back button */}
          <button
            onClick={() => setPaymentStep(false)}
            style={{ background: 'none', border: 'none', color: 'rgba(212,196,168,0.6)', cursor: 'pointer', marginBottom: 24, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            ← Back to Cart
          </button>

          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', marginBottom: 6, fontSize: '1.8rem' }}>
            Choose Payment Method
          </h2>
          <p style={{ color: 'rgba(212,196,168,0.5)', marginBottom: 28, fontSize: '0.9rem' }}>
            Amount to pay: <strong style={{ color: '#a07830' }}>₹{finalTotal.toFixed(2)}</strong>
          </p>

          {/* Payment options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {PAYMENT_METHODS.map(m => (
              <div
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                style={{
                  background: paymentMethod === m.id ? 'rgba(160,120,48,0.12)' : 'rgba(255,255,255,0.04)',
                  border: paymentMethod === m.id ? '1.5px solid rgba(160,120,48,0.6)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: '16px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'all 0.2s',
                }}
              >
                {/* Radio */}
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${paymentMethod === m.id ? '#a07830' : 'rgba(255,255,255,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {paymentMethod === m.id && (
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#a07830' }} />
                  )}
                </div>
                <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{m.icon}</div>
                <div>
                  <div style={{ color: '#e8dcc8', fontWeight: 600, fontSize: '0.95rem', marginBottom: 2 }}>{m.label}</div>
                  <div style={{ color: 'rgba(212,196,168,0.5)', fontSize: '0.8rem' }}>{m.desc}</div>
                </div>
                {paymentMethod === m.id && (
                  <div style={{ marginLeft: 'auto', color: '#a07830', fontSize: '1.1rem' }}>✓</div>
                )}
              </div>
            ))}
          </div>

          {/* Order summary mini */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px 20px', marginBottom: 24 }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#a07830', marginBottom: 12 }}>Order Summary</div>
            {[
              ['Subtotal', `₹${total.toFixed(2)}`],
              rewardDiscount > 0 ? ['Reward Discount', `-₹${rewardDiscount.toFixed(2)}`] : null,
              [`GST (${gstPercent}%)`, `₹${gst.toFixed(2)}`],
            ].filter(Boolean).map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'rgba(212,196,168,0.6)', fontSize: '0.85rem' }}>{k}</span>
                <span style={{ color: k.includes('Discount') ? '#7a8540' : '#d4c4a8', fontSize: '0.85rem' }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10, marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8' }}>Total</span>
              <span style={{ color: '#a07830', fontWeight: 700, fontSize: '1.1rem' }}>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Confirm payment button */}
          <button
            onClick={handleConfirmPayment}
            disabled={loading || !paymentMethod}
            style={{
              width: '100%',
              padding: '15px',
              background: paymentMethod ? 'linear-gradient(135deg, #a07830, #8b6914)' : 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: 14,
              color: paymentMethod ? '#fff' : 'rgba(212,196,168,0.3)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: paymentMethod ? 'pointer' : 'not-allowed',
              fontFamily: 'Poppins, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Processing...' : `Confirm & Pay ₹${finalTotal.toFixed(2)}`}
          </button>

          <p style={{ textAlign: 'center', marginTop: 14, color: 'rgba(212,196,168,0.35)', fontSize: '0.78rem' }}>
            🔒 Your payment is 100% secure and encrypted
          </p>
        </div>
      </div>
    );
  }

  // ── BILL / RECEIPT SCREEN ─────────────────────────────────────
  if (bill) {
    const methodLabel = PAYMENT_METHODS.find(m => m.id === bill.paymentMethod)?.label || bill.paymentMethod;
    const methodIcon  = PAYMENT_METHODS.find(m => m.id === bill.paymentMethod)?.icon || '💳';

    return (
      <div style={{ background: '#12100d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(160,120,48,0.3)', borderRadius: 24, padding: '40px 36px', maxWidth: 500, width: '100%', textAlign: 'center' }}>

          {/* Success badge */}
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(55,86,35,0.2)', border: '2px solid rgba(55,86,35,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem' }}>
            ✅
          </div>
          <h3 style={{ color: '#7a9940', fontFamily: 'Playfair Display, serif', marginBottom: 4, fontSize: '1.3rem' }}>Payment Successful!</h3>
          <p style={{ color: 'rgba(212,196,168,0.5)', fontSize: '0.85rem', marginBottom: 20 }}>
            {methodIcon} Paid via {methodLabel}
          </p>

          {/* Restaurant header */}
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', fontSize: '1.6rem', marginBottom: 4 }}>{bill.restaurantName}</h2>
          <p style={{ color: 'rgba(212,196,168,0.4)', fontSize: '0.78rem', marginBottom: 2 }}>{bill.restaurantAddress}</p>
          <p style={{ color: 'rgba(212,196,168,0.4)', fontSize: '0.78rem', marginBottom: 24 }}>{bill.restaurantPhone}</p>

          {/* Order meta */}
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '14px 18px', marginBottom: 18, textAlign: 'left' }}>
            {[
              ['Order ID', `#${bill.orderId}`],
              ['Customer', bill.userName],
              ['Date', bill.date],
              ['Payment', `${methodIcon} ${methodLabel}`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'rgba(212,196,168,0.5)', fontSize: '0.82rem' }}>{k}</span>
                <span style={{ color: '#e8dcc8', fontSize: '0.82rem' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Items */}
          <div style={{ textAlign: 'left', marginBottom: 18 }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#a07830', marginBottom: 10 }}>Order Details</div>
            {bill.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.86rem' }}>
                <span style={{ color: '#d4c4a8' }}>{item.name} × {item.quantity}</span>
                <span style={{ color: '#a07830' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14, textAlign: 'left' }}>
            {[
              ['Subtotal', `₹${bill.subtotal}`],
              bill.discount > 0 ? ['Reward Discount', `-₹${bill.discount}`] : null,
              [`GST (${bill.gstPercent}%)`, `₹${bill.gst}`],
            ].filter(Boolean).map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'rgba(212,196,168,0.5)', fontSize: '0.82rem' }}>{k}</span>
                <span style={{ color: k.includes('Discount') ? '#7a8540' : '#d4c4a8', fontSize: '0.82rem' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', fontSize: '1rem' }}>Total Paid</span>
              <span style={{ color: '#a07830', fontWeight: 700, fontSize: '1.1rem' }}>₹{bill.final}</span>
            </div>
          </div>

          {/* Payment status tag */}
          <div style={{ marginTop: 18, padding: '10px 14px', background: 'rgba(55,86,35,0.12)', border: '1px solid rgba(55,86,35,0.25)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ color: '#7a9940', fontSize: '0.85rem', fontWeight: 600 }}>✓ PAID</span>
            <span style={{ color: 'rgba(212,196,168,0.4)', fontSize: '0.78rem' }}>via {methodLabel}</span>
          </div>

          <div style={{ marginTop: 16, color: '#a07830', fontSize: '0.88rem', fontStyle: 'italic' }}>
            Come again soon! 🙏
          </div>

          <button
            onClick={() => navigate('/')}
            style={{ marginTop: 24, width: '100%', padding: 14, background: 'linear-gradient(135deg, #a07830, #8b6914)', border: 'none', borderRadius: 12, color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ── MAIN CART SCREEN ──────────────────────────────────────────
  return (
    <div style={{ background: '#12100d', minHeight: '100vh' }}>
      <div style={{ padding: '40px', maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', marginBottom: 32, fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>
          Your Cart 🛒
        </h1>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🍔</div>
            <p style={{ color: 'rgba(212,196,168,0.5)', marginBottom: 24 }}>Your cart is empty. Let's fix that!</p>
            <button className="btn-primary" onClick={() => navigate('/menu')} style={{ marginRight: 12, borderRadius: 12, padding: '12px 28px' }}>Browse Menu</button>
            <button className="btn-outline" onClick={() => navigate('/customize')} style={{ borderRadius: 12, padding: '12px 28px' }}>Customize Burger</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cart.map(item => (
                <div key={item.cartId} style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ fontSize: '2rem', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: 12, fontFamily: 'Playfair Display, serif', color: 'rgba(160,120,48,0.3)', fontWeight: 700 }}>BB</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', fontSize: '1.05rem', marginBottom: 4 }}>{item.name}</div>
                    {item.custom_ingredients && <div style={{ color: 'rgba(212,196,168,0.5)', fontSize: '0.78rem', marginBottom: 4 }}>{item.custom_ingredients}</div>}
                    <div style={{ display: 'flex', gap: 12 }}>
                      {item.kcal > 0 && <span style={{ fontSize: '0.75rem', color: 'rgba(212,196,168,0.4)' }}>🔥 {item.kcal} kcal</span>}
                      {item.protein > 0 && <span style={{ fontSize: '0.75rem', color: 'rgba(212,196,168,0.4)' }}>💪 {item.protein}g protein</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
                      <button onClick={() => updateQty(item.cartId, item.quantity - 1)} style={{ width: 32, height: 32, background: 'none', border: 'none', color: '#d4c4a8', cursor: 'pointer', fontSize: '1rem' }}>−</button>
                      <span style={{ width: 28, textAlign: 'center', color: '#e8dcc8', fontSize: '0.9rem', fontWeight: 500 }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.cartId, item.quantity + 1)} style={{ width: 32, height: 32, background: 'none', border: 'none', color: '#d4c4a8', cursor: 'pointer', fontSize: '1rem' }}>+</button>
                    </div>
                    <div style={{ color: '#a07830', fontWeight: 600, fontSize: '1rem', minWidth: 60, textAlign: 'right' }}>₹{(item.price * item.quantity).toFixed(0)}</div>
                    <button onClick={() => removeFromCart(item.cartId)} style={{ background: 'rgba(200,50,30,0.1)', border: '1px solid rgba(200,50,30,0.2)', borderRadius: 8, padding: '6px 10px', color: 'rgba(200,100,80,0.8)', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn-outline" onClick={() => navigate('/menu')} style={{ borderRadius: 12, padding: '12px 24px', fontSize: '0.9rem' }}>Browse Menu</button>
                <button className="btn-outline" onClick={() => navigate('/customize')} style={{ borderRadius: 12, padding: '12px 24px', fontSize: '0.9rem' }}>Customize Burger</button>
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, height: 'fit-content' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', marginBottom: 20 }}>Order Summary</h3>

              {unusedReward && (
                <div style={{ background: 'rgba(92,100,48,0.15)', border: '1px solid rgba(92,100,48,0.3)', borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: '0.85rem' }}>
                  <div style={{ color: '#7a8540', fontWeight: 500, marginBottom: 2 }}>🎮 Reward Applied</div>
                  <div style={{ color: '#d4c4a8' }}>{unusedReward.type}: <strong>{unusedReward.value}</strong></div>
                </div>
              )}

              {[
                ['Subtotal', `₹${total.toFixed(2)}`],
                rewardDiscount > 0 ? ['Reward Discount', `-₹${rewardDiscount.toFixed(2)}`] : null,
                [`GST (${gstPercent}%)`, `₹${gst.toFixed(2)}`],
              ].filter(Boolean).map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: 'rgba(212,196,168,0.6)', fontSize: '0.9rem' }}>{k}</span>
                  <span style={{ color: k.includes('Discount') ? '#7a8540' : '#d4c4a8', fontSize: '0.9rem' }}>{v}</span>
                </div>
              ))}

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', fontSize: '1.1rem' }}>Total</span>
                  <span style={{ color: '#a07830', fontWeight: 700, fontSize: '1.2rem' }}>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                style={{ width: '100%', borderRadius: 12, padding: 14, fontSize: '1rem', background: 'linear-gradient(135deg, #a07830, #8b6914)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins' }}
              >
                Proceed to Payment →
              </button>

              <button onClick={() => navigate('/')} style={{ width: '100%', marginTop: 10, padding: '11px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'rgba(212,196,168,0.5)', cursor: 'pointer', fontFamily: 'Poppins', fontSize: '0.88rem' }}>
                Continue Shopping
              </button>

              <p style={{ textAlign: 'center', marginTop: 12, color: 'rgba(212,196,168,0.3)', fontSize: '0.75rem' }}>
                🔒 Secure checkout
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
