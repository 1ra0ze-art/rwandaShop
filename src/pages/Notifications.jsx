import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('notifications') || '[]')
    const mine = all.filter(n => n.userId === user.id)
    setNotifications(mine.reverse())

    // mark all as read
    const updated = all.map(n => n.userId === user.id ? { ...n, read: true } : n)
    localStorage.setItem('notifications', JSON.stringify(updated))
  }, [])

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

const styles = {
  page: { backgroundColor: '#0f0f0f', minHeight: '100vh' },
  container: { padding: '30px', maxWidth: '700px' },
  heading: { color: '#fff', marginBottom: '24px' },
  empty: { color: '#aaa', textAlign: 'center', marginTop: '60px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '18px 20px', border: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', gap: '6px' },
  unread: { border: '1px solid #6c63ff', backgroundColor: '#1e1e2e' },
  message: { color: '#fff', fontSize: '15px', margin: 0 },
  date: { color: '#aaa', fontSize: '12px', margin: 0 }
}

export default Notifications