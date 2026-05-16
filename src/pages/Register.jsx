import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import emailjs from '@emailjs/browser'

function Register() {
  const { register, verifyEmail } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [momoNumber, setMomoNumber] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [bankName, setBankName] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState('register')
  const [verifyCode, setVerifyCode] = useState('')
  const [userId, setUserId] = useState(null)
  const [inputCode, setInputCode] = useState('')
  useEffect(() => { document.title = 'Register — RwandaShop' }, [])
  
  const handleResend = async () => {
    setError('')
    const newCode = Math.floor(100000 + Math.random() * 900000).toString()
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updated = users.map(u => u.id === userId ? { ...u, verifyCode: newCode } : u)
    localStorage.setItem('users', JSON.stringify(updated))
    setVerifyCode(newCode)
    try {
      await emailjs.send('service_vdhxxej', 'template_plke7jk', { to_email: email, email, passcode: newCode, time: '15 minutes' }, '7Pi3rV-nmN_Bl1jvq')
      alert('New code sent!')
    } catch {
      setError('Failed to resend. Try again.')
    }
  }

  const handleRegister = async () => {
    if (!name || !email || !password) return setError('Fill in all fields')
    const paymentMethods = role === 'seller' ? { momoNumber, bankAccount, bankName } : null
    const result = register(name, email, password, role, paymentMethods)
    if (!result.success) return setError(result.message)

    const code = result.verifyCode
    try {
      await emailjs.send(
        'service_vdhxxej',
        'template_i8ykovr',
        { to_email: email, email, passcode: code, time: '15 minutes' },
        '7Pi3rV-nmN_Bl1jvq'
      )
      setVerifyCode(code)
      setUserId(result.userId)
      setStep('verify')
    } catch (err) {
      setError('Failed to send verification email. Try again.')
    }
  }

  return (
   <div style={styles.card}>
        <div style={styles.logoRow}>
          <span style={styles.logoIcon}>🛒</span>
          <span style={styles.logoText}>RwandaShop</span>
        </div>

        {step === 'register' ? <>
          <h2 style={styles.title}>Create Account</h2>
          {error && <p style={styles.error}>{error}</p>}
          <input style={styles.input} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
          <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <select style={styles.input} value={role} onChange={e => setRole(e.target.value)}>
            <option value="user">Customer</option>
            <option value="seller">Seller</option>
          </select>
          {role === 'seller' && <>
            <p style={styles.sectionLabel}>💳 Payment Methods</p>
            <input style={styles.input} placeholder="MoMo Number (e.g. 0788000000)" value={momoNumber} onChange={e => setMomoNumber(e.target.value)} />
            <input style={styles.input} placeholder="Bank Account Number (optional)" value={bankAccount} onChange={e => setBankAccount(e.target.value)} />
            <input style={styles.input} placeholder="Bank Name (e.g. BK, Equity)" value={bankName} onChange={e => setBankName(e.target.value)} />
          </>}
          <button style={styles.btn} onClick={handleRegister}>Register</button>
          <p style={styles.link}>Have an account? <Link to="/login" style={styles.a}>Login</Link></p>
        </> : <>
          <h2 style={styles.title}>Verify Email</h2>
          <p style={styles.subtitle}>We sent a 6-digit code to {email}</p>
          {error && <p style={styles.error}>{error}</p>}
          <input
            style={styles.input}
            placeholder="Enter 6-digit code"
            value={inputCode}
            onChange={e => setInputCode(e.target.value)}
            maxLength={6}
          />
          <button style={styles.btn} onClick={() => {
            const result = verifyEmail(userId, inputCode)
            if (!result.success) return setError(result.message)
            if (result.role === 'seller') navigate('/seller')
            else navigate('/')
          }}>Verify & Continue</button>
          <p style={styles.link}>Wrong email? <span style={{ ...styles.a, cursor: 'pointer' }} onClick={() => setStep('register')}>Go back</span></p>
          <p style={styles.link}><span style={{ ...styles.a, cursor: 'pointer' }} onClick={handleResend}>Resend code</span></p>
        </>}
      </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  bg: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 },
  card: { position: 'relative', zIndex: 1, backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', margin: '20px' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' },
  logoIcon: { fontSize: '28px' },
  logoText: { color: '#6c63ff', fontWeight: 'bold', fontSize: '20px' },
  title: { color: '#fff', textAlign: 'center', margin: 0, fontSize: '22px' },
  input: { padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: '14px' },
  btn: { padding: '13px', borderRadius: '10px', backgroundColor: '#6c63ff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
  error: { color: '#ff4d4d', fontSize: '13px', textAlign: 'center', margin: 0 },
  link: { color: '#aaa', textAlign: 'center', fontSize: '13px', margin: 0 },
  a: { color: '#6c63ff' },
  sectionLabel: { color: '#6c63ff', fontSize: '13px', fontWeight: 'bold', margin: 0 },
  subtitle: { color: '#aaa', textAlign: 'center', fontSize: '13px', margin: 0 },
}

export default Register