import { useState, useEffect } from 'react'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'

const SUBJECTS = ['Maths', 'Science', 'English', 'History', 'Geography', 'Art', 'PE', 'Other']

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
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
  },
  sub: {
    color: 'var(--muted)',
    fontSize: '0.9rem',
    marginTop: 4,
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  filterBtn: (active) => ({
    padding: '7px 14px',
    borderRadius: 100,
    border: `1px solid ${active ? 'var(--honey)' : 'var(--border)'}`,
    background: active ? 'rgba(245,166,35,0.12)' : 'transparent',
    color: active ? 'var(--honey)' : 'var(--muted)',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
  }),
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  card: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: '18px 20px',
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
    transition: 'border-color 0.15s',
  },
  cardLeft: {
    flex: 1,
    minWidth: 0,
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  subject: {
    fontSize: '0.72rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--honey)',
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: 4,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardBody: {
    fontSize: '0.88rem',
    color: 'var(--muted)',
    lineHeight: 1.5,
    marginBottom: 8,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardMeta: {
    fontSize: '0.78rem',
    color: 'var(--muted)',
  },
  empty: {
    textAlign: 'center',
    padding: '48px 24px',
    color: 'var(--muted)',
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 20,
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
    maxWidth: 520,
    position: 'relative',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 18,
  },
  label: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 600,
    fontSize: '0.82rem',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    background: 'var(--dark2)',
    border: '1.5px solid var(--border)',
    borderRadius: 12,
    padding: '12px 16px',
    color: 'var(--text)',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    background: 'var(--dark2)',
    border: '1.5px solid var(--border)',
    borderRadius: 12,
    padding: '12px 16px',
    color: 'var(--text)',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    width: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: 90,
  },
  select: {
    background: 'var(--dark2)',
    border: '1.5px solid var(--border)',
    borderRadius: 12,
    padding: '12px 16px',
    color: 'var(--text)',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    width: '100%',
  },
  typeToggle: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  typeBtn: (active) => ({
    padding: '12px',
    borderRadius: 12,
    border: `1.5px solid ${active ? 'var(--honey)' : 'var(--border)'}`,
    background: active ? 'rgba(245,166,35,0.1)' : 'transparent',
    color: active ? 'var(--honey)' : 'var(--muted)',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 600,
    fontSize: '0.88rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
    textAlign: 'center',
  }),
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
  deleteBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '6px 10px',
    color: 'var(--muted)',
    fontSize: '0.8rem',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.15s',
  },
  toast: {
    position: 'fixed',
    bottom: 32,
    right: 32,
    background: 'var(--success)',
    color: 'var(--black)',
    padding: '14px 22px',
    borderRadius: 14,
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '0.95rem',
    zIndex: 300,
  },
}

