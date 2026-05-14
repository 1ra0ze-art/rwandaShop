import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

function Chat() {
  const { user } = useAuth()
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

const styles = {
  page: { backgroundColor: '#0f0f0f', minHeight: '100vh' },
  container: { maxWidth: '700px', margin: '0 auto', padding: '30px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 57px)' },
  header: { marginBottom: '16px' },
  heading: { color: '#fff' },
  chatBox: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '20px', border: '1px solid #2a2a2a', marginBottom: '16px' },
  empty: { color: '#555', textAlign: 'center', marginTop: '40px' },
  bubble: { maxWidth: '70%', padding: '10px 14px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '4px' },
  myBubble: { alignSelf: 'flex-end', backgroundColor: '#6c63ff' },
  theirBubble: { alignSelf: 'flex-start', backgroundColor: '#2a2a2a' },
  msgText: { color: '#fff', fontSize: '14px', margin: 0 },
  msgTime: { color: 'rgba(255,255,255,0.5)', fontSize: '11px', margin: 0 },
  inputRow: { display: 'flex', gap: '10px' },
  input: { flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px' },
  sendBtn: { padding: '12px 24px', borderRadius: '8px', backgroundColor: '#6c63ff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }
}

export default Chat