import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

function Navbar() {
  const { user, logout } = useAuth()
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
        </>}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    backgroundColor: '#111',
    padding: '16px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #222',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(10px)'
  },
  logo: {
    color: '#6c63ff',
    fontWeight: 'bold',
    fontSize: '22px',
    letterSpacing: '-0.5px'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  link: {
    color: '#ccc',
    fontSize: '14px',
    transition: 'color 0.2s'
  },
  btnOutline: {
    color: '#6c63ff',
    fontSize: '14px',
    border: '1px solid #6c63ff',
    padding: '6px 16px',
    borderRadius: '20px'
  },
  userBadge: {
    backgroundColor: '#1e1e2e',
    color: '#aaa',
    fontSize: '13px',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid #2a2a2a'
  },
  badge: { backgroundColor: '#ff4d4d', color: '#fff', borderRadius: '50%', padding: '2px 7px', fontSize: '11px', fontWeight: 'bold' },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #ff4d4d',
    color: '#ff4d4d',
    padding: '6px 14px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px'
  }
}

export default Navbar