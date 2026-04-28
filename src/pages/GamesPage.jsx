import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'

// ── Inline styles (no CSS module needed) ──────────────────────────────────────
const S = {
  page: {
    maxWidth: 960,
    margin: '0 auto',
    padding: '32px 24px 64px',
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
  },
  sub: {
    color: 'var(--muted)',
    fontSize: '0.95rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
  },
  gameCard: (active) => ({
    background: active ? 'var(--card)' : 'var(--card)',
    border: `1px solid ${active ? 'var(--honey)' : 'var(--border)'}`,
    borderRadius: 20,
    padding: 24,
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
    overflow: 'hidden',
  }),
  gameIcon: {
    fontSize: '2.4rem',
    marginBottom: 12,
    display: 'block',
  },
  gameTitle: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '1.05rem',
    marginBottom: 6,
  },
  gameDesc: {
    fontSize: '0.85rem',
    color: 'var(--muted)',
    lineHeight: 1.5,
    marginBottom: 16,
  },
  playBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 18px',
    background: 'rgba(245,166,35,0.12)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    color: 'var(--honey)',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(10,10,10,0.85)',
    backdropFilter: 'blur(12px)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 540,
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: 'var(--dark2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--muted)',
    fontSize: '1rem',
  },
  xpToast: {
    position: 'fixed',
    bottom: 32,
    right: 32,
    background: 'var(--honey)',
    color: 'var(--black)',
    padding: '14px 22px',
    borderRadius: 14,
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '1rem',
    zIndex: 300,
    boxShadow: '0 8px 32px rgba(245,166,35,0.4)',
    animation: 'slideInUp 0.3s ease',
  },
}

// ── XP helper ─────────────────────────────────────────────────────────────────
async function awardXP(userId, amount) {
  const { data } = await supabase.from('profiles').select('xp').eq('id', userId).single()
  if (data) {
    await supabase.from('profiles').update({ xp: (data.xp || 0) + amount }).eq('id', userId)
  }
}

