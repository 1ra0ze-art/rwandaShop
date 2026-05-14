import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
    if (!result.success) return setError('Wrong email or password')

    if (result.role === 'admin') navigate('/admin')
    else if (result.role === 'seller') navigate('/seller')
    else navigate('/')
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Login</h2>
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
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f0f' },
  box: { backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' },
  title: { color: '#fff', textAlign: 'center', marginBottom: '8px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', fontSize: '14px' },
  btn: { padding: '12px', borderRadius: '8px', backgroundColor: '#6c63ff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
  error: { color: '#ff4d4d', fontSize: '13px', textAlign: 'center' },
  link: { color: '#aaa', textAlign: 'center', fontSize: '13px' },
  a: { color: '#6c63ff' }
}

export default Login