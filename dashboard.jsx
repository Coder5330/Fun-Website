import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import styles from './Dashboard.module.css'

const BADGES = [
  { min: 0, badge: '🐣', label: 'Hatchling' },
  { min: 100, badge: '🐝', label: 'Worker Bee' },
  { min: 300, badge: '🌟', label: 'Star Student' },
  { min: 600, badge: '👑', label: 'Queen Bee' },
  { min: 1000, badge: '🔥', label: 'Legendary' },
]

function getBadge(xp) {
  for (let i = BADGES.length - 1; i >= 0; i--) {
    if (xp >= BADGES[i].min) return BADGES[i]
  }
  return BADGES[0]
}

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [recentHW, setRecentHW] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [quote] = useState(() => {
    const quotes = [
      { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
      { text: "Education is not the filling of a pot but the lighting of a fire.", author: "W.B. Yeats" },
      { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
      { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
    ]
    return quotes[Math.floor(Math.random() * quotes.length)]
  })

  useEffect(() => {
    if (!user) return

    // Fetch profile
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => setProfile(data))

    // Fetch recent homework
    supabase.from('homework').select('*').order('created_at', { ascending: false }).limit(4)
      .then(({ data }) => setRecentHW(data || []))

    // Fetch leaderboard
    supabase.from('profiles').select('username, xp, badge').order('xp', { ascending: false }).limit(5)
      .then(({ data }) => setLeaderboard(data || []))
  }, [user])

  const username = profile?.username || user?.user_metadata?.username || 'Student'
  const xp = profile?.xp || 0
  const badgeInfo = getBadge(xp)
  const nextBadge = BADGES.find(b => b.min > xp)
  const progress = nextBadge ? Math.min(100, ((xp - badgeInfo.min) / (nextBadge.min - badgeInfo.min)) * 100) : 100

  return (
    <div className={styles.page}>
      {/* Hero greeting */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.greeting}>
            Hey {username}! {badgeInfo.badge}
          </h1>
          <p className={styles.subtitle}>Ready to conquer today's challenges?</p>
        </div>
        <div className={styles.xpCard}>
          <div className={styles.xpTop}>
            <span className={styles.xpBadge}>{badgeInfo.badge}</span>
            <div>
              <div className={styles.xpLabel}>{badgeInfo.label}</div>
              <div className={styles.xpValue}>{xp} XP</div>
            </div>
          </div>
          <div className={styles.xpBar}>
            <div className={styles.xpFill} style={{ width: `${progress}%` }} />
          </div>
          {nextBadge && (
            <div className={styles.xpNext}>{nextBadge.min - xp} XP to {nextBadge.badge}</div>
          )}
        </div>
      </div>

      {/* Quote */}
      <div className={styles.quote}>
        <span className={styles.quoteIcon}>"</span>
        <p className={styles.quoteText}>{quote.text}</p>
        <p className={styles.quoteAuthor}>— {quote.author}</p>
      </div>

      {/* Quick links */}
      <div className={styles.quickLinks}>
        <Link to="/homework" className={`${styles.ql} ${styles.qlHW}`}>
          <span className={styles.qlIcon}>📚</span>
          <span className={styles.qlLabel}>Homework Hub</span>
          <span className={styles.qlSub}>Share & collaborate</span>
          <span className={styles.qlArrow}>→</span>
        </Link>
        <Link to="/games" className={`${styles.ql} ${styles.qlGames}`}>
          <span className={styles.qlIcon}>🎮</span>
          <span className={styles.qlLabel}>Study Games</span>
          <span className={styles.qlSub}>Learn by playing</span>
          <span className={styles.qlArrow}>→</span>
        </Link>
      </div>

      <div className={styles.grid}>
        {/* Recent Homework */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>📖 Recent Homework</h2>
            <Link to="/homework" className={styles.seeAll}>See all →</Link>
          </div>
          <div className={styles.hwList}>
            {recentHW.length === 0 ? (
              <div className={styles.empty}>
                <span>📭</span>
                <p>No homework posted yet. Be the first!</p>
              </div>
            ) : recentHW.map(hw => (
              <div key={hw.id} className={styles.hwItem}>
                <div className={styles.hwLeft}>
                  <span className={styles.hwSubject}>{hw.subject}</span>
                  <p className={styles.hwTitle}>{hw.title}</p>
                  <p className={styles.hwMeta}>by {hw.author_name} · Due {hw.due_date || 'TBD'}</p>
                </div>
                <span className={`tag ${hw.type === 'help' ? 'tag-blue' : 'tag-honey'}`}>
                  {hw.type === 'help' ? '🙋 Need help' : '✅ Sharing'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>🏆 Leaderboard</h2>
          </div>
          <div className={styles.board}>
            {leaderboard.length === 0 ? (
              <div className={styles.empty}><span>🐝</span><p>Be the first on the board!</p></div>
            ) : leaderboard.map((p, i) => (
              <div key={i} className={`${styles.boardItem} ${p.id === user?.id ? styles.you : ''}`}>
                <span className={styles.rank}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>
                <span className={styles.boardName}>{p.username || 'Anonymous'}</span>
                <span className={styles.boardXP}>{p.xp || 0} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
