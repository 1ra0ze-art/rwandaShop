import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [momoNumber, setMomoNumber] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [bankName, setBankName] = useState('')
  const [error, setError] = useState('')
  
  useEffect(() => { document.title = 'Register — RwandaShop' }, [])

  const handleRegister = () => {
    if (!name || !email || !password) return setError('Fill in all fields')
    const paymentMethods = role === 'seller' ? { momoNumber, bankAccount, bankName } : null
    const result = register(name, email, password, role, paymentMethods)
    if (!result.success) return setError(result.message)

    if (result.role === 'seller') navigate('/seller')
    else navigate('/')
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
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
        <select
          style={styles.input}
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="user">Customer</option>
          <option value="seller">Seller</option>
        </select>
        {role === 'seller' && <>
          <p style={styles.sectionLabel}>💳 Payment Methods (how customers will pay you)</p>
          <input
            style={styles.input}
            placeholder="MoMo Number (e.g. 0788000000)"
            value={momoNumber}
            onChange={e => setMomoNumber(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Bank Account Number (optional)"
            value={bankAccount}
            onChange={e => setBankAccount(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Bank Name (e.g. BK, Equity)"
            value={bankName}
            onChange={e => setBankName(e.target.value)}
          />
        </>}
        <button style={styles.btn} onClick={handleRegister}>Register</button>
        <p style={styles.link}>
          Have an account? <Link to="/login" style={styles.a}>Login</Link>
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
  a: { color: '#6c63ff' },
  sectionLabel: { color: '#6c63ff', fontSize: '13px', fontWeight: 'bold' }
}

export default Register