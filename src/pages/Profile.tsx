import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface ProfilePageProps {
  session: any
  onLogout: () => void
}

export default function ProfilePage({ session, onLogout }: ProfilePageProps) {
  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [instagram, setInstagram] = useState('')
  const [website, setWebsite] = useState('')
  const [whatsappOptedIn, setWhatsappOptedIn] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [badges, setBadges] = useState<any[]>([])
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (data) {
      setProfile(data)
      setName(data.name || '')
      setBio(data.bio || '')
      setInstagram(data.instagram_url || '')
      setWebsite(data.website_url || '')
      setWhatsappOptedIn(data.whatsapp_opted_in || false)
    }

    loadProjects()
    loadBadges()
    loadFollowerStats()
    setLoading(false)
  }

  const loadProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    setProjects(data || [])
  }

  const loadBadges = async () => {
    const { data } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', session.user.id)

    setBadges(data || [])
  }

  const loadFollowerStats = async () => {
    const { count: followerCount } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', session.user.id)

    const { count: followingCount } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', session.user.id)

    setFollowers(followerCount || 0)
    setFollowing(followingCount || 0)
  }

  const handleSave = async () => {
    setSaving(true)
    await supabase
      .from('profiles')
      .update({ name, bio, instagram_url: instagram, website_url: website, whatsapp_opted_in: whatsappOptedIn, updated_at: new Date() })
      .eq('id', session.user.id)

    setProfile({ ...profile, name, bio, instagram_url: instagram, website_url: website, whatsapp_opted_in: whatsappOptedIn })
    setIsEditing(false)
    setSaving(false)
  }

  const addProject = async () => {
    if (!newProjectTitle.trim()) return

    await supabase.from('projects').insert({
      user_id: session.user.id,
      title: newProjectTitle,
      description: newProjectDesc
    })

    setNewProjectTitle('')
    setNewProjectDesc('')
    loadProjects()
  }

  const deleteProject = async (projectId: string) => {
    await supabase.from('projects').delete().eq('id', projectId)
    loadProjects()
  }

  const getAvatarColor = (userId: string) => {
    const colors = ['#705671', '#895029', '#006d2f', '#8B4513', '#4B0082', '#FF6347']
    const hash = userId.charCodeAt(0)
    return colors[hash % colors.length]
  }

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Lädt...</div>

  const initials = getInitials(name || 'User')
  const avatarColor = getAvatarColor(session.user.id)

  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f7', padding: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Avatar & Header */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ width: '80px', height: '80px', background: avatarColor, borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '700', color: 'white' }}>
            {initials}
          </div>

          {isEditing ? (
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', fontSize: '24px', fontWeight: '700', border: '1px solid #d4d2cf', borderRadius: '10px', padding: '8px', marginBottom: '8px', textAlign: 'center', boxSizing: 'border-box' }} />
          ) : (
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#705671', margin: '0 0 8px 0' }}>{name || 'Profil'}</h1>
          )}

          <p style={{ fontSize: '14px', color: '#4c454b', margin: '0 0 16px 0' }}>{session.user.email}</p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', fontSize: '14px', color: '#1b1c1b', marginBottom: '16px' }}>
            <div><strong>{followers}</strong> Followers</div>
            <div><strong>{following}</strong> Following</div>
            <div><strong>{projects.length}</strong> Projekte</div>
          </div>
        </div>

        {/* Bio & Links */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '8px', textTransform: 'uppercase' }}>Bio</label>
            {isEditing ? (
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7', minHeight: '80px' }} />
            ) : (
              <p style={{ fontSize: '14px', color: '#1b1c1b', lineHeight: '1.6', margin: '0' }}>{bio || 'Keine Bio'}</p>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '8px', textTransform: 'uppercase' }}>Instagram</label>
            {isEditing ? (
              <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@username" style={{ width: '100%', padding: '12px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7' }} />
            ) : (
              <p style={{ fontSize: '14px', color: '#705671', margin: '0' }}>{instagram ? `@${instagram}` : 'Nicht angegeben'}</p>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '8px', textTransform: 'uppercase' }}>Website</label>
            {isEditing ? (
              <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '12px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7' }} />
            ) : (
              <p style={{ fontSize: '14px', color: '#705671', margin: '0' }}>{website ? website : 'Nicht angegeben'}</p>
            )}
          </div>

          <div style={{ padding: '16px', background: '#fbf9f7', borderRadius: '10px', border: '1px solid #d4d2cf' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', color: '#1b1c1b', fontWeight: '500' }}>
              <input type="checkbox" checked={whatsappOptedIn} onChange={(e) => setWhatsappOptedIn(e.target.checked)} disabled={!isEditing} style={{ width: '18px', height: '18px', cursor: isEditing ? 'pointer' : 'not-allowed' }} />
              <span>💚 WhatsApp Benachrichtigungen</span>
            </label>
          </div>
        </div>

        {/* Projekte */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#705671', marginBottom: '16px', margin: '0 0 16px 0' }}>📝 Meine Projekte</h2>

          {projects.map(proj => (
            <div key={proj.id} style={{ padding: '12px', background: '#fbf9f7', borderRadius: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1b1c1b', margin: '0 0 4px 0' }}>{proj.title}</p>
                <p style={{ fontSize: '12px', color: '#4c454b', margin: '0' }}>{proj.description}</p>
              </div>
              {isEditing && (
                <button onClick={() => deleteProject(proj.id)} style={{ background: 'none', border: 'none', color: '#c53030', cursor: 'pointer', fontSize: '16px', padding: '0' }}>🗑️</button>
              )}
            </div>
          ))}

          {isEditing && (
            <div style={{ marginTop: '16px', padding: '12px', border: '2px dashed #d4d2cf', borderRadius: '8px' }}>
              <input type="text" value={newProjectTitle} onChange={(e) => setNewProjectTitle(e.target.value)} placeholder="Projekttitel" style={{ width: '100%', padding: '8px', border: '1px solid #d4d2cf', borderRadius: '6px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', marginBottom: '8px' }} />
              <input type="text" value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)} placeholder="Kurze Beschreibung" style={{ width: '100%', padding: '8px', border: '1px solid #d4d2cf', borderRadius: '6px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', marginBottom: '8px' }} />
              <button onClick={addProject} style={{ width: '100%', padding: '8px', background: '#705671', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>+ Projekt hinzufügen</button>
            </div>
          )}
        </div>

        {/* Abzeichen */}
        {badges.length > 0 && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#705671', margin: '0 0 16px 0' }}>🏆 Abzeichen</h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {badges.map(badge => (
                <div key={badge.id} style={{ padding: '8px 16px', background: '#fbf9f7', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#705671' }}>
                  {badge.badge_type}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {isEditing ? (
            <>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '12px', background: '#705671', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', opacity: saving ? 0.8 : 1 }}>
                {saving ? 'Wird gespeichert...' : '✅ Speichern'}
              </button>
              <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '12px', background: '#d4d2cf', color: '#1b1c1b', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
                ❌ Abbrechen
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} style={{ flex: 1, padding: '12px', background: '#705671', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
                ✏️ Bearbeiten
              </button>
              <button onClick={onLogout} style={{ flex: 1, padding: '12px', background: '#d4d2cf', color: '#1b1c1b', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
                🚪 Abmelden
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}