import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth, theme } from '../context/AuthContext'

function Notifications() {
  const { user, darkMode } = useAuth()
const t = darkMode ? theme.dark : theme.light
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('notifications') || '[]')
    const mine = all.filter(n => n.userId === user.id)
    setNotifications(mine.reverse())

    // mark all as read
    const updated = all.map(n => n.userId === user.id ? { ...n, read: true } : n)
    localStorage.setItem('notifications', JSON.stringify(updated))
  }, [])

  const styles = {
  page: { backgroundColor: t.bg, minHeight: '100vh' },
  container: { padding: '30px', maxWidth: '700px' },
  heading: { color: t.text, marginBottom: '24px' },
  empty: { color: t.subText, textAlign: 'center', marginTop: '60px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { backgroundColor: t.cardBg, borderRadius: '12px', padding: '18px 20px', border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: '6px' },
  unread: { border: `1px solid ${t.accent}`, backgroundColor: darkMode ? '#1e1e2e' : '#f0eeff' },
  message: { color: t.text, fontSize: '15px', margin: 0 },
  date: { color: t.subText, fontSize: '12px', margin: 0 }
}

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>🔔 Notifications</h2>
        {notifications.length === 0 ? (
          <p style={styles.empty}>No notifications yet.</p>
        ) : (
          <div style={styles.list}>
            {notifications.map(n => (
              <div key={n.id} style={{ ...styles.card, ...(n.read ? {} : styles.unread) }}>
                <p style={styles.message}>{n.message}</p>
                <p style={styles.date}>{n.createdAt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



export default Notifications