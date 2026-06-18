import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface SignupProps {
  onSwitchToLogin: () => void
}

export default function Signup({ onSwitchToLogin }: SignupProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async () => {
    setError('')

    // Validierung
    if (!name.trim()) {
      setError('Bitte gib deinen Namen ein')
      return
    }
    if (!email.trim()) {
      setError('Bitte gib deine E-Mail ein')
      return
    }
    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein')
      return
    }

    setLoading(true)

    // Signup mit Supabase
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          name: name.trim()
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message === 'User already registered' ? 'Diese E-Mail ist bereits registriert' : signUpError.message)
      setLoading(false)
      return
    }

    // Profile in Supabase erstellen (wird auch durch Trigger gemacht, aber sichergehen)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        name: name.trim(),
        created_at: new Date(),
        updated_at: new Date()
      })
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#fbf9f7', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#705671', marginBottom: '12px' }}>Willkommen!</h1>
          <p style={{ fontSize: '16px', color: '#4c454b', marginBottom: '32px', lineHeight: '1.6' }}>
            Du bist jetzt Teil der Das i-Tüpfelchen Community! 🧵
          </p>
          
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(112, 86, 113, 0.08)' }}>
            <p style={{ fontSize: '14px', color: '#1b1c1b', lineHeight: '1.6', margin: '0' }}>
              Überprüfe deine E-Mail ({email}) für Bestätigungslink (falls nötig). Ansonsten kannst du dich jetzt direkt anmelden!
            </p>
          </div>

          <button
            onClick={onSwitchToLogin}
            style={{ width: '100%', padding: '12px', background: '#705671', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
          >
            Zur Anmeldung
          </button>
        </div>
      </div>
    )
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

        {/* Signup Card */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(112, 86, 113, 0.08)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#1b1c1b', margin: '0 0 24px 0', textAlign: 'center' }}>Tritt bei!</h2>

          {/* Error Message */}
          {error && (
            <div style={{ background: '#ffdad6', border: '1px solid #ba1a1a', color: '#ba1a1a', padding: '12px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px', fontWeight: '500' }}>
              {error}
            </div>
          )}

          {/* Name Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '8px', textTransform: 'uppercase' }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
              disabled={loading}
              style={{ width: '100%', padding: '12px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7', opacity: loading ? 0.6 : 1 }}
            />
          </div>

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
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '8px', textTransform: 'uppercase' }}>Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mindestens 6 Zeichen"
              disabled={loading}
              style={{ width: '100%', padding: '12px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7', opacity: loading ? 0.6 : 1 }}
            />
          </div>

          {/* Confirm Password Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '8px', textTransform: 'uppercase' }}>Passwort bestätigen</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Passwort wiederholen"
              disabled={loading}
              style={{ width: '100%', padding: '12px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7', opacity: loading ? 0.6 : 1 }}
            />
          </div>

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#705671', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.3s ease' }}
          >
            {loading ? 'Wird registriert...' : 'Registrieren'}
          </button>
        </div>

        {/* Login Link */}
        <div style={{ textAlign: 'center', paddingTop: '24px', borderTop: '1px solid #efedec' }}>
          <p style={{ fontSize: '14px', color: '#4c454b', margin: '0 0 8px 0' }}>Schon registriert?</p>
          <button
            onClick={onSwitchToLogin}
            style={{ background: 'none', border: 'none', color: '#705671', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Hier anmelden
          </button>
        </div>
      </div>
    </div>
  )
}