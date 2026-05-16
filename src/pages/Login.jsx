import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const floatingIcons = ['🛒', '💳', '📦', '⭐', '🏷️', '💰', '🎁', '🔔']

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { document.title = 'Login — RwandaShop' }, [])

  const handleLogin = () => {
    if (!email || !password) return setError('Fill in all fields')
    const result = login(email, password)
    if (!result.success) return setError(result.message)
    if (result.role === 'admin') navigate('/admin')
    else if (result.role === 'seller') navigate('/seller')
    else navigate('/')
  }

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .floating-icon {
          position: absolute;
          font-size: 24px;
          animation: float linear infinite;
          pointer-events: none;
        }
        .login-page-bg {
          background: linear-gradient(-45deg, #0f0f1a, #1a0f2e, #0d1b2a, #1a1a0f);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }
      `}</style>

      <div className="login-page-bg" style={styles.bg}>
        {floatingIcons.map((icon, i) => (
          <span
            key={i}
            className="floating-icon"
            style={{
              left: `${(i * 12) + 4}%`,
              animationDuration: `${6 + i * 1.5}s`,
              animationDelay: `${i * 0.8}s`,
              fontSize: `${20 + (i % 3) * 10}px`
            }}
          >
            {icon}
          </span>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.logoRow}>
          <span style={styles.logoIcon}>🛒</span>
          <span style={styles.logoText}>RwandaShop</span>
        </div>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.subtitle}>Login to your account</p>
        {error && <p style={styles.error}>{error}</p>}
        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <button style={styles.btn} onClick={handleLogin}>Login</button>
        <p style={styles.link}>
          <Link to="/forgot-password" style={styles.a}>Forgot password?</Link>
        </p>
        <p style={styles.link}>
          No account? <Link to="/register" style={styles.a}>Register</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  bg: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 },
  card: { position: 'relative', zIndex: 1, backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '4px' },
  logoIcon: { fontSize: '28px' },
  logoText: { color: '#6c63ff', fontWeight: 'bold', fontSize: '20px' },
  title: { color: '#fff', textAlign: 'center', margin: 0, fontSize: '24px' },
  subtitle: { color: '#aaa', textAlign: 'center', fontSize: '13px', margin: 0 },
  input: { padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: '14px' },
  btn: { padding: '13px', borderRadius: '10px', backgroundColor: '#6c63ff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', marginTop: '4px' },
  error: { color: '#ff4d4d', fontSize: '13px', textAlign: 'center', margin: 0 },
  link: { color: '#aaa', textAlign: 'center', fontSize: '13px', margin: 0 },
  a: { color: '#6c63ff' }
}

export default Login