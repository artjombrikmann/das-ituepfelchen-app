import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface LoginProps {
  onSwitchToSignup: () => void
}

export default function Login({ onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Bitte fülle alle Felder aus')
      return
    }

    setLoading(true)
    setError('')

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    if (signInError) {
      setError(signInError.message === 'Invalid login credentials' ? 'E-Mail oder Passwort falsch' : signInError.message)
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f7', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        {/* Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧵</div>
          <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#705671', margin: '0 0 8px 0' }}>Das i-Tüpfelchen</h1>
          <p style={{ fontSize: '14px', color: '#4c454b', margin: '0' }}>Community & Stoffe</p>
        </div>

        {/* Login Card */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(112, 86, 113, 0.08)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#1b1c1b', marginBottom: '24px', margin: '0 0 24px 0', textAlign: 'center' }}>Willkommen zurück!</h2>

          {/* Error Message */}
          {error && (
            <div style={{ background: '#ffdad6', border: '1px solid #ba1a1a', color: '#ba1a1a', padding: '12px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px', fontWeight: '500' }}>
              {error}
            </div>
          )}

          {/* Email Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '8px', textTransform: 'uppercase' }}>E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              disabled={loading}
              style={{ width: '100%', padding: '12px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7', opacity: loading ? 0.6 : 1 }}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '8px', textTransform: 'uppercase' }}>Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              style={{ width: '100%', padding: '12px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7', opacity: loading ? 0.6 : 1 }}
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#705671', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.3s ease' }}
          >
            {loading ? 'Wird angemeldet...' : 'Anmelden'}
          </button>
        </div>

        {/* Signup Link */}
        <div style={{ textAlign: 'center', paddingTop: '24px', borderTop: '1px solid #efedec' }}>
          <p style={{ fontSize: '14px', color: '#4c454b', margin: '0 0 8px 0' }}>Noch nicht registriert?</p>
          <button
            onClick={onSwitchToSignup}
            style={{ background: 'none', border: 'none', color: '#705671', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Jetzt registrieren
          </button>
        </div>
      </div>
    </div>
  )
}