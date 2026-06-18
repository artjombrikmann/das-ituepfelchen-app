import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface CoursesProps {
  session: any
}

export default function Courses({ session }: CoursesProps) {
  const [bookings, setBookings] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [bookingId, setBookingId] = useState<string | null>(null)

  useEffect(() => {
    loadBookings()
    setLoading(false)
  }, [])

  const loadBookings = async () => {
    const { data } = await supabase
      .from('course_bookings')
      .select('course_id')
      .eq('user_id', session.user.id)

    setBookings(data?.map(b => b.course_id) || [])
  }

  const bookCourse = async (courseId: string) => {
    setBookingId(courseId)

    await supabase.from('course_bookings').insert({
      course_id: courseId,
      user_id: session.user.id
    })

    loadBookings()
    setBookingId(null)
  }

  const cancelBooking = async (courseId: string) => {
    await supabase
      .from('course_bookings')
      .delete()
      .eq('course_id', courseId)
      .eq('user_id', session.user.id)

    loadBookings()
  }

  const sampleCourses = [
    {
      id: '1',
      title: 'Deine erste Tasche: Canvas Tote',
      category: 'anfänger',
      date: '2024-10-12',
      time: '10:00',
      instructor: 'Katrin',
      max_participants: 10,
      booking_count: 8,
      price: 59.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC95Ga9RCSxp4ih90wdu4UNkLOxdz3jKfdqx1RWygx7nYgXwFBNPkjXSyI95Xmwn_vS_IkSRRePEYOl0HZH3OTQxcVAeENJ-bfnQHdicr_IHixNP2sW4Jr1OGCJ2jjX5-OWyhfKeNhHROU1-IMtHxl7AtceQJHdDg7VvbmSKf4UQoe_tbKAqGO1wRA9HpPJ8E7B_omJ_t80xyQD4udmOuvMMgcAlGbfiqQWSfSHoCbve0OPNSdNpsHowhSGc2AEMJTAOO4LJvIKWlw'
    },
    {
      id: '2',
      title: 'Jersey-Masterclass: Basic Shirt',
      category: 'fortgeschrittene',
      date: '2024-10-18',
      time: '17:00',
      instructor: 'Katrin',
      max_participants: 8,
      booking_count: 4,
      price: 75.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAofUeeF681EqZTp-snC5D7C50Ps7WGVe_PO5wdWRQP4OeqO1-mg7RYwasHj9hSrSSchdHHSOAxwd-Z-N6ZLPou-CiH_4EIym4HiNBb7ymjM7gyLnlH-QwW4TFR6dFqJ-psAhYednP9C_uFW28c497hqUMKQ7y6Hw62UOwgJc1CICw2dK5NEosPMGklj4EaVln5cpmgilmtZ_7UocXpF1yXA_YiL0zmb8SFdPig6TYfaxifU8W0ErVIBVFNAx55G_-g_JIB04lx1dY'
    },
    {
      id: '3',
      title: 'Kreativ-Workshop: Kuschelmonster',
      category: 'kinder',
      date: '2024-10-23',
      time: '15:00',
      instructor: 'Katrin',
      max_participants: 6,
      booking_count: 5,
      price: 35.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMhL_5CgXQVBpg_46lhVEDYKx9npI8S_nAwgpy7ijfJFMiTDylxufpZYpHh03RQK4yBkyblkxEAFzX2K0_D0drF-J18LitX1dP8zcB91vUwnVffDF43HhTNlF9Rv_hTyfs9yqaiE7fKjxq9F9qb57l8AnFsoncbyliPZTzDPq9VYbzbnhRhaVd4x9GnhuW0AsD_6WAFGJK2rus5VV3gb9yoW2gQ_c0h8wRFfBraLfldJM4a-dMwRbfY3ZVJxMqT-M6fyw8L-QN_B0'
    }
  ]

  const filteredCourses = selectedCategory === 'all'
    ? sampleCourses
    : sampleCourses.filter(c => c.category === selectedCategory)

  if (loading) return <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh', background: '#fbf9f7' }}>Lädt...</div>

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      'all': 'ALLE',
      'anfänger': 'ANFÄNGER',
      'fortgeschrittene': 'FORTGESCHRITTENE',
      'kinder': 'KINDER (8-12 J.)'
    }
    return labels[cat] || cat
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f7', padding: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#1b1c1b', margin: '0 0 12px 0' }}>Nähkurse</h2>
          <p style={{ fontSize: '16px', color: '#4c454b', margin: '0', lineHeight: '1.6', maxWidth: '600px' }}>
            Entfalte deine Kreativität in gemütlicher Atmosphäre. Vom ersten Stich bis zum fertigen Kleidungsstück – lerne Nähen bei Katrin.
          </p>
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
          {['all', 'anfänger', 'fortgeschrittene', 'kinder'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                background: selectedCategory === cat ? '#705671' : '#efedec',
                color: selectedCategory === cat ? 'white' : '#4c454b',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease'
              }}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {filteredCourses.map(course => {
            const isBooked = bookings.includes(course.id)
            const spotsLeft = course.max_participants - (course.booking_count || 0)
            const courseDate = new Date(course.date)

            return (
              <div key={course.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(112, 86, 113, 0.08)', border: '1px solid rgba(212, 210, 207, 0.3)' }}>
                {/* Course Image */}
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden', background: '#efedec' }}>
                  <img
                    src={course.image}
                    alt={course.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#feb383', color: '#79431d', padding: '6px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>
                    {spotsLeft > 0 ? `Noch ${spotsLeft} Plätze` : 'Ausgebucht'}
                  </div>
                </div>

                {/* Course Info */}
                <div style={{ padding: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#705671', textTransform: 'uppercase' }}>
                    {getCategoryLabel(course.category)}
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1b1c1b', margin: '8px 0', lineHeight: '1.4' }}>{course.title}</h3>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '14px', color: '#4c454b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>📅</span>
                      <span>{courseDate.toLocaleDateString('de-DE')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🕐</span>
                      <span>{course.time} Uhr</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#895029', marginBottom: '16px' }}>
                    {course.price.toFixed(2)} €
                  </div>

                  {/* Booking Button */}
                  {isBooked ? (
                    <button
                      onClick={() => cancelBooking(course.id)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#d4d2cf',
                        color: '#1b1c1b',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      ❌ Buchung stornieren
                    </button>
                  ) : (
                    <button
                      onClick={() => bookCourse(course.id)}
                      disabled={bookingId === course.id || spotsLeft <= 0}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: spotsLeft <= 0 ? '#999' : '#705671',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: spotsLeft <= 0 ? 'not-allowed' : 'pointer',
                        opacity: bookingId === course.id ? 0.7 : 1,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {bookingId === course.id ? 'Wird gebucht...' : spotsLeft <= 0 ? 'Ausgebucht' : '📝 Jetzt buchen'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Privatstunden Section */}
        <div style={{ background: '#fad8f8', borderRadius: '16px', padding: '24px', border: '1px solid #a689a6' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '600', color: '#28142b', margin: '0 0 12px 0' }}>Ganz persönlich: Privatstunden</h3>
          <p style={{ fontSize: '14px', color: '#573f58', margin: '0 0 16px 0', lineHeight: '1.6' }}>
            Du hast ein spezifisches Projekt im Kopf oder möchtest in deinem eigenen Tempo lernen? Katrin nimmt sich exklusiv Zeit für dich.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              style={{
                padding: '10px 20px',
                background: '#705671',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '12px',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              Termin anfragen
            </button>
            <button
              onClick={() => window.open('https://wa.me/yournumber', '_blank')}
              style={{
                padding: '10px 20px',
                background: '#25D366',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '12px',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              💬 Via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}