import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface SignupProps {
  onSwitchToLogin: () => void
}

export default function Signup({ onSwitchToLogin }: SignupProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })

    if (err) {
      setError(err.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#fbf9f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#705671', marginBottom: '16px' }}>Willkommen! 🎉</h1>
          <p style={{ fontSize: '14px', color: '#4c454b', marginBottom: '32px' }}>Überprüfe deine Email um dein Account zu bestätigen.</p>
          <button type="button" onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: '#705671', fontWeight: '600', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline', padding: '0' }}>Zurück zum Login</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'white', borderRadius: '16px', padding: '48px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #efedec' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#705671', margin: '0 0 8px 0' }}>Registrieren</h1>
        <p style={{ fontSize: '14px', color: '#4c454b', margin: '0 0 40px 0' }}>Tritt der Community bei</p>

        {error && <div style={{ background: '#fee2e2', color: '#c53030', padding: '14px 16px', borderRadius: '10px', marginBottom: '24px', fontSize: '14px', border: '1px solid #fca5a5' }}>{error}</div>}

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dein Name" required style={{ width: '100%', padding: '12px 14px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="deine@email.com" required style={{ width: '100%', padding: '12px 14px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7' }} />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Passwort</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%', padding: '12px 14px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7' }} />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#705671', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', fontFamily: 'Plus Jakarta Sans', cursor: 'pointer', opacity: loading ? 0.8 : 1 }}>
            {loading ? 'Wird registriert...' : 'Registrieren'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#4c454b', marginTop: '32px' }}>
          Bereits registriert?{' '}
          <button type="button" onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: '#705671', fontWeight: '600', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline', padding: '0' }}>
            Hier anmelden
          </button>
        </p>
      </div>
    </div>
  )
}