// ── GAME 1 : Math Blitz ───────────────────────────────────────────────────────
function MathBlitz({ onClose, onXP }) {
  const [q, setQ] = useState(null)
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [done, setDone] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const inputRef = useRef()

  const newQ = () => {
    const ops = ['+', '-', '×']
    const op = ops[Math.floor(Math.random() * ops.length)]
    const a = Math.floor(Math.random() * 12) + 1
    const b = Math.floor(Math.random() * 12) + 1
    const ans = op === '+' ? a + b : op === '-' ? a - b : a * b
    setQ({ text: `${a} ${op} ${b}`, ans })
    setInput('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  useEffect(() => { newQ() }, [])

  useEffect(() => {
    if (done) return
    const t = setInterval(() => setTimeLeft(p => {
      if (p <= 1) { clearInterval(t); setDone(true); return 0 }
      return p - 1
    }), 1000)
    return () => clearInterval(t)
  }, [done])

  const submit = () => {
    if (!q) return
    const correct = parseInt(input) === q.ans
    setFeedback(correct ? '✅' : `❌ ${q.ans}`)
    if (correct) setScore(s => s + 1)
    setTimeout(() => { setFeedback(null); newQ() }, 700)
    setInput('')
  }

  const earned = score * 5
  useEffect(() => { if (done && score > 0) onXP(earned) }, [done])

  return (
    <div>
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>⚡ Math Blitz</h2>
      {!done ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, color: 'var(--muted)', fontSize: '0.9rem' }}>
            <span>Score: <strong style={{ color: 'var(--honey)' }}>{score}</strong></span>
            <span style={{ color: timeLeft <= 10 ? 'var(--error)' : 'inherit' }}>⏱ {timeLeft}s</span>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: '3rem', fontFamily: 'Syne,sans-serif', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
              {q?.text} = ?
            </div>
            {feedback && <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{feedback}</div>}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              ref={inputRef}
              type="number"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={{ flex: 1, background: 'var(--dark2)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '13px 16px', color: 'var(--text)', fontSize: '1.1rem', outline: 'none' }}
              placeholder="Your answer…"
              autoFocus
            />
            <button className="hive-btn" onClick={submit}>Go</button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>{score >= 15 ? '🏆' : score >= 8 ? '⭐' : '🐝'}</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>{score} correct!</div>
          <div style={{ color: 'var(--muted)', marginBottom: 20 }}>You earned <strong style={{ color: 'var(--honey)' }}>+{earned} XP</strong></div>
          <button className="hive-btn" onClick={onClose}>Done</button>
        </div>
      )}
    </div>
  )
}

// ── GAME 2 : Word Scramble ─────────────────────────────────────────────────────
const WORDS = [
  { word: 'PHOTOSYNTHESIS', hint: 'How plants make food from sunlight' },
  { word: 'DEMOCRACY', hint: 'Government by the people' },
  { word: 'VELOCITY', hint: 'Speed in a direction' },
  { word: 'EQUATION', hint: 'A math statement with an equals sign' },
  { word: 'HYPOTHESIS', hint: 'A testable prediction' },
  { word: 'METAMORPHOSIS', hint: 'A caterpillar becoming a butterfly' },
  { word: 'ALGORITHM', hint: 'Step-by-step instructions to solve a problem' },
  { word: 'LONGITUDE', hint: 'East-west position on a map' },
]

function scramble(w) {
  const arr = w.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  const s = arr.join('')
  return s === w ? scramble(w) : s
}

function WordScramble({ onClose, onXP }) {
  const [idx, setIdx] = useState(0)
  const [scrambled, setScrambled] = useState(() => scramble(WORDS[0].word))
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [done, setDone] = useState(false)
  const [skipped, setSkipped] = useState(0)

  const current = WORDS[idx]

  const check = () => {
    const correct = input.toUpperCase().trim() === current.word
    setFeedback(correct ? '✅ Correct!' : `❌ It was "${current.word}"`)
    if (correct) setScore(s => s + 1)
    setTimeout(next, 900)
  }

  const next = () => {
    setFeedback(null)
    setInput('')
    if (idx + 1 >= WORDS.length) { setDone(true); return }
    const ni = idx + 1
    setIdx(ni)
    setScrambled(scramble(WORDS[ni].word))
  }

  const skip = () => { setSkipped(s => s + 1); next() }
  const earned = score * 8
  useEffect(() => { if (done && score > 0) onXP(earned) }, [done])

  return (
    <div>
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>🔤 Word Scramble</h2>
      {!done ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, color: 'var(--muted)', fontSize: '0.9rem' }}>
            <span>Score: <strong style={{ color: 'var(--honey)' }}>{score}</strong></span>
            <span>{idx + 1} / {WORDS.length}</span>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: '2rem', fontFamily: 'Syne,sans-serif', fontWeight: 800, letterSpacing: '0.15em', marginBottom: 12, color: 'var(--honey)' }}>
              {scrambled}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 20, background: 'var(--dark2)', padding: '8px 16px', borderRadius: 10 }}>
              💡 {current.hint}
            </div>
            {feedback && <div style={{ fontSize: '1rem', marginBottom: 12, fontWeight: 600 }}>{feedback}</div>}
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && check()}
              style={{ flex: 1, background: 'var(--dark2)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '13px 16px', color: 'var(--text)', fontSize: '1rem', outline: 'none', textTransform: 'uppercase' }}
              placeholder="Unscramble it…"
              autoFocus
            />
            <button className="hive-btn" onClick={check}>Check</button>
          </div>
          <button className="hive-btn-ghost" onClick={skip} style={{ width: '100%', padding: '10px' }}>Skip →</button>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>{score >= 6 ? '🏆' : score >= 3 ? '⭐' : '🐝'}</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>{score}/{WORDS.length} correct!</div>
          <div style={{ color: 'var(--muted)', marginBottom: 20 }}>You earned <strong style={{ color: 'var(--honey)' }}>+{earned} XP</strong></div>
          <button className="hive-btn" onClick={onClose}>Done</button>
        </div>
      )}
    </div>
  )
}

// ── GAME 3 : True or False ────────────────────────────────────────────────────
const TRIVIA = [
  { q: 'The Great Wall of China is visible from space with the naked eye.', a: false },
  { q: 'Water boils at 100°C at sea level.', a: true },
  { q: 'Humans use only 10% of their brain.', a: false },
  { q: 'Sound travels faster than light.', a: false },
  { q: 'The Earth is the largest planet in our solar system.', a: false },
  { q: 'Photosynthesis produces oxygen as a byproduct.', a: true },
  { q: 'DNA stands for Deoxyribonucleic Acid.', a: true },
  { q: 'Lightning never strikes the same place twice.', a: false },
  { q: 'The speed of light is approximately 300,000 km/s.', a: true },
  { q: 'Sharks are mammals.', a: false },
]

