import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth, theme } from '../context/AuthContext'

function Chat() {
  const { user, darkMode } = useAuth()
  const t = darkMode ? theme.dark : theme.light
  const { sellerId } = useParams()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [seller, setSeller] = useState(null)
  const bottomRef = useRef(null)

  const chatKey = `chat_${Math.min(user.id, parseInt(sellerId))}_${Math.max(user.id, parseInt(sellerId))}`

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    setSeller(users.find(u => u.id === parseInt(sellerId)))
    const msgs = JSON.parse(localStorage.getItem(chatKey) || '[]')
    setMessages(msgs)
  }, [sellerId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!text.trim()) return
    const newMsg = {
      id: Date.now(),
      senderId: user.id,
      senderName: user.name,
      text,
      createdAt: new Date().toLocaleString()
    }
    const updated = [...messages, newMsg]
    setMessages(updated)
    localStorage.setItem(chatKey, JSON.stringify(updated))
    setText('')
  }

  const styles = {
  page: { backgroundColor: t.bg, minHeight: '100vh' },
  container: { maxWidth: '700px', margin: '0 auto', padding: '30px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 57px)' },
  header: { marginBottom: '16px' },
  heading: { color: t.text },
  chatBox: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: t.cardBg, borderRadius: '12px', padding: '20px', border: `1px solid ${t.border}`, marginBottom: '16px' },
  empty: { color: t.subText, textAlign: 'center', marginTop: '40px' },
  bubble: { maxWidth: '70%', padding: '10px 14px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '4px' },
  myBubble: { alignSelf: 'flex-end', backgroundColor: t.accent },
  theirBubble: { alignSelf: 'flex-start', backgroundColor: darkMode ? '#2a2a2a' : '#f0f0f0', border: `1px solid ${t.border}` },
  msgText: { color: t.text, fontSize: '14px', margin: 0 },
  msgTime: { color: t.subText, fontSize: '11px', margin: 0 },
  inputRow: { display: 'flex', gap: '10px' },
  input: { flex: 1, padding: '12px 16px', borderRadius: '8px', border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text, fontSize: '14px' },
  sendBtn: { padding: '12px 24px', borderRadius: '8px', backgroundColor: t.accent, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }
}

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}>💬 Chat with {seller?.name || 'Seller'}</h2>
        </div>
        <div style={styles.chatBox}>
          {messages.length === 0 ? (
            <p style={styles.empty}>No messages yet. Say hi!</p>
          ) : (
            messages.map(msg => (
              <div key={msg.id} style={{ ...styles.bubble, ...(msg.senderId === user.id ? styles.myBubble : styles.theirBubble) }}>
                <p style={styles.msgText}>{msg.text}</p>
                <p style={styles.msgTime}>{msg.createdAt}</p>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
        <div style={styles.inputRow}>
          <input
            style={styles.input}
            placeholder="Type a message..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button style={styles.sendBtn} onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  )
}



export default Chat