export default function HomeworkPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [filterSubject, setFilterSubject] = useState('all')
  const [toast, setToast] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  // Form state
  const [form, setForm] = useState({ title: '', body: '', subject: 'Maths', type: 'sharing', due_date: '' })

  const fetchPosts = async () => {
    setLoading(true)
    let q = supabase.from('homework').select('*').order('created_at', { ascending: false })
    if (filterType !== 'all') q = q.eq('type', filterType)
    if (filterSubject !== 'all') q = q.eq('subject', filterSubject)
    const { data } = await q
    setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [filterType, filterSubject])

  const submit = async (e) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'Student'
    const { error } = await supabase.from('homework').insert({
      title: form.title,
      body: form.body,
      subject: form.subject,
      type: form.type,
      due_date: form.due_date || null,
      author_id: user.id,
      author_name: username,
    })
    setSubmitting(false)
    if (!error) {
      setShowModal(false)
      setForm({ title: '', body: '', subject: 'Maths', type: 'sharing', due_date: '' })
      fetchPosts()
      setToast('Posted! 📚')
      setTimeout(() => setToast(null), 3000)
    }
  }

  const deletePost = async (id) => {
    await supabase.from('homework').delete().eq('id', id).eq('author_id', user.id)
    fetchPosts()
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : null
  const timeAgo = (d) => {
    const s = Math.floor((Date.now() - new Date(d)) / 1000)
    if (s < 60) return 'just now'
    if (s < 3600) return `${Math.floor(s / 60)}m ago`
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`
    return `${Math.floor(s / 86400)}d ago`
  }

  return (
    <>
      <style>{`
        .hw-card:hover { border-color: rgba(245,166,35,0.3) !important; }
        .delete-btn:hover { border-color: var(--error) !important; color: var(--error) !important; }
        input:focus, textarea:focus, select:focus { border-color: var(--honey) !important; box-shadow: 0 0 0 4px rgba(245,166,35,0.08); }
      `}</style>

      <div style={S.page}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.title}>📚 Homework Hub</h1>
            <p style={S.sub}>Share homework, ask for help, collaborate with your classmates.</p>
          </div>
          <button className="hive-btn" onClick={() => setShowModal(true)}>+ Post homework</button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={S.filters}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginRight: 4 }}>Type:</span>
            {[['all', 'All'], ['sharing', '✅ Sharing'], ['help', '🙋 Need help']].map(([v, l]) => (
              <button key={v} style={S.filterBtn(filterType === v)} onClick={() => setFilterType(v)}>{l}</button>
            ))}
          </div>
          <div style={S.filters}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginRight: 4 }}>Subject:</span>
            {['all', ...SUBJECTS].map(s => (
              <button key={s} style={S.filterBtn(filterSubject === s)} onClick={() => setFilterSubject(s)}>
                {s === 'all' ? 'All subjects' : s}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>🐝 Loading the hive…</div>
        ) : posts.length === 0 ? (
          <div style={S.empty}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
            <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 6 }}>Nothing here yet</p>
            <p style={{ fontSize: '0.88rem' }}>Be the first to post something!</p>
          </div>
        ) : (
          <div style={S.list}>
            {posts.map(hw => (
              <div
                key={hw.id}
                className="hw-card"
                style={S.card}
              >
                <div style={S.cardLeft}>
                  <div style={S.cardTop}>
                    <span style={S.subject}>{hw.subject}</span>
                    <span className={`tag ${hw.type === 'help' ? 'tag-blue' : 'tag-honey'}`}>
                      {hw.type === 'help' ? '🙋 Need help' : '✅ Sharing'}
                    </span>
                    {hw.due_date && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)', background: 'var(--dark2)', padding: '2px 8px', borderRadius: 6 }}>
                        Due {formatDate(hw.due_date)}
                      </span>
                    )}
                  </div>
                  <div
                    style={{ ...S.cardTitle, cursor: hw.body ? 'pointer' : 'default', whiteSpace: 'normal' }}
                    onClick={() => setExpandedId(expandedId === hw.id ? null : hw.id)}
                  >
                    {hw.title}
                  </div>
                  {hw.body && (
                    <div style={{ ...S.cardBody, WebkitLineClamp: expandedId === hw.id ? 'unset' : 2 }}>
                      {hw.body}
                    </div>
                  )}
                  <div style={S.cardMeta}>
                    by <strong style={{ color: 'var(--text)' }}>{hw.author_name || 'Anonymous'}</strong> · {timeAgo(hw.created_at)}
                    {hw.body && (
                      <button
                        onClick={() => setExpandedId(expandedId === hw.id ? null : hw.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--honey)', fontSize: '0.78rem', cursor: 'pointer', marginLeft: 8, fontWeight: 600 }}
                      >
                        {expandedId === hw.id ? 'less ↑' : 'more ↓'}
                      </button>
                    )}
                  </div>
                </div>
                {hw.author_id === user?.id && (
                  <button
                    className="delete-btn"
                    style={S.deleteBtn}
                    onClick={() => deletePost(hw.id)}
                    title="Delete post"
                  >
                    🗑
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Modal */}
      {showModal && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={S.modalBox}>
            <button style={S.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 800, marginBottom: 22 }}>📝 Post Homework</h2>

            <form onSubmit={submit}>
              <div style={S.field}>
                <label style={S.label}>Post type</label>
                <div style={S.typeToggle}>
                  {[['sharing', '✅ Sharing notes'], ['help', '🙋 Need help']].map(([v, l]) => (
                    <button type="button" key={v} style={S.typeBtn(form.type === v)} onClick={() => setForm(f => ({ ...f, type: v }))}>{l}</button>
                  ))}
                </div>
              </div>

              <div style={S.field}>
                <label style={S.label}>Subject</label>
                <select style={S.select} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div style={S.field}>
                <label style={S.label}>Title</label>
                <input
                  style={S.input}
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder={form.type === 'help' ? 'e.g. Stuck on quadratic equations' : 'e.g. Chapter 5 summary notes'}
                  required
                />
              </div>

              <div style={S.field}>
                <label style={S.label}>Details <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(optional)</span></label>
                <textarea
                  style={S.textarea}
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  placeholder="Add more context, what you've tried, or a link…"
                />
              </div>

              <div style={S.field}>
                <label style={S.label}>Due date <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(optional)</span></label>
                <input
                  type="date"
                  style={{ ...S.input, colorScheme: 'dark' }}
                  value={form.due_date}
                  onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                />
              </div>

              <button type="submit" className="hive-btn" style={{ width: '100%', padding: 14, fontSize: '1rem' }} disabled={submitting}>
                {submitting ? '🐝 Posting…' : 'Post to the Hive →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && <div style={S.toast}>{toast}</div>}
    </>
  )
}
