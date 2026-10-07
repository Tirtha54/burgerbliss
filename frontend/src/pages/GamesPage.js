import React, { useState, useEffect, useRef } from 'react';

const SPIN_REWARDS = ['5% OFF', '10% OFF', '15% OFF', '₹50 OFF', 'Free Fries', '₹30 OFF', '20% OFF', '₹20 OFF'];
const QUIZ = [
  { q: 'What year was BurgerBliss founded?', opts: ['2018', '2020', '2022', '2019'], ans: 1 },
  { q: 'Which is our most popular burger?', opts: ['Aloo Tikki', 'Chicken Crispy', 'Paneer Royale', 'Maharaja Veg'], ans: 3 },
  { q: 'How many calories in our Diet Veg Burger?', opts: ['180', '220', '280', '300'], ans: 1 },
];

const MEMORY_EMOJIS = ['🍔', '🍟', '🥤', '🌮', '🍕', '🧁', '🌯', '🥗'];

function SpinWheel({ onWin }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [won, setWon] = useState(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true); setWon(null);
    const extra = 1440 + Math.random() * 360;
    const finalAngle = rotation + extra;
    setRotation(finalAngle);
    setTimeout(() => {
      const segAngle = 360 / SPIN_REWARDS.length;
      const idx = Math.floor(((360 - (finalAngle % 360)) % 360) / segAngle) % SPIN_REWARDS.length;
      setWon(SPIN_REWARDS[idx]);
      setSpinning(false);
      onWin('Spin & Win', SPIN_REWARDS[idx]);
    }, 3000);
  };

  const segAngle = 360 / SPIN_REWARDS.length;
  const colors = ['#8B6914', '#5c6430', '#6b4a0d', '#7a8540', '#a07830', '#4a5228', '#8B6914', '#5c6430'];

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 280, height: 280, margin: '0 auto 24px' }}>
        <svg width="280" height="280" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 3s cubic-bezier(0.2,0.8,0.3,1)' : 'none', filter: 'drop-shadow(0 0 20px rgba(160,120,48,0.3))' }}>
          {SPIN_REWARDS.map((reward, i) => {
            const startAngle = (i * segAngle - 90) * (Math.PI / 180);
            const endAngle = ((i + 1) * segAngle - 90) * (Math.PI / 180);
            const x1 = 140 + 130 * Math.cos(startAngle); const y1 = 140 + 130 * Math.sin(startAngle);
            const x2 = 140 + 130 * Math.cos(endAngle); const y2 = 140 + 130 * Math.sin(endAngle);
            const midAngle = (startAngle + endAngle) / 2;
            const tx = 140 + 80 * Math.cos(midAngle); const ty = 140 + 80 * Math.sin(midAngle);
            return (
              <g key={i}>
                <path d={`M140,140 L${x1},${y1} A130,130 0 0,1 ${x2},${y2} Z`} fill={colors[i]} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
                <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="9" fontWeight="600" transform={`rotate(${i * segAngle + segAngle / 2}, ${tx}, ${ty})`} style={{ fontFamily: 'Poppins' }}>
                  {reward}
                </text>
              </g>
            );
          })}
          <circle cx="140" cy="140" r="20" fill="#1a1208" stroke="rgba(160,120,48,0.5)" strokeWidth="2" />
        </svg>
        <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', fontSize: '1.5rem' }}>▼</div>
      </div>
      {won && <div style={{ marginBottom: 16, padding: '10px 20px', background: 'rgba(160,120,48,0.15)', border: '1px solid rgba(160,120,48,0.3)', borderRadius: 12, color: '#a07830', fontWeight: 600 }}>🎉 You won: {won}!</div>}
      <button className="btn-primary" onClick={spin} disabled={spinning} style={{ borderRadius: 12, padding: '12px 32px' }}>
        {spinning ? 'Spinning...' : 'Spin Now'}
      </button>
    </div>
  );
}

