import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const burgerShowcase = [
  { name: 'Maharaja Veg', desc: 'Double patty, exotic veggies, royal sauce', price: '₹180' },
  { name: 'Crispy Chicken', desc: 'Extra crispy golden chicken, special sauce', price: '₹140'},
  { name: 'Paneer Royale', desc: 'Grilled paneer, signature sauce, chef special', price: '₹120' },
];

const whyUs = [
  { icon: '🌿', title: 'Fresh Ingredients', desc: 'Sourced daily from local farms for maximum freshness.' },
  { icon: '👨‍🍳', title: 'Master Crafted', desc: 'Every burger is crafted by expert chefs with passion.' },
  { icon: '⚡', title: 'Swift Delivery', desc: 'Hot, fresh delivery in under 30 minutes.' },
  { icon: '🏆', title: 'Award Winning', desc: 'Recognized as the best gourmet burger brand.' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: 'radial-gradient(ellipse at 30% 60%, #3a2a0a 0%, #0d0b08 60%)' }} />
        <div className="hero-overlay" />
        {/* Ambient particles */}
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', width: '2px', height: '2px', borderRadius: '50%',
            background: 'rgba(160,120,48,0.6)', left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 20}%`,
            animation: `float${i % 3} ${4 + i}s ease-in-out infinite`, zIndex: 1
          }} />
        ))}
        <div className="glass hero-content" style={{ boxShadow: '0 0 60px rgba(160,120,48,0.15), 0 20px 60px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--brown2)', marginBottom: '12px', fontWeight: 500 }}>
            Premium Burger Experience
          </div>
          <h1>Where Fire Meets<br />Flavor.</h1>
          <p>Handcrafted gourmet burgers, elevated to an art form. Every bite, a masterpiece.</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => navigate('/menu')}>Order Now</button>
            <button className="btn-outline" onClick={() => navigate('/games')}>Play &amp; Win</button>
          </div>
        </div>
        <style>{`
          @keyframes float0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
          @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-30px)} }
          @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
        `}</style>
      </section>

      {/* Showcase */}
      <div style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--brown2)', marginBottom: 8 }}>Our Signature Collection</div>
          <h2 className="section-title">Crafted for the Refined Palate</h2>
          <p className="section-sub">Each burger is a symphony of flavors, textures, and premium ingredients.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {burgerShowcase.map((b, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate('/menu')}
              onMouseMove={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
              }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>{b.emoji}</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', marginBottom: 8, color: 'var(--beige)' }}>{b.name}</h3>
              <p style={{ color: 'var(--beige2)', fontSize: '0.9rem', fontWeight: 300, marginBottom: 16, lineHeight: 1.6 }}>{b.desc}</p>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brown2)' }}>{b.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">Why Choose BurgerBliss</h2>
            <p className="section-sub">We set the standard for premium fast-casual dining.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {whyUs.map((w, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{w.icon}</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: 10, color: 'var(--beige)' }}>{w.title}</h3>
                <p style={{ color: 'var(--beige2)', fontSize: '0.9rem', fontWeight: 300, lineHeight: 1.6 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Games Banner */}
      <div style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(92,100,48,0.15), rgba(139,105,20,0.15))' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(160,120,48,0.1) 0%, transparent 70%)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--olive2)', marginBottom: 12 }}>BurgerBliss Games</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', marginBottom: 12, color: 'var(--beige)' }}>Play. Win. Feast.</h2>
            <p style={{ color: 'var(--beige2)', fontWeight: 300, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
              Spin the wheel, challenge your memory, ace the quiz — win exclusive discounts and rewards.
            </p>
            <button className="btn-primary" onClick={() => navigate('/games')} style={{ fontSize: '1rem' }}>
              🎮 Explore Games
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: 'rgba(10,8,5,0.9)', borderTop: '1px solid var(--border)', padding: '60px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 40 }}>
            <div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--beige)', marginBottom: 12 }}>BurgerBliss</h3>
              <p style={{ color: 'var(--beige2)', fontSize: '0.9rem', fontWeight: 300, lineHeight: 1.7 }}>Where fire meets flavor. Premium gourmet burgers crafted with passion.</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--beige)', marginBottom: 16, fontWeight: 500 }}>Quick Links</h4>
              {['Menu', 'Customize', 'Games', 'About'].map(l => (
                <div key={l}><Link to={`/${l.toLowerCase()}`} style={{ color: 'var(--beige2)', textDecoration: 'none', fontSize: '0.9rem', display: 'block', marginBottom: 8, fontWeight: 300 }}>{l}</Link></div>
              ))}
            </div>
            <div>
              <h4 style={{ color: 'var(--beige)', marginBottom: 16, fontWeight: 500 }}>Contact</h4>
              <p style={{ color: 'var(--beige2)', fontSize: '0.9rem', fontWeight: 300, lineHeight: 1.8 }}>
                📍 123, Food Street, Mumbai<br />
                📞 +91 98765 43210<br />
                ✉ hello@burgerbliss.in
              </p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, textAlign: 'center', color: 'var(--beige2)', fontSize: '0.85rem', fontWeight: 300 }}>
            © 2024 BurgerBliss. Crafted with 🍔 and passion.
          </div>
        </div>
      </footer>
    </div>
  );
}
