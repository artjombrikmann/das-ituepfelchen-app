import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Feed from './pages/Feed'
import Shop from './pages/Shop'
import Courses from './pages/Courses'
import ProfilePage from './pages/Profile'

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
    setPage('feed')
  }

  if (loading) return <div style={{ padding: '20px', background: '#fbf9f7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans' }}>Lädt...</div>

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

  const isActivePage = (pageName: string) => page === pageName

  const buttonStyle = (isActive: boolean) => ({
    background: isActive ? '#705671' : 'transparent',
    color: isActive ? 'white' : '#4c454b',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    fontFamily: 'Plus Jakarta Sans'
  })

  return (
    <div style={{ background: '#fbf9f7', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans' }}>
      {/* Top Navigation */}
      <header style={{ 
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        background: 'white',
        borderBottom: '1px solid #efedec',
        padding: '12px 20px',
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(112, 86, 113, 0.04)'
      }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setPage('feed')}>
            <div style={{ fontSize: '24px' }}>🧵</div>
            <h1 style={{ fontSize: '16px', fontWeight: '700', color: '#705671', margin: '0' }}>Das i-Tüpfelchen</h1>
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPage('feed')} style={buttonStyle(isActivePage('feed'))}>
              Feed
            </button>
            <button onClick={() => setPage('shop')} style={buttonStyle(isActivePage('shop'))}>
              Shop
            </button>
            <button onClick={() => setPage('courses')} style={buttonStyle(isActivePage('courses'))}>
              Kurse
            </button>
            <button onClick={() => setPage('profile')} style={buttonStyle(isActivePage('profile'))}>
              Profil
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main>
        {page === 'feed' && <Feed session={session} />}
        {page === 'shop' && <Shop />}
        {page === 'courses' && <Courses session={session} />}
        {page === 'profile' && <ProfilePage session={session} onLogout={handleLogout} />}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        background: 'white',
        borderTop: '1px solid #efedec',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '64px',
        zIndex: 50,
        boxShadow: '0 -2px 8px rgba(112, 86, 113, 0.04)'
      }}>
        <button
          onClick={() => setPage('feed')}
          style={{
            background: isActivePage('feed') ? '#a689a6' : 'transparent',
            color: isActivePage('feed') ? '#705671' : '#4c454b',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flex: 1,
            height: '100%',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            fontFamily: 'Plus Jakarta Sans'
          }}
        >
          <span style={{ fontSize: '20px', marginBottom: '4px' }}>🏠</span>
          Feed
        </button>

        <button
          onClick={() => setPage('shop')}
          style={{
            background: isActivePage('shop') ? '#a689a6' : 'transparent',
            color: isActivePage('shop') ? '#705671' : '#4c454b',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flex: 1,
            height: '100%',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            fontFamily: 'Plus Jakarta Sans'
          }}
        >
          <span style={{ fontSize: '20px', marginBottom: '4px' }}>🛍️</span>
          Shop
        </button>

        <button
          onClick={() => setPage('courses')}
          style={{
            background: isActivePage('courses') ? '#a689a6' : 'transparent',
            color: isActivePage('courses') ? '#705671' : '#4c454b',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flex: 1,
            height: '100%',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            fontFamily: 'Plus Jakarta Sans'
          }}
        >
          <span style={{ fontSize: '20px', marginBottom: '4px' }}>🎓</span>
          Kurse
        </button>

        <button
          onClick={() => setPage('profile')}
          style={{
            background: isActivePage('profile') ? '#a689a6' : 'transparent',
            color: isActivePage('profile') ? '#705671' : '#4c454b',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flex: 1,
            height: '100%',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            fontFamily: 'Plus Jakarta Sans'
          }}
        >
          <span style={{ fontSize: '20px', marginBottom: '4px' }}>👤</span>
          Profil
        </button>
      </nav>
    </div>
  )
}