function MemoryGame({ onWin }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const init = () => {
    const pairs = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS].sort(() => Math.random() - 0.5);
    setCards(pairs.map((e, i) => ({ id: i, emoji: e })));
    setFlipped([]); setMatched([]); setMoves(0); setWon(false); setStartTime(Date.now());
  };

  useEffect(() => { init(); }, []);

  const flip = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      if (cards[newFlipped[0]].emoji === cards[newFlipped[1]].emoji) {
        const newMatched = [...matched, ...newFlipped];
        setMatched(newMatched);
        setFlipped([]);
        if (newMatched.length === cards.length) {
          const elapsed = (Date.now() - startTime) / 1000;
          const reward = elapsed < 30 ? '20% OFF' : elapsed < 60 ? '10% OFF' : '5% OFF';
          setWon(true);
          onWin('Memory Match', reward);
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          return (
            <div key={card.id} onClick={() => flip(card.id)} style={{
              height: 60, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isFlipped ? 'rgba(160,120,48,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isFlipped ? 'rgba(160,120,48,0.4)' : 'rgba(255,255,255,0.08)'}`,
              fontSize: isFlipped ? '1.5rem' : '0', transition: 'all 0.3s', userSelect: 'none'
            }}>
              {isFlipped ? card.emoji : '?'}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'rgba(212,196,168,0.6)', marginBottom: 12 }}>
        <span>Moves: {moves}</span>
        <span>Matched: {matched.length / 2}/{MEMORY_EMOJIS.length}</span>
      </div>
      {won && <div style={{ padding: '10px 16px', background: 'rgba(92,100,48,0.15)', border: '1px solid rgba(92,100,48,0.3)', borderRadius: 10, color: '#7a8540', textAlign: 'center', marginBottom: 10, fontSize: '0.9rem', fontWeight: 500 }}>🎉 You won a reward!</div>}
      <button onClick={init} className="btn-outline" style={{ width: '100%', borderRadius: 10, padding: '10px' }}>Restart</button>
    </div>
  );
}

function QuizGame({ onWin }) {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState(null);

  const answer = (i) => {
    setSelected(i);
    setTimeout(() => {
      const newScore = i === QUIZ[qIdx].ans ? score + 1 : score;
      if (qIdx + 1 < QUIZ.length) { setQIdx(qIdx + 1); setScore(newScore); setSelected(null); }
      else {
        setDone(true);
        if (newScore >= 2) onWin('Quiz Challenge', '₹30 OFF');
      }
    }, 600);
  };

  const reset = () => { setQIdx(0); setScore(0); setDone(false); setSelected(null); };

  if (done) return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>{score >= 2 ? '🏆' : '😔'}</div>
      <h4 style={{ color: '#e8dcc8', fontFamily: 'Playfair Display, serif', marginBottom: 8 }}>{score >= 2 ? 'Quiz Passed!' : 'Better luck next time!'}</h4>
      <p style={{ color: 'rgba(212,196,168,0.6)', fontSize: '0.9rem', marginBottom: 16 }}>{score}/{QUIZ.length} correct. {score >= 2 ? 'You won ₹30 OFF!' : ''}</p>
      <button className="btn-primary" onClick={reset} style={{ borderRadius: 12, padding: '10px 28px' }}>Try Again</button>
    </div>
  );

  const q = QUIZ[qIdx];
  return (
    <div>
      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#a07830', marginBottom: 12 }}>Question {qIdx + 1}/{QUIZ.length}</div>
      <p style={{ color: '#e8dcc8', fontSize: '1rem', marginBottom: 16, lineHeight: 1.5 }}>{q.q}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {q.opts.map((opt, i) => (
          <button key={i} onClick={() => answer(i)} disabled={selected !== null} style={{
            padding: '10px 16px', borderRadius: 10, border: '1px solid', textAlign: 'left',
            borderColor: selected === i ? (i === q.ans ? 'rgba(92,100,48,0.6)' : 'rgba(200,50,30,0.4)') : 'rgba(255,255,255,0.1)',
            background: selected === i ? (i === q.ans ? 'rgba(92,100,48,0.2)' : 'rgba(120,30,20,0.2)') : 'rgba(255,255,255,0.03)',
            color: '#d4c4a8', cursor: 'pointer', fontFamily: 'Poppins', fontSize: '0.9rem', transition: 'all 0.2s'
          }}>{opt}</button>
        ))}
      </div>
    </div>
  );
}

