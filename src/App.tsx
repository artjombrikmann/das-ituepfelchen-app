import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function App() {
  const [status, setStatus] = useState('Checking...')

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          setStatus('❌ Fehler: ' + error.message)
        } else {
          setStatus('✅ Supabase verbunden!')
        }
      } catch (err) {
        setStatus('❌ Fehler beim Verbinden')
      }
    }
    checkConnection()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Das i-Tüpfelchen App</h1>
      <p>{status}</p>
    </div>
  )
}