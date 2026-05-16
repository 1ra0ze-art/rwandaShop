import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import emailjs from '@emailjs/browser'

const floatingIcons = ['🛒', '💳', '📦', '⭐', '🏷️', '💰', '🎁', '🔔']

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
  const [userId, setUserId] = useState(null)
  const [inputCode, setInputCode] = useState('')

  useEffect(() => { document.title = 'Register — RwandaShop' }, [])

  const handleRegister = async () => {
    if (!name || !email || !password) return setError('Fill in all fields')
    
    // check if email already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
    if (existingUsers.find(u => u.email === email)) return setError('Email already registered')

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // send email first
    try {
      await emailjs.send(
        'service_vdhxxej',
        'template_plke7jk',
        { to_email: email, email, passcode: code, time: '15 minutes' },
        '7Pi3rV-nmN_Bl1jvq'
      )
    } catch (err) {
      return setError('Failed to send verification email. Try again.')
    }

    // only save user if email succeeded
    const paymentMethods = role === 'seller' ? { momoNumber, bankAccount, bankName } : null
    const result = register(name, email, password, role, paymentMethods, code)
    if (!result.success) return setError(result.message)
    setUserId(result.userId)
    setStep('verify')
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
        'template_plke7jk',
        { to_email: email, email, passcode: code, time: '15 minutes' },
        '7Pi3rV-nmN_Bl1jvq'
      )
      setUserId(result.userId)
      setStep('verify')
    } catch (err) {
      setError('Failed to send verification email. Try again.')
    }
  }

  const handleVerify = () => {
    const result = verifyEmail(userId, inputCode)
    if (!result.success) return setError(result.message)
    if (result.role === 'seller') navigate('/seller')
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
        .floating-icon { position: absolute; animation: float linear infinite; pointer-events: none; }
        .reg-bg { background: linear-gradient(-45deg, #0f0f1a, #1a0f2e, #0d1b2a, #1a1a0f); background-size: 400% 400%; animation: gradientShift 8s ease infinite; }
      `}</style>

      <div className="reg-bg" style={styles.bg}>
        {floatingIcons.map((icon, i) => (
          <span key={i} className="floating-icon" style={{ left: `${(i * 12) + 4}%`, animationDuration: `${6 + i * 1.5}s`, animationDelay: `${i * 0.8}s`, fontSize: `${20 + (i % 3) * 10}px` }}>
            {icon}
          </span>
        ))}
      </div>

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
          <button style={styles.btn} onClick={handleVerify}>Verify & Continue</button>
          <p style={styles.link}>Wrong email? <span style={{ ...styles.a, cursor: 'pointer' }} onClick={() => setStep('register')}>Go back</span></p>
          <p style={styles.link}><span style={{ ...styles.a, cursor: 'pointer' }} onClick={handleResend}>Resend code</span></p>
        </>}
      </div>
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
  subtitle: { color: '#aaa', textAlign: 'center', fontSize: '13px', margin: 0 }
}

export default Register