import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProfilePage from './pages/Profile'
import Feed from './pages/Feed'

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [page, setPage] = useState('feed')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setPage('login')
  }

  if (loading) return <div style={{ padding: '20px' }}>Lädt...</div>

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
    <div>
      {/* Navigation */}
      <nav style={{ background: 'white', borderBottom: '1px solid #efedec', padding: '16px 20px', position: 'sticky', top: '0', zIndex: 100, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '16px', fontWeight: '700', color: '#705671', margin: '0', cursor: 'pointer' }} onClick={() => setPage('feed')}>Das i-Tüpfelchen</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setPage('feed')} style={{ background: page === 'feed' ? '#705671' : 'transparent', color: page === 'feed' ? 'white' : '#4c454b', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Feed</button>
            <button onClick={() => setPage('profile')} style={{ background: page === 'profile' ? '#705671' : 'transparent', color: page === 'profile' ? 'white' : '#4c454b', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Profil</button>
          </div>
        </div>
      </nav>

      {/* Content */}
      {page === 'feed' && <Feed session={session} />}
      {page === 'profile' && <ProfilePage session={session} onLogout={handleLogout} />}
    </div>
  )
}