import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const { signIn, signUp } = useAuth()

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password, username)
        setSuccess('Account created! Check your email to confirm, then log in.')
        setMode('login')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Hexagon background */}
      <div className={styles.hexBg}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={styles.hex} style={{
            '--delay': `${i * 0.3}s`,
            '--x': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`,
            '--size': `${30 + Math.random() * 60}px`
          }} />
        ))}
      </div>

      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.bee}>🐝</span>
          <span className={styles.brand}>StudyHive</span>
        </div>
        <p className={styles.tagline}>Where students thrive together</p>

        {/* Toggle */}
        <div className={styles.toggle}>
          <button
            className={mode === 'login' ? styles.active : ''}
            onClick={() => { setMode('login'); setError('') }}
          >Sign In</button>
          <button
            className={mode === 'register' ? styles.active : ''}
            onClick={() => { setMode('register'); setError('') }}
          >Join Hive</button>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handle}>
          {mode === 'register' && (
            <div className={styles.field}>
              <label>Username</label>
              <input
                type="text"
                placeholder="your_cool_name"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                minLength={3}
              />
            </div>
          )}
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              placeholder="you@school.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              placeholder={mode === 'register' ? 'min. 6 characters' : '••••••••'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <div className={styles.error}>⚠️ {error}</div>}
          {success && <div className={styles.successMsg}>✅ {success}</div>}

          <button type="submit" className={`hive-btn ${styles.submit}`} disabled={loading}>
            {loading ? '🐝 Buzzing…' : mode === 'login' ? 'Enter the Hive →' : 'Create Account →'}
          </button>
        </form>

        <p className={styles.footer}>
          {mode === 'login' ? "Don't have an account? " : "Already a member? "}
          <button
            className={styles.link}
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
          >
            {mode === 'login' ? 'Join the hive' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
