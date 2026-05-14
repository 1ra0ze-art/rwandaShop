import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { document.title = 'Forgot Password — RwandaShop' }, [])

  const resetPassword = () => {
    if (!email || !newPassword || !confirm) return setError('Fill in all fields')
    if (newPassword !== confirm) return setError('Passwords do not match')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const found = users.find(u => u.email === email)
    if (!found) return setError('No account found with that email')
    const updated = users.map(u => u.email === email ? { ...u, password: newPassword } : u)
    localStorage.setItem('users', JSON.stringify(updated))
    setError('')
    setSuccess('Password reset! Redirecting to login...')
    setTimeout(() => navigate('/login'), 2000)
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Reset Password</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <input style={styles.input} placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} />
        <button style={styles.btn} onClick={resetPassword}>Reset Password</button>
        <p style={styles.link}><Link to="/login" style={styles.a}>Back to Login</Link></p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f0f' },
  box: { backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid #2a2a2a' },
  title: { color: '#fff', textAlign: 'center', marginBottom: '8px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', fontSize: '14px' },
  btn: { padding: '12px', borderRadius: '8px', backgroundColor: '#6c63ff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
  error: { color: '#ff4d4d', fontSize: '13px', textAlign: 'center' },
  success: { color: '#4caf50', fontSize: '13px', textAlign: 'center' },
  link: { color: '#aaa', textAlign: 'center', fontSize: '13px' },
  a: { color: '#6c63ff' }
}

export default ForgotPassword