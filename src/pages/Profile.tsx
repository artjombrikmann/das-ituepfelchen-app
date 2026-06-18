import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface ProfilePageProps {
  session: any
  onLogout: () => void
}

export default function ProfilePage({ session, onLogout }: ProfilePageProps) {
  const [profile, setProfile] = useState<any>(null)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (data) {
      setProfile(data)
      setName(data.name || '')
      setBio(data.bio || '')
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ name, bio, updated_at: new Date() })
      .eq('id', session.user.id)

    if (!error) {
      setProfile({ ...profile, name, bio })
    }
    setSaving(false)
  }

  if (loading) return <div style={{ padding: '20px' }}>Lädt...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f7', padding: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#705671', marginBottom: '32px' }}>Mein Profil</h1>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '10px', textTransform: 'uppercase' }}>Email</label>
            <div style={{ padding: '12px 14px', background: '#fbf9f7', borderRadius: '10px', fontSize: '14px', color: '#4c454b' }}>{session.user.email}</div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '10px', textTransform: 'uppercase' }}>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7' }} />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '10px', textTransform: 'uppercase' }}>Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7', minHeight: '100px' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '12px', background: '#705671', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', opacity: saving ? 0.8 : 1 }}>
              {saving ? 'Wird gespeichert...' : 'Profil speichern'}
            </button>
          </div>

          <button onClick={onLogout} style={{ width: '100%', padding: '12px', background: '#d4d2cf', color: '#1b1c1b', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
            Abmelden
          </button>
        </div>
      </div>
    </div>
  )
}