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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')
  const [activeTab, setActiveTab] = useState('projects')

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

  if (loading) return <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh', background: '#fbf9f7' }}>Lädt...</div>

  const initials = getInitials(name || 'User')
  const avatarColor = getAvatarColor(session.user.id)

  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f7', padding: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        {/* Profile Header Card */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(112, 86, 113, 0.08)', border: '1px solid rgba(212, 210, 207, 0.3)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '24px', alignItems: 'start' }}>
            {/* Avatar */}
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '40px', fontWeight: '700', flexShrink: 0 }}>
              {initials}
            </div>

            {/* Profile Info */}
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', fontSize: '24px', fontWeight: '700', border: '1px solid #d4d2cf', borderRadius: '10px', padding: '8px', marginBottom: '12px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box' }}
                />
              ) : (
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#705671', margin: '0 0 8px 0' }}>{name || 'Profil'}</h1>
              )}

              <p style={{ fontSize: '14px', color: '#4c454b', margin: '0 0 16px 0' }}>{session.user.email}</p>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#705671' }}>{followers}</div>
                  <div style={{ fontSize: '12px', color: '#4c454b', fontWeight: '700', textTransform: 'uppercase' }}>Followers</div>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#705671' }}>{following}</div>
                  <div style={{ fontSize: '12px', color: '#4c454b', fontWeight: '700', textTransform: 'uppercase' }}>Following</div>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#705671' }}>{projects.length}</div>
                  <div style={{ fontSize: '12px', color: '#4c454b', fontWeight: '700', textTransform: 'uppercase' }}>Projekte</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{ padding: '12px 24px', background: '#705671', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}
                  >
                    {saving ? 'Wird gespeichert...' : '✅ Speichern'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{ padding: '12px 24px', background: '#d4d2cf', color: '#1b1c1b', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    ❌ Abbrechen
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{ padding: '12px 24px', background: '#705671', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    ✏️ Bearbeiten
                  </button>
                  <button
                    onClick={onLogout}
                    style={{ padding: '12px 24px', background: '#d4d2cf', color: '#1b1c1b', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    🚪 Abmelden
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bio & Links */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(112, 86, 113, 0.08)', border: '1px solid rgba(212, 210, 207, 0.3)' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '8px', textTransform: 'uppercase' }}>Bio</label>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7', minHeight: '80px', resize: 'none' }}
              />
            ) : (
              <p style={{ fontSize: '14px', color: '#1b1c1b', lineHeight: '1.6', margin: '0' }}>{bio || 'Keine Bio'}</p>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '8px', textTransform: 'uppercase' }}>Instagram</label>
            {isEditing ? (
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username"
                style={{ width: '100%', padding: '12px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7' }}
              />
            ) : (
              <p style={{ fontSize: '14px', color: '#705671', margin: '0' }}>{instagram ? `@${instagram}` : 'Nicht angegeben'}</p>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '8px', textTransform: 'uppercase' }}>Website</label>
            {isEditing ? (
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                style={{ width: '100%', padding: '12px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7' }}
              />
            ) : (
              <p style={{ fontSize: '14px', color: '#705671', margin: '0' }}>{website ? website : 'Nicht angegeben'}</p>
            )}
          </div>

          {/* WhatsApp Checkbox */}
          <div style={{ padding: '16px', background: '#fbf9f7', borderRadius: '10px', border: '1px solid #d4d2cf' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', color: '#1b1c1b', fontWeight: '500' }}>
              <input
                type="checkbox"
                checked={whatsappOptedIn}
                onChange={(e) => setWhatsappOptedIn(e.target.checked)}
                disabled={!isEditing}
                style={{ width: '18px', height: '18px', cursor: isEditing ? 'pointer' : 'not-allowed' }}
              />
              <span>💚 WhatsApp Benachrichtigungen</span>
            </label>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #d4d2cf', marginBottom: '24px' }}>
          {['projects', 'favorites', 'posts'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '16px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '700',
                color: activeTab === tab ? '#705671' : '#4c454b',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #705671' : 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease'
              }}
            >
              {tab === 'projects' ? 'Meine Projekte' : tab === 'favorites' ? 'Favoriten' : 'Eigene Posts'}
            </button>
          ))}
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div style={{ marginBottom: '24px' }}>
            {/* Project List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {projects.map(proj => (
                <div key={proj.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #d4d2cf', boxShadow: '0 2px 8px rgba(112, 86, 113, 0.04)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1b1c1b', margin: '0 0 6px 0' }}>{proj.title}</h4>
                  <p style={{ fontSize: '12px', color: '#4c454b', margin: '0 0 12px 0' }}>{proj.description}</p>
                  {isEditing && (
                    <button
                      onClick={() => deleteProject(proj.id)}
                      style={{ background: 'none', border: 'none', color: '#ba1a1a', cursor: 'pointer', fontSize: '12px', fontWeight: '600', padding: '0' }}
                    >
                      🗑️ Löschen
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Project Form */}
            {isEditing && (
              <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '2px dashed #d4d2cf' }}>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="Projekttitel"
                  style={{ width: '100%', padding: '10px', border: '1px solid #d4d2cf', borderRadius: '8px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', marginBottom: '8px' }}
                />
                <input
                  type="text"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Kurze Beschreibung"
                  style={{ width: '100%', padding: '10px', border: '1px solid #d4d2cf', borderRadius: '8px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', marginBottom: '12px' }}
                />
                <button
                  onClick={addProject}
                  style={{ width: '100%', padding: '10px', background: '#705671', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}
                >
                  + Projekt hinzufügen
                </button>
              </div>
            )}
          </div>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(112, 86, 113, 0.08)', border: '1px solid rgba(212, 210, 207, 0.3)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#705671', margin: '0 0 16px 0' }}>🏆 Abzeichen</h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {badges.map(badge => (
                <div key={badge.id} style={{ padding: '8px 16px', background: '#fad8f8', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#705671' }}>
                  {badge.badge_type}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}