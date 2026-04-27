import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const { pathname } = useLocation()
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'Student'

  const links = [
    { to: '/', label: 'Dashboard', icon: '🏠' },
    { to: '/homework', label: 'Homework', icon: '📚' },
    { to: '/games', label: 'Games', icon: '🎮' },
  ]

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <span>🐝</span>
        <span className={styles.logoText}>StudyHive</span>
      </Link>

      <div className={styles.links}>
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`${styles.link} ${pathname === link.to ? styles.active : ''}`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </div>

      <div className={styles.user}>
        <div className={styles.avatar}>
          {username.charAt(0).toUpperCase()}
        </div>
        <span className={styles.name}>{username}</span>
        <button className={styles.signOut} onClick={signOut} title="Sign out">
          ↩
        </button>
      </div>
    </nav>
  )
}
