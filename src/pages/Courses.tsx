import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface CoursesProps {
  session: any
}

export default function Courses({ session }: CoursesProps) {
  const [courses, setCourses] = useState<any[]>([])
  const [bookings, setBookings] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingId, setBookingId] = useState<string | null>(null)

  useEffect(() => {
    loadCourses()
    loadBookings()
  }, [])

  const loadCourses = async () => {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .order('date', { ascending: true })

    setCourses(data || [])
    setLoading(false)
  }

  const loadBookings = async () => {
    const { data } = await supabase
      .from('course_bookings')
      .select('course_id')
      .eq('user_id', session.user.id)

    setBookings(data?.map(b => b.course_id) || [])
  }

  const bookCourse = async (courseId: string) => {
    setBookingId(courseId)

    const { error } = await supabase.from('course_bookings').insert({
      course_id: courseId,
      user_id: session.user.id
    })

    if (!error) {
      loadBookings()
      loadCourses()
    }
    setBookingId(null)
  }

  const cancelBooking = async (courseId: string) => {
    await supabase
      .from('course_bookings')
      .delete()
      .eq('course_id', courseId)
      .eq('user_id', session.user.id)

    loadBookings()
    loadCourses()
  }

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Lädt...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f7', padding: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#705671', marginBottom: '32px' }}>Nähkurse</h1>

        {courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#4c454b' }}>
            <p>Noch keine Kurse verfügbar.</p>
          </div>
        ) : (
          courses.map(course => {
            const isBooked = bookings.includes(course.id)
            const courseDate = new Date(course.date)
            const spotsLeft = course.max_participants - (course.booking_count || 0)

            return (
              <div key={course.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#705671', margin: '0 0 8px 0' }}>{course.title}</h2>
                <p style={{ fontSize: '14px', color: '#4c454b', margin: '0 0 16px 0' }}>{course.description}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '14px', color: '#1b1c1b' }}>
                  <div>📅 {courseDate.toLocaleDateString('de-DE')}</div>
                  <div>🕐 {course.time}</div>
                  <div>👤 {course.instructor}</div>
                  <div>💺 {spotsLeft} Plätze frei</div>
                </div>

                {course.price > 0 && (
                  <div style={{ marginBottom: '16px', padding: '12px', background: '#fbf9f7', borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: '#705671' }}>
                    💶 {course.price.toFixed(2)} €
                  </div>
                )}

                {isBooked ? (
                  <button
                    onClick={() => cancelBooking(course.id)}
                    style={{ width: '100%', padding: '12px', background: '#d4d2cf', color: '#1b1c1b', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    ❌ Buchung stornieren
                  </button>
                ) : (
                  <button
                    onClick={() => bookCourse(course.id)}
                    disabled={bookingId === course.id || spotsLeft <= 0}
                    style={{ width: '100%', padding: '12px', background: spotsLeft <= 0 ? '#999' : '#705671', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: spotsLeft <= 0 ? 'not-allowed' : 'pointer', opacity: bookingId === course.id ? 0.7 : 1 }}
                  >
                    {bookingId === course.id ? 'Wird gebucht...' : spotsLeft <= 0 ? 'Ausgebucht' : '📝 Jetzt buchen'}
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}