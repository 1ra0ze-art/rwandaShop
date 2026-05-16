import { Link, useNavigate, useState } from 'react-router-dom'
import { useAuth, theme } from '../context/AuthContext'
import { useState, useEffect } from 'react'

function Navbar() {
  const { user, logout, darkMode, toggleDarkMode } = useAuth()
  const t = darkMode ? theme.dark : theme.light
  const navigate = useNavigate()
  const [notifCount, setNotifCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

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
    setMenuOpen(false)
  }

  const styles = {
    nav: { backgroundColor: t.navBg, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${t.border}`, position: 'sticky', top: 0, zIndex: 100 },
    logo: { color: t.accent, fontWeight: 'bold', fontSize: '20px', letterSpacing: '-0.5px', textDecoration: 'none' },
    hamburger: { backgroundColor: 'transparent', border: 'none', color: t.text, fontSize: '24px', cursor: 'pointer', display: 'none' },
    links: { display: 'flex', alignItems: 'center', gap: '20px' },
    link: { color: t.subText, fontSize: '14px', textDecoration: 'none' },
    btnOutline: { color: t.accent, fontSize: '14px', border: `1px solid ${t.accent}`, padding: '6px 16px', borderRadius: '20px', textDecoration: 'none' },
    userBadge: { backgroundColor: t.cardBg, color: t.subText, fontSize: '13px', padding: '6px 14px', borderRadius: '20px', border: `1px solid ${t.border}`, textDecoration: 'none' },
    logoutBtn: { backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
    themeBtn: { backgroundColor: 'transparent', border: `1px solid ${t.border}`, color: t.text, padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '16px' },
    badge: { backgroundColor: '#ff4d4d', color: '#fff', borderRadius: '50%', padding: '2px 7px', fontSize: '11px', fontWeight: 'bold' },
    mobileMenu: { display: menuOpen ? 'flex' : 'none', flexDirection: 'column', gap: '16px', padding: '20px', backgroundColor: t.navBg, borderBottom: `1px solid ${t.border}`, position: 'absolute', top: '57px', left: 0, right: 0, zIndex: 99 }
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>🛒 RwandaShop</Link>
        <div className="nav-links" style={styles.links}>
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
            <button style={styles.themeBtn} onClick={toggleDarkMode}>{darkMode ? '☀️' : '🌙'}</button>
            <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </>}
          {!user && <button style={styles.themeBtn} onClick={toggleDarkMode}>{darkMode ? '☀️' : '🌙'}</button>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button style={styles.themeBtn} onClick={toggleDarkMode} className="nav-hamburger" style={{ display: 'none' }}>{darkMode ? '☀️' : '🌙'}</button>
          <button className="nav-hamburger" style={{ ...styles.hamburger, display: 'none' }} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      <div style={styles.mobileMenu}>
        {!user && <>
          <Link to="/login" style={styles.link} onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/register" style={styles.link} onClick={() => setMenuOpen(false)}>Register</Link>
        </>}
        {user?.role === 'user' && <>
          <Link to="/" style={styles.link} onClick={() => setMenuOpen(false)}>🛍️ Shop</Link>
          <Link to="/cart" style={styles.link} onClick={() => setMenuOpen(false)}>🛒 Cart</Link>
          <Link to="/wishlist" style={styles.link} onClick={() => setMenuOpen(false)}>❤️ Wishlist</Link>
          <Link to="/orders" style={styles.link} onClick={() => setMenuOpen(false)}>📦 My Orders</Link>
          <Link to="/notifications" style={styles.link} onClick={() => setMenuOpen(false)}>🔔 Notifications {notifCount > 0 && <span style={styles.badge}>{notifCount}</span>}</Link>
        </>}
        {user?.role === 'seller' && <>
          <Link to="/seller" style={styles.link} onClick={() => setMenuOpen(false)}>🛒 Orders</Link>
          <Link to="/seller/products" style={styles.link} onClick={() => setMenuOpen(false)}>📦 Products</Link>
          <Link to="/seller/chats" style={styles.link} onClick={() => setMenuOpen(false)}>💬 Chats</Link>
          <Link to="/seller/analytics" style={styles.link} onClick={() => setMenuOpen(false)}>📊 Analytics</Link>
        </>}
        {user?.role === 'admin' && <>
          <Link to="/admin" style={styles.link} onClick={() => setMenuOpen(false)}>⚙️ Admin Panel</Link>
        </>}
        {user && <>
          <Link to="/profile" style={styles.link} onClick={() => setMenuOpen(false)}>👤 {user.name}</Link>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </>}
      </div>
    </>
  )
}

export default Navbar