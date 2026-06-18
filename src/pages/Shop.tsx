import { useState } from 'react'

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('alle')

  const products = [
    {
      id: 1,
      name: 'Bio-Baumwolle Natur',
      category: 'bio',
      description: '100% Bio • 150cm breit',
      price: '10,99€ /m',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRd7jQmvAnO7wUdjr98cgXePws9cN7Pqis7Nv7Ptb0Y2Lf2qQYTxyX6kCxLDgAgh8QTFLWuvDrpJfg44gFEwaYSGSFgVo7OHHKtm0oPrG_JdofulXpmNS3d3VZsgZvNSRHvNLEeLhpM3M7gmo2ohl-KUXItYedZnnFZAwcc4EXMl2I4QBruQ1nqMQ4L25ZtncEjrjpzcPEXqS5qhG28I3RV1SrEOBnMkIZUFJbyIYsVZEDYEzJoTiqWQD4fjnRTzr0crDWvPfjzlU'
    },
    {
      id: 2,
      name: 'Jersey Print Kirschblüten',
      category: 'jersey',
      description: '95% BW, 5% EL • 140cm breit',
      price: '14,50€ /m',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD73gqjFr0xgd6-0Vkv00YxxH7w28lYM3zAxocwhKpfy07i4lt7ESt85DpjJ25zLz2LDciCMCuVp0rq0gbOa6f3GB8PtL7zwZ_tzgDNbfcgTUeRcaiJho7ZGkwDIDXF7YZI2uwsvZCuEdnu5nnDabVDbwgC6fKsDdOaQwr9wiYSdEqWj5yxWeQ3KOlpA2RABSL0Ya1g0vROIJJRX5ears8WsUM96hZnuy2iBjYbyB6u6TQ6RLGU0pgK6E2DsrbMTDlpjcq1IRPMmXc'
    },
    {
      id: 3,
      name: 'Leinen Dunkelblau',
      category: 'leinen',
      description: '100% Leinen • 145cm breit',
      price: '18,90€ /m',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzFy1PB6xANzFlklm1tctsycj1_f7-Wp96Dpm4mJTbyNDr5ZVoERPNjktLjH5TjE5bX2jaDh2oWOD14QaxZvKKw5RbqwNA4qNCO_FiRuDf2QQnBJcjsWfdvi1O5ORyH_kzzH_0KksE5txEXZ46WLYpISr_O59FTn78beq5S9RpXHynfmnDFMrKCtXGDdE2Wyn012V3Rw4OGIc44ju-pelI8VSokc4IROQteP5LfwS1dXd9pyh-YU-IITTRlQ1d4eiM4xJ9MPw56Ks'
    }
  ]

  const filteredProducts = selectedCategory === 'alle' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  const handleShopLink = () => {
    window.open('https://www.dasituepfelchen-online.de', '_blank')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f7', padding: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#705671', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Stoffe & Zubehör</h1>
          <p style={{ fontSize: '16px', color: '#4c454b', margin: '0', lineHeight: '1.6' }}>Hochwertige Stoffe & Materialien für dein nächstes Nähprojekt</p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '16px', fontSize: '20px' }}>🔍</span>
            <input
              type="text"
              placeholder="Stoffe suchen..."
              style={{ width: '100%', paddingLeft: '48px', paddingRight: '16px', padding: '16px 16px 16px 48px', background: 'white', border: '1px solid #d4d2cf', borderRadius: '10px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
          {['alle', 'bio', 'jersey', 'leinen', 'patchwork'].map(cat => (
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
              {cat === 'alle' ? 'Alle' : cat === 'bio' ? 'Bio' : cat === 'jersey' ? 'Jersey' : cat === 'leinen' ? 'Leinen' : 'Patchwork'}
            </button>
          ))}
        </div>

        {/* WhatsApp Banner */}
        <div style={{ background: '#00a94d', color: 'white', borderRadius: '16px', padding: '16px', marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 4px 12px rgba(0, 169, 77, 0.15)' }}>
          <div style={{ fontSize: '24px' }}>💬</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' }}>Nichts verpassen!</h3>
            <p style={{ fontSize: '12px', margin: '0', opacity: 0.95 }}>Lass dich per WhatsApp benachrichtigen, wenn neue Bio-Stoffe eintreffen.</p>
          </div>
          <div style={{ fontSize: '16px' }}>→</div>
        </div>

        {/* Products Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {filteredProducts.map(product => (
            <div key={product.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(112, 86, 113, 0.08)', border: '1px solid rgba(212, 210, 207, 0.3)', transition: 'transform 0.3s ease' }}>
              {/* Product Image */}
              <div style={{ position: 'relative', height: '240px', overflow: 'hidden', background: '#efedec' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.transform = 'scale(1)'
                  }}
                />
              </div>

              {/* Product Info */}
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1b1c1b', margin: '0 0 6px 0' }}>{product.name}</h3>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#895029', margin: '0 0 12px 0', textTransform: 'uppercase' }}>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#895029' }}>{product.price}</span>
                  <button
                    onClick={handleShopLink}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      border: '2px solid #705671',
                      color: '#705671',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLButtonElement
                      target.style.background = '#705671'
                      target.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLButtonElement
                      target.style.background = 'white'
                      target.style.color = '#705671'
                    }}
                  >
                    In den Shop →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#4c454b' }}>
            <p style={{ fontSize: '16px' }}>Keine Stoffe in dieser Kategorie gefunden.</p>
          </div>
        )}

        {/* CTA Section */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', textAlign: 'center', boxShadow: '0 4px 20px rgba(112, 86, 113, 0.08)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#705671', marginBottom: '12px' }}>Zum vollständigen Online Shop</h2>
          <p style={{ fontSize: '14px', color: '#4c454b', marginBottom: '24px' }}>Entdecke alle Stoffe, Zubehör und exklusiven Angebote in unserem Online Shop</p>
          <button
            onClick={handleShopLink}
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: '#705671',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement
              target.style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement
              target.style.opacity = '1'
            }}
          >
            Jetzt shoppen →
          </button>
        </div>
      </div>
    </div>
  )
}