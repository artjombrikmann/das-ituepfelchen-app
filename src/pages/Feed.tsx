import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface FeedProps {
  session: any
}

export default function Feed({ session }: FeedProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')

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

  const createPost = async () => {
    if (!content.trim()) return
    setPosting(true)

    await supabase.from('posts').insert({
      user_id: session.user.id,
      content: content.trim()
    })

    setContent('')
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

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Lädt...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f7', padding: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#705671', marginBottom: '32px' }}>Community Feed</h1>

        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Was möchtest du teilen?" style={{ width: '100%', padding: '12px', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box', background: '#fbf9f7', minHeight: '80px', marginBottom: '16px' }} />
          <button onClick={createPost} disabled={posting || !content.trim()} style={{ width: '100%', padding: '12px', background: '#705671', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', opacity: posting || !content.trim() ? 0.6 : 1 }}>
            {posting ? 'Wird gepostet...' : 'Posten'}
          </button>
        </div>

        {posts.map((post: any) => {
          const userLiked = post.likes.some((l: any) => l.user_id === session.user.id)
          const likeCount = post.likes.length
          const commentCount = post.comments?.length || 0

          return (
            <div key={post.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #efedec' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#705671', margin: '0' }}>{post.profile?.name || 'Anonym'}</p>
                <p style={{ fontSize: '12px', color: '#4c454b', margin: '4px 0 0 0' }}>{new Date(post.created_at).toLocaleDateString('de-DE')}</p>
              </div>

              <p style={{ fontSize: '14px', color: '#1b1c1b', lineHeight: '1.6', marginBottom: '16px' }}>{post.content}</p>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #efedec' }}>
                <button onClick={() => toggleLike(post.id, userLiked)} style={{ background: 'none', border: 'none', color: userLiked ? '#705671' : '#4c454b', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: '0' }}>
                  {userLiked ? '❤️' : '🤍'} {likeCount}
                </button>
                <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)} style={{ background: 'none', border: 'none', color: '#4c454b', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: '0' }}>
                  💬 {commentCount}
                </button>
              </div>

              {expandedPost === post.id && (
                <div style={{ borderTop: '1px solid #efedec', paddingTop: '16px' }}>
                  <div style={{ marginBottom: '16px', maxHeight: '200px', overflowY: 'auto' }}>
                    {post.comments?.map((comment: any) => (
                      <div key={comment.id} style={{ marginBottom: '12px', padding: '12px', background: '#fbf9f7', borderRadius: '8px' }}>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#705671', margin: '0 0 4px 0' }}>User</p>
                        <p style={{ fontSize: '14px', color: '#1b1c1b', margin: '0', lineHeight: '1.4' }}>{comment.content}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Dein Kommentar..." style={{ flex: 1, padding: '8px 12px', border: '1px solid #d4d2cf', borderRadius: '8px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box' }} />
                    <button onClick={() => addComment(post.id)} disabled={!commentText.trim()} style={{ padding: '8px 16px', background: '#705671', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', opacity: !commentText.trim() ? 0.6 : 1 }}>
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {posts.length === 0 && <div style={{ textAlign: 'center', padding: '40px 20px', color: '#4c454b' }}><p>Noch keine Posts. Sei der erste!</p></div>}
      </div>
    </div>
  )
}