import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/AuthContext'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
//import HomeworkPage from './pages/HomeworkPage'
//import GamesPage from './pages/GamesPage'
import Navbar from './components/Navbar'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function LoadingScreen() {
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
      background: 'var(--dark)'
    }}>
      <div style={{ fontSize: 48, animation: 'spin 1s linear infinite' }}>🐝</div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: 'var(--muted)', fontFamily: 'Syne, sans-serif' }}>Loading the hive…</p>
    </div>
  )
}

export default function App() {
  const { user } = useAuth()

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/homework" element={<ProtectedRoute><HomeworkPage /></ProtectedRoute>} />
        <Route path="/games" element={<ProtectedRoute><GamesPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