function TrueOrFalse({ onClose, onXP }) {
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [done, setDone] = useState(false)
  const [questions] = useState(() => [...TRIVIA].sort(() => Math.random() - 0.5))

  const answer = (choice) => {
    const correct = choice === questions[idx].a
    setFeedback({ correct, truth: questions[idx].a })
    if (correct) setScore(s => s + 1)
    setTimeout(() => {
      setFeedback(null)
      if (idx + 1 >= questions.length) setDone(true)
      else setIdx(i => i + 1)
    }, 900)
  }

  const earned = score * 6
  useEffect(() => { if (done && score > 0) onXP(earned) }, [done])

  return (
    <div>
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>🎯 True or False</h2>
      {!done ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, color: 'var(--muted)', fontSize: '0.9rem' }}>
            <span>Score: <strong style={{ color: 'var(--honey)' }}>{score}</strong></span>
            <span>{idx + 1} / {questions.length}</span>
          </div>
          <div style={{ background: 'var(--dark2)', borderRadius: 16, padding: '24px 20px', textAlign: 'center', marginBottom: 24, minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>{questions[idx].q}</p>
          </div>
          {feedback ? (
            <div style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 700 }}>
              {feedback.correct ? '✅ Correct!' : `❌ It's ${feedback.truth ? 'TRUE' : 'FALSE'}`}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[true, false].map(v => (
                <button key={String(v)} onClick={() => answer(v)} style={{ padding: '18px', borderRadius: 14, border: `1.5px solid ${v ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`, background: v ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)', color: v ? 'var(--success)' : 'var(--error)', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {v ? '✅ True' : '❌ False'}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>{score >= 8 ? '🏆' : score >= 5 ? '⭐' : '🐝'}</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>{score}/{questions.length} correct!</div>
          <div style={{ color: 'var(--muted)', marginBottom: 20 }}>You earned <strong style={{ color: 'var(--honey)' }}>+{earned} XP</strong></div>
          <button className="hive-btn" onClick={onClose}>Done</button>
        </div>
      )}
    </div>
  )
}

// ── Main GamesPage ─────────────────────────────────────────────────────────────
const GAMES = [
  { id: 'math', icon: '⚡', title: 'Math Blitz', desc: 'Answer as many maths questions as you can in 30 seconds. Earn 5 XP per correct answer.', xpHint: '5 XP / question', component: MathBlitz },
  { id: 'scramble', icon: '🔤', title: 'Word Scramble', desc: 'Unscramble subject-related words using the hint. Tests vocab across all subjects.', xpHint: '8 XP / word', component: WordScramble },
  { id: 'trivia', icon: '🎯', title: 'True or False', desc: 'Quick-fire science & general knowledge statements. How many can you get right?', xpHint: '6 XP / question', component: TrueOrFalse },
]

export default function GamesPage() {
  const { user } = useAuth()
  const [active, setActive] = useState(null)
  const [toast, setToast] = useState(null)

  const handleXP = async (amount) => {
    if (!user) return
    await awardXP(user.id, amount)
    setToast(`+${amount} XP earned! 🐝`)
    setTimeout(() => setToast(null), 3000)
  }

  const ActiveGame = active ? GAMES.find(g => g.id === active)?.component : null

  return (
    <>
      <style>{`
        @keyframes slideInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .game-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.3); }
        .play-btn:hover { background: rgba(245,166,35,0.22) !important; border-color: var(--honey) !important; }
      `}</style>

      <div style={S.page}>
        <div style={S.header}>
          <h1 style={S.title}>🎮 Study Games</h1>
          <p style={S.sub}>Play, learn, and earn XP. Every correct answer counts towards your rank.</p>
        </div>

        <div style={S.grid}>
          {GAMES.map(game => (
            <div key={game.id} className="game-card" style={{ ...S.gameCard(false), transition: 'all 0.2s' }}>
              <span style={S.gameIcon}>{game.icon}</span>
              <div style={S.gameTitle}>{game.title}</div>
              <div style={S.gameDesc}>{game.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  className="play-btn"
                  style={S.playBtn}
                  onClick={() => setActive(game.id)}
                >
                  Play now →
                </button>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{game.xpHint}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div style={{ background: 'linear-gradient(135deg, rgba(245,166,35,0.06), rgba(245,166,35,0.02))', border: '1px solid var(--border)', borderLeft: '3px solid var(--honey)', borderRadius: 16, padding: '16px 20px' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--honey)' }}>💡 Tip:</strong> XP is added to your profile automatically after each game. Complete all three games to climb the leaderboard!
          </p>
        </div>
      </div>

      {/* Game Modal */}
      {ActiveGame && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && setActive(null)}>
          <div style={S.modalBox}>
            <button style={S.closeBtn} onClick={() => setActive(null)}>✕</button>
            <ActiveGame onClose={() => setActive(null)} onXP={handleXP} />
          </div>
        </div>
      )}

      {/* XP Toast */}
      {toast && <div style={S.xpToast}>{toast}</div>}
    </>
  )
}
