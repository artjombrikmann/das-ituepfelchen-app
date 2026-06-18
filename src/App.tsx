import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Signup from './pages/Signup'

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [page, setPage] = useState('login')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (loading) {
    return <div style={{ padding: '20px' }}>Lädt...</div>
  }

  if (!session) {
    return (
      <div>
        {page === 'login' ? (
          <Login onSwitchToSignup={() => setPage('signup')} />
        ) : (
          <Signup onSwitchToLogin={() => setPage('login')} />
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Das i-Tüpfelchen App</h1>
      <p>✅ Du bist angemeldet!</p>
      <p>Email: {session.user.email}</p>
      <button
        onClick={() => supabase.auth.signOut()}
        style={{
          padding: '10px 20px',
          background: '#705671',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Abmelden
      </button>
    </div>
  )
}