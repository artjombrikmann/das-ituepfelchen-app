import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface FeedProps {
  session: any
}

export default function Feed({ session }: FeedProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (postsData) {
      for (let post of postsData) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', post.user_id)
          .single()
        
        const { data: likes } = await supabase
          .from('likes')
          .select('*')
          .eq('post_id', post.id)
        
        const { data: comments } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', post.id)
          .order('created_at', { ascending: false })
        
        post.profile = profile
        post.likes = likes || []
        post.comments = comments || []
      }
      setPosts(postsData)
    }
    setLoading(false)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`
    const { error } = await supabase.storage
      .from('post-images')
      .upload(fileName, file)

    if (error) return null

    const { data } = supabase.storage
      .from('post-images')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  const createPost = async () => {
    if (!content.trim() && !image) return
    setPosting(true)

    let imageUrl = null
    if (image) {
      setUploadingImage(true)
      imageUrl = await uploadImage(image)
      setUploadingImage(false)
    }

    await supabase.from('posts').insert({
      user_id: session.user.id,
      content: content.trim(),
      image_url: imageUrl,
      link_url: linkUrl || null
    })

    setContent('')
    setLinkUrl('')
    setImage(null)
    setImagePreview('')
    loadPosts()
    setPosting(false)
  }

  const toggleLike = async (postId: string, hasLiked: boolean) => {
    if (hasLiked) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', session.user.id)
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: session.user.id })
    }
    loadPosts()
  }

  const addComment = async (postId: string) => {
    if (!commentText.trim()) return

    await supabase.from('comments').insert({
      post_id: postId,
      user_id: session.user.id,
      content: commentText.trim()
    })

    setCommentText('')
    loadPosts()
  }

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  }

  const getAvatarColor = (userId: string) => {
    const colors = ['#705671', '#895029', '#006d2f', '#8B4513', '#4B0082', '#FF6347']
    const hash = userId.charCodeAt(0)
    return colors[hash % colors.length]
  }

  if (loading) return <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh', background: '#fbf9f7' }}>Lädt...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f7', padding: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        {/* Main Feed */}
        <div>
          {/* Logo Section */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧵</div>
            <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#705671', margin: '0', letterSpacing: '-0.02em' }}>Das i-Tüpfelchen</h1>
          </div>

          {/* Creation Card */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '12px', boxShadow: '0 4px 20px rgba(112, 86, 113, 0.08)', marginBottom: '12px', border: '1px solid rgba(212, 210, 207, 0.3)' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: getAvatarColor(session.user.id), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', flexShrink: 0 }}>
                {getInitials(session.user.user_metadata?.name || 'User')}
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Teile dein Projekt..."
                style={{ flex: 1, padding: '12px', border: 'none', background: '#fbf9f7', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', minHeight: '80px', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Link Input */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '6px', textTransform: 'uppercase' }}>🔗 Link (Optional)</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                style={{ width: '100%', padding: '10px', border: '1px solid #d4d2cf', borderRadius: '8px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box' }}
              />
            </div>

            {/* Image Input */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1b1c1b', marginBottom: '6px', textTransform: 'uppercase' }}>📷 Foto (Optional)</label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                style={{ width: '100%', padding: '10px', border: '1px solid #d4d2cf', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div style={{ marginBottom: '12px', position: 'relative' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', borderRadius: '10px', maxHeight: '300px', objectFit: 'cover' }} />
                <button
                  onClick={() => { setImage(null); setImagePreview('') }}
                  style={{ position: 'absolute', top: '8px', right: '8px', background: '#ba1a1a', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={createPost}
                disabled={posting || uploadingImage || (!content.trim() && !image)}
                style={{ flex: 1, padding: '12px', background: '#705671', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', opacity: posting || uploadingImage || (!content.trim() && !image) ? 0.6 : 1 }}
              >
                {posting ? 'Wird gepostet...' : uploadingImage ? 'Bild wird hochgeladen...' : 'Posten'}
              </button>
            </div>
          </div>

          {/* WhatsApp Chip */}
          <div style={{ background: '#00a94d', color: 'white', borderRadius: '12px', padding: '12px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 4px 12px rgba(0, 169, 77, 0.15)', cursor: 'pointer' }} onClick={() => window.open('https://wa.me/4915128864342?text=Hallo%20Katrin%2C%20ich%20habe%20eine%20Frage%20zu%20den%20Stoffen%20und%20Kursen!', '_blank')}>
            <div style={{ fontSize: '20px' }}>💬</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 2px 0' }}>Direkter Draht zu Katrin</h3>
              <p style={{ fontSize: '12px', margin: '0', opacity: 0.9 }}>Frage nach Stoffen oder teile deine Fortschritte!</p>
            </div>
            <div style={{ fontSize: '16px' }}>→</div>
          </div>

          {/* Posts */}
          {posts.map((post: any) => {
            const userLiked = post.likes.some((l: any) => l.user_id === session.user.id)
            const likeCount = post.likes.length
            const commentCount = post.comments?.length || 0
            const avatarColor = getAvatarColor(post.user_id)
            const initials = getInitials(post.profile?.name)

            return (
              <div key={post.id} style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(112, 86, 113, 0.08)', marginBottom: '16px', overflow: 'hidden', border: '1px solid rgba(212, 210, 207, 0.3)' }}>
                {/* Post Header */}
                <div style={{ padding: '12px', display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid #efedec' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#705671', margin: '0' }}>{post.profile?.name || 'Anonym'}</p>
                    <p style={{ fontSize: '12px', color: '#4c454b', margin: '4px 0 0 0' }}>{new Date(post.created_at).toLocaleDateString('de-DE')}</p>
                  </div>
                </div>

                {/* Post Content */}
                <div style={{ padding: '12px' }}>
                  <p style={{ fontSize: '14px', color: '#1b1c1b', lineHeight: '1.6', marginBottom: '12px' }}>{post.content}</p>

                  {post.image_url && (
                    <img src={post.image_url} alt="Post" style={{ width: '100%', borderRadius: '10px', marginBottom: '12px', maxHeight: '500px', objectFit: 'cover' }} />
                  )}

                  {post.link_url && (
                    <a href={post.link_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginBottom: '12px', padding: '8px 12px', background: '#fbf9f7', color: '#705671', textDecoration: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>
                      🔗 Link öffnen
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div style={{ padding: '12px', display: 'flex', gap: '16px', borderTop: '1px solid #efedec' }}>
                  <button
                    onClick={() => toggleLike(post.id, userLiked)}
                    style={{ background: 'none', border: 'none', color: userLiked ? '#705671' : '#4c454b', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: '0', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {userLiked ? '❤️' : '🤍'} {likeCount}
                  </button>
                  <button
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    style={{ background: 'none', border: 'none', color: '#4c454b', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: '0', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    💬 {commentCount}
                  </button>
                </div>

                {/* Comments Section */}
                {expandedPost === post.id && (
                  <div style={{ padding: '12px', borderTop: '1px solid #efedec', background: '#fbf9f7' }}>
                    <div style={{ marginBottom: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                      {post.comments?.map((comment: any) => (
                        <div key={comment.id} style={{ marginBottom: '8px', padding: '8px', background: 'white', borderRadius: '6px', fontSize: '12px' }}>
                          <p style={{ fontSize: '12px', fontWeight: '600', color: '#705671', margin: '0 0 2px 0' }}>User</p>
                          <p style={{ fontSize: '12px', color: '#1b1c1b', margin: '0', lineHeight: '1.4' }}>{comment.content}</p>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Kommentar..."
                        style={{ flex: 1, padding: '8px 12px', border: '1px solid #d4d2cf', borderRadius: '8px', fontSize: '12px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box' }}
                      />
                      <button
                        onClick={() => addComment(post.id)}
                        disabled={!commentText.trim()}
                        style={{ padding: '8px 12px', background: '#705671', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', opacity: !commentText.trim() ? 0.6 : 1, fontSize: '12px' }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {posts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#4c454b' }}>
              <p style={{ fontSize: '16px' }}>Noch keine Posts. Sei der erste! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}