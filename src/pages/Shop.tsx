export default function Shop() {
  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f7', padding: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#705671', marginBottom: '32px' }}>Stoffe & Zubehör</h1>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#705671', marginBottom: '16px' }}>Das i-Tüpfelchen Online Shop</h2>
          <p style={{ fontSize: '14px', color: '#4c454b', lineHeight: '1.6', marginBottom: '32px' }}>
            Entdecke unsere große Auswahl an hochwertigen Stoffen und Zubehör für all deine Nähprojekte. Von exotischen Mustern bis zu klassischen Designs - hier findest du alles!
          </p>

          <a href="https://www.dasituepfelchen-online.de" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '14px 32px', background: '#705671', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = '#5f475f'} onMouseLeave={(e) => e.currentTarget.style.background = '#705671'}>
            Zum Online Shop →
          </a>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#705671', marginBottom: '16px' }}>Was dich erwartet:</h3>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
            <li style={{ padding: '12px 0', borderBottom: '1px solid #efedec', fontSize: '14px', color: '#1b1c1b' }}>✨ Premium Stoffe aus aller Welt</li>
            <li style={{ padding: '12px 0', borderBottom: '1px solid #efedec', fontSize: '14px', color: '#1b1c1b' }}>🧵 Nähzubehör & Accessoires</li>
            <li style={{ padding: '12px 0', borderBottom: '1px solid #efedec', fontSize: '14px', color: '#1b1c1b' }}>📦 Schnelle Lieferung</li>
            <li style={{ padding: '12px 0', fontSize: '14px', color: '#1b1c1b' }}>💚 Persönliche Beratung</li>
          </ul>
        </div>
      </div>
    </div>
  )
}