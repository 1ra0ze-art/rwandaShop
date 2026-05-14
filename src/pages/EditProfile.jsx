import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

function EditProfile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { document.title = 'Edit Profile — RwandaShop' }, [])

  const saveProfile = () => {
    if (!name || !email) return setError('Name and email are required')
    if (password && password !== confirm) return setError('Passwords do not match')

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const emailExists = users.find(u => u.email === email && u.id !== user.id)
    if (emailExists) return setError('Email already in use')

    const updated = users.map(u => {
      if (u.id !== user.id) return u
      return { ...u, name, email, password: password || u.password }
    })
    localStorage.setItem('users', JSON.stringify(updated))
    const updatedUser = { ...user, name, email, password: password || user.password }
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))
    setError('')
    setSuccess('Profile updated! Please login again.')
    setTimeout(() => { logout(); navigate('/login') }, 2000)
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.box}>
          <h2 style={styles.title}>Edit Profile</h2>
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <input style={styles.input} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
          <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input style={styles.input} type="password" placeholder="New Password (leave blank to keep current)" value={password} onChange={e => setPassword(e.target.value)} />
          <input style={styles.input} type="password" placeholder="Confirm New Password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          <button style={styles.btn} onClick={saveProfile}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { backgroundColor: '#0f0f0f', minHeight: '100vh' },
  container: { display: 'flex', justifyContent: 'center', padding: '60px 30px' },
  box: { backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid #2a2a2a' },
  title: { color: '#fff', textAlign: 'center', marginBottom: '8px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', fontSize: '14px' },
  btn: { padding: '12px', borderRadius: '8px', backgroundColor: '#6c63ff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
  error: { color: '#ff4d4d', fontSize: '13px', textAlign: 'center' },
  success: { color: '#4caf50', fontSize: '13px', textAlign: 'center' }
}

export default EditProfile