function DailyOffer({ onWin }) {
  const [revealed, setReveal] = useState(false);
  const [reward] = useState(['₹50 OFF', 'Free Fries', '15% OFF', '10% OFF'][Math.floor(Math.random() * 4)]);

  const reveal = () => { setReveal(true); onWin('Daily Offer', reward); };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>{revealed ? '🎁' : '🎲'}</div>
      <h4 style={{ color: '#e8dcc8', fontFamily: 'Playfair Display, serif', marginBottom: 8 }}>Today's Mystery Reward</h4>
      <p style={{ color: 'rgba(212,196,168,0.6)', fontSize: '0.88rem', marginBottom: 20 }}>One surprise reward per day. Tap to reveal!</p>
      {revealed ? (
        <div style={{ padding: '16px', background: 'rgba(160,120,48,0.15)', border: '1px solid rgba(160,120,48,0.3)', borderRadius: 14, color: '#a07830', fontWeight: 700, fontSize: '1.2rem' }}>
          🎉 {reward}
        </div>
      ) : (
        <button className="btn-primary" onClick={reveal} style={{ borderRadius: 12, padding: '12px 32px' }}>Reveal Reward</button>
      )}
    </div>
  );
}

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState(null);
  const [rewards, setRewards] = useState(JSON.parse(localStorage.getItem('bb_rewards') || '[]'));

  const games = [
    { id: 'spin', title: 'Spin & Win', desc: 'Spin the wheel for exclusive discounts', icon: '🎰', comp: SpinWheel },
    { id: 'memory', title: 'Memory Match', desc: 'Match pairs faster to win bigger rewards', icon: '🧠', comp: MemoryGame },
    { id: 'quiz', title: 'Quiz Challenge', desc: 'Answer 3 questions, win ₹30 OFF', icon: '❓', comp: QuizGame },
    { id: 'daily', title: 'Daily Offer', desc: 'Mystery reward, refreshes every day', icon: '🎁', comp: DailyOffer },
  ];

  const handleWin = (gameType, value) => {
    const reward = { id: Date.now(), type: gameType, value, used: false, date: new Date().toLocaleDateString() };
    const updated = [...rewards, reward];
    setRewards(updated);
    localStorage.setItem('bb_rewards', JSON.stringify(updated));
  };

  const ActiveComp = activeGame ? games.find(g => g.id === activeGame)?.comp : null;

  return (
    <div className="page" style={{ background: '#12100d', minHeight: '100vh' }}>
      <div style={{ padding: '40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: '#a07830', marginBottom: 10 }}>BurgerBliss Games</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,4vw,3rem)', color: '#e8dcc8', marginBottom: 10 }}>Play. Win. Feast.</h1>
          <p style={{ color: '#d4c4a8', fontWeight: 300 }}>Win exclusive rewards and discounts by playing our games.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 40 }}>
          {games.map(game => (
            <div key={game.id} onClick={() => setActiveGame(game.id)} style={{
              background: activeGame === game.id ? 'rgba(160,120,48,0.12)' : 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)', border: `1px solid ${activeGame === game.id ? 'rgba(160,120,48,0.4)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 20, padding: '28px 24px', cursor: 'pointer', transition: 'all 0.3s',
              boxShadow: activeGame === game.id ? '0 0 30px rgba(160,120,48,0.15)' : 'none'
            }}
              onMouseEnter={e => { if (activeGame !== game.id) e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{game.icon}</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', fontSize: '1.2rem', marginBottom: 8 }}>{game.title}</h3>
              <p style={{ color: 'rgba(212,196,168,0.6)', fontSize: '0.88rem', lineHeight: 1.5 }}>{game.desc}</p>
              {activeGame !== game.id && (
                <div style={{ marginTop: 16, display: 'inline-block', padding: '6px 16px', background: 'rgba(160,120,48,0.1)', border: '1px solid rgba(160,120,48,0.2)', borderRadius: 20, color: '#a07830', fontSize: '0.8rem' }}>
                  Play Now →
                </div>
              )}
            </div>
          ))}
        </div>

        {ActiveComp && (
          <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '36px', maxWidth: 500, margin: '0 auto', marginBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8' }}>{games.find(g => g.id === activeGame)?.title}</h3>
              <button onClick={() => setActiveGame(null)} style={{ background: 'none', border: 'none', color: 'rgba(212,196,168,0.4)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <ActiveComp onWin={handleWin} key={activeGame} />
          </div>
        )}

        {rewards.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#e8dcc8', marginBottom: 16 }}>My Rewards 🏆</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {rewards.map(r => (
                <div key={r.id} style={{
                  padding: '8px 16px', borderRadius: 20, border: '1px solid',
                  borderColor: r.used ? 'rgba(255,255,255,0.08)' : 'rgba(160,120,48,0.3)',
                  background: r.used ? 'transparent' : 'rgba(160,120,48,0.08)',
                  color: r.used ? 'rgba(212,196,168,0.3)' : '#a07830',
                  fontSize: '0.85rem', fontWeight: 500,
                  textDecoration: r.used ? 'line-through' : 'none'
                }}>
                  {r.type}: {r.value} {r.used ? '(Used)' : ''}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
