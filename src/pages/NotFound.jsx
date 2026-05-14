import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  useEffect(() => { document.title = '404 — RwandaShop' }, [])

  return (
    <div style={styles.page}>
      <h1 style={styles.code}>404</h1>
      <p style={styles.message}>Oops! Page not found.</p>
      <p style={styles.sub}>The page you're looking for doesn't exist or was moved.</p>
      <button style={styles.btn} onClick={() => navigate('/')}>Go Back Home</button>
    </div>
  )
}

const styles = {
  page: { backgroundColor: '#0f0f0f', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '30px' },
  code: { color: '#6c63ff', fontSize: '120px', fontWeight: 'bold', margin: '0', lineHeight: '1' },
  message: { color: '#ffffff', fontSize: '24px', margin: '0' },
  sub: { color: '#aaaaaa', fontSize: '14px', margin: '0', textAlign: 'center' },
  btn: { padding: '12px 28px', borderRadius: '8px', backgroundColor: '#6c63ff', color: '#ffffff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', marginTop: '8px' }
}

export default NotFound