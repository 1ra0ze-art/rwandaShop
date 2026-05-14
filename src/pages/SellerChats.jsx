import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

function SellerChats() {
  const { user } = useAuth()
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const customers = users.filter(u => u.role === 'user')
    const myChats = customers.map(customer => {
      const chatKey = `chat_${Math.min(user.id, customer.id)}_${Math.max(user.id, customer.id)}`
      const msgs = JSON.parse(localStorage.getItem(chatKey) || '[]')
      return { customer, chatKey, msgs, lastMsg: msgs[msgs.length - 1] }
    }).filter(c => c.msgs.length > 0)
    setChats(myChats)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const openChat = (chat) => {
    setActiveChat(chat)
    setMessages(chat.msgs)
  }

  const sendMessage = () => {
    if (!text.trim() || !activeChat) return
    const newMsg = {
      id: Date.now(),
      senderId: user.id,
      senderName: user.name,
      text,
      createdAt: new Date().toLocaleString()
    }
    const updated = [...messages, newMsg]
    setMessages(updated)
    localStorage.setItem(activeChat.chatKey, JSON.stringify(updated))
    setChats(prev => prev.map(c => c.chatKey === activeChat.chatKey ? { ...c, msgs: updated, lastMsg: newMsg } : c))
    setText('')
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.layout}>
        <div style={styles.sidebar}>
          <p style={styles.sidebarTitle}>Seller Menu</p>
          <Link to="/seller" style={styles.sideLink}>🛒 Orders</Link>
          <Link to="/seller/products" style={styles.sideLink}>📦 Products</Link>
          <Link to="/seller/chats" style={{ ...styles.sideLink, ...styles.activeSideLink }}>💬 Chats</Link>
        </div>
        <div style={styles.chatLayout}>
          <div style={styles.chatList}>
            <h3 style={styles.heading}>💬 Customer Chats</h3>
            {chats.length === 0 ? (
              <p style={styles.empty}>No chats yet.</p>
            ) : (
              chats.map(chat => (
                <div
                  key={chat.chatKey}
                  style={{ ...styles.chatItem, ...(activeChat?.chatKey === chat.chatKey ? styles.activeChatItem : {}) }}
                  onClick={() => openChat(chat)}
                >
                  <p style={styles.customerName}>👤 {chat.customer.name}</p>
                  <p style={styles.lastMsg}>{chat.lastMsg?.text?.slice(0, 40)}...</p>
                </div>
              ))
            )}
          </div>
          <div style={styles.chatBox}>
            {!activeChat ? (
              <p style={styles.selectChat}>Select a chat to start messaging</p>
            ) : (
              <>
                <div style={styles.chatHeader}>
                  <p style={styles.chatWith}>💬 {activeChat.customer.name}</p>
                </div>
                <div style={styles.messages}>
                  {messages.map(msg => (
                    <div key={msg.id} style={{ ...styles.bubble, ...(msg.senderId === user.id ? styles.myBubble : styles.theirBubble) }}>
                      <p style={styles.msgText}>{msg.text}</p>
                      <p style={styles.msgTime}>{msg.createdAt}</p>
                    </div>
                  ))}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { backgroundColor: '#0f0f0f', minHeight: '100vh' },
  layout: { display: 'flex' },
  sidebar: { width: '200px', backgroundColor: '#111', minHeight: 'calc(100vh - 57px)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid #222' },
  sidebarTitle: { color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
  sideLink: { color: '#aaa', fontSize: '14px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none' },
  activeSideLink: { backgroundColor: '#1e1e2e', color: '#6c63ff' },
  chatLayout: { flex: 1, display: 'flex' },
  chatList: { width: '280px', borderRight: '1px solid #222', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
  heading: { color: '#fff', marginBottom: '16px' },
  empty: { color: '#555', fontSize: '13px' },
  chatItem: { padding: '12px', borderRadius: '8px', cursor: 'pointer', border: '1px solid #2a2a2a', backgroundColor: '#1a1a1a' },
  activeChatItem: { border: '1px solid #6c63ff', backgroundColor: '#1e1e2e' },
  customerName: { color: '#fff', fontSize: '14px', fontWeight: 'bold', margin: 0 },
  lastMsg: { color: '#aaa', fontSize: '12px', margin: '4px 0 0' },
  chatBox: { flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' },
  selectChat: { color: '#555', textAlign: 'center', marginTop: '40%' },
  chatHeader: { borderBottom: '1px solid #222', paddingBottom: '12px', marginBottom: '16px' },
  chatWith: { color: '#fff', fontWeight: 'bold', margin: 0 },
  messages: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: 'calc(100vh - 250px)' },
  bubble: { maxWidth: '70%', padding: '10px 14px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '4px' },
  myBubble: { alignSelf: 'flex-end', backgroundColor: '#6c63ff' },
  theirBubble: { alignSelf: 'flex-start', backgroundColor: '#2a2a2a' },
  msgText: { color: '#fff', fontSize: '14px', margin: 0 },
  msgTime: { color: 'rgba(255,255,255,0.5)', fontSize: '11px', margin: 0 },
  inputRow: { display: 'flex', gap: '10px' },
  input: { flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px' },
  sendBtn: { padding: '12px 24px', borderRadius: '8px', backgroundColor: '#6c63ff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }
}

export default SellerChats