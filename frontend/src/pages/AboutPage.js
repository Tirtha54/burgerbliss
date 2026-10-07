import React from 'react';

const philosophy = [
  { icon: '⭐', title: 'Quality First', desc: 'Every ingredient is sourced from premium farms, ensuring only the finest goes into your burger.' },
  { icon: '🔥', title: 'Innovation in Taste', desc: 'Our chefs constantly push the boundaries of flavor, creating extraordinary combinations you won\'t find anywhere else.' },
  { icon: '😊', title: 'Customer Happiness', desc: 'Your satisfaction isn\'t just our goal—it\'s our obsession. Every meal is crafted with your joy in mind.' },
];

export default function AboutPage() {
  return (
    <div className="page" style={{ background: '#12100d', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a1208 0%, #0d0b08 100%)', animation: 'slowZoom 20s ease-in-out infinite alternate' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.8) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: '#a07830', marginBottom: 12 }}>Our Story</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,4vw,3.2rem)', color: '#e8dcc8', lineHeight: 1.3, marginBottom: 14 }}>Crafted with Passion.<br />Served with Soul.</h1>
          <p style={{ color: '#d4c4a8', fontWeight: 300, maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>Every bite tells the story of decades of culinary tradition, passion, and innovation.</p>
        </div>
        <style>{`@keyframes slowZoom{from{transform:scale(1)}to{transform:scale(1.06)}}`}</style>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px' }}>
        {/* Our Story */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: '#a07830', marginBottom: 12 }}>Our Journey</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', color: '#e8dcc8', marginBottom: 20, lineHeight: 1.3 }}>Born from a Love of Extraordinary Flavors</h2>
            <p style={{ color: '#d4c4a8', fontWeight: 300, lineHeight: 1.8, marginBottom: 16 }}>
              BurgerBliss began with a simple belief: that a burger could be more than fast food — it could be an experience. Founded in 2020, we set out to craft burgers that combine the finest locally sourced ingredients with culinary artistry.
            </p>
            <p style={{ color: '#d4c4a8', fontWeight: 300, lineHeight: 1.8 }}>
              From our first kitchen to becoming a beloved premium brand, every step of our journey has been guided by our commitment to freshness, innovation, and the joy of a perfectly crafted burger.
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '40px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', color: 'rgba(160,120,48,0.3)', fontWeight: 700,marginBottom: 20}}> BurgerBliss</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
             {[['TYIT', 'Student Project'],['React', 'Frontend'],['Node.js', 'Backend'],['MySQL', 'Database']].map(([num, label]) => (
                 <div key={label} style={{ textAlign: 'center' }}>
                 <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#a07830', fontWeight: 700 }}>{num}</div>
                 <div style={{ color: 'rgba(212,196,168,0.6)', fontSize: '0.8rem', marginTop: 4 }}>{label}</div>
                 </div>
              ))}
            
            </div>
          </div>
        </div>

        {/* Philosophy */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: '#a07830', marginBottom: 12 }}>What We Stand For</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', color: '#e8dcc8' }}>Our Philosophy</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {philosophy.map((p, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{p.icon}</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', marginBottom: 12, fontSize: '1.2rem' }}>{p.title}</h3>
                <p style={{ color: '#d4c4a8', fontWeight: 300, lineHeight: 1.7, fontSize: '0.9rem' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div style={{ marginBottom: 80, background: 'rgba(255,255,255,0.02)', borderRadius: 20, padding: '48px 40px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', fontSize: '2rem', marginBottom: 32, textAlign: 'center' }}>Why Choose BurgerBliss</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              '🌿 Fresh ingredients sourced daily',
              '👨‍🍳 Expert chefs with years of experience',
              '🍔 17+ signature burger varieties',
              '🥗 Veg, Non-Veg, Diet & Keto options',
              '⚡ Hot delivery under 30 minutes',
              '🎮 Rewarding games for loyal customers',
              '✨ Customizable burgers your way',
              '🏆 Award-winning taste since 2020',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#d4c4a8', fontSize: '0.9rem' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Closing quote */}
        <div style={{ textAlign: 'center', padding: '60px 40px', background: 'linear-gradient(135deg, rgba(92,100,48,0.1), rgba(139,105,20,0.1))', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 16 }}>💬</div>
          <blockquote style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#e8dcc8', fontStyle: 'italic', maxWidth: 600, margin: '0 auto', lineHeight: 1.4 }}>
            "Happiness is a perfectly built burger."
          </blockquote>
          <div style={{ marginTop: 16, color: '#a07830', fontSize: '0.85rem' }}>— The BurgerBliss Team</div>
        </div>
      </div>
    </div>
  );
}
