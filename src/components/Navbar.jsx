import { Link, useNavigate } from 'react-router-dom'
import { useAuth, theme } from '../context/AuthContext'
import { useState, useEffect } from 'react'

function Navbar() {
  const { user, logout, darkMode, toggleDarkMode } = useAuth()
  const t = darkMode ? theme.dark : theme.light
const navigate = useNavigate()
const [notifCount, setNotifCount] = useState(0)

useEffect(() => {
  if (user?.role === 'user') {
    const all = JSON.parse(localStorage.getItem('notifications') || '[]')
    const unread = all.filter(n => n.userId === user.id && !n.read)
    setNotifCount(unread.length)
  }
}, [user])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const styles = {
  nav: { backgroundColor: t.navBg, padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${t.border}`, position: 'sticky', top: 0, zIndex: 100 },
  logo: { color: t.accent, fontWeight: 'bold', fontSize: '22px', letterSpacing: '-0.5px' },
  links: { display: 'flex', alignItems: 'center', gap: '24px' },
  link: { color: t.subText, fontSize: '14px', textDecoration: 'none' },
  btnOutline: { color: t.accent, fontSize: '14px', border: `1px solid ${t.accent}`, padding: '6px 16px', borderRadius: '20px', textDecoration: 'none' },
  userBadge: { backgroundColor: t.cardBg, color: t.subText, fontSize: '13px', padding: '6px 14px', borderRadius: '20px', border: `1px solid ${t.border}`, textDecoration: 'none' },
  logoutBtn: { backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
  themeBtn: { backgroundColor: 'transparent', border: `1px solid ${t.border}`, color: t.text, padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '16px' },
  badge: { backgroundColor: '#ff4d4d', color: '#fff', borderRadius: '50%', padding: '2px 7px', fontSize: '11px', fontWeight: 'bold' }
}

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🛒 RwandaShop</Link>
      <div style={styles.links}>
        {!user && <>
          <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/register" style={styles.btnOutline}>Register</Link>
        </>}
        {user?.role === 'user' && <>
          <Link to="/" style={styles.link}>Shop</Link>
          <Link to="/cart" style={styles.link}>🛒 Cart</Link>
          <Link to="/wishlist" style={styles.link}>❤️ Wishlist</Link>
          <Link to="/orders" style={styles.link}>My Orders</Link>
          <Link to="/notifications" style={styles.link}>
            🔔 {notifCount > 0 && <span style={styles.badge}>{notifCount}</span>}
          </Link>
        </>}
        {user?.role === 'seller' && <>
          <Link to="/seller" style={styles.link}>🛒 Orders</Link>
          <Link to="/seller/products" style={styles.link}>📦 Products</Link>
        </>}
        {user?.role === 'admin' && <>
          <Link to="/admin" style={styles.link}>Admin Panel</Link>
        </>}
        {user && <>
          <Link to="/profile" style={styles.userBadge}>👤 {user.name}</Link>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          <button style={styles.themeBtn} onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </>}
      </div>
    </nav>
  )
}


export default Navbar