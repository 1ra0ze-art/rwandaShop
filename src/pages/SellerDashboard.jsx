import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth, theme } from '../context/AuthContext'

function SellerDashboard() {
  const { user, darkMode } = useAuth()
const t = darkMode ? theme.dark : theme.light
  const [sellerOrders, setSellerOrders] = useState([])
  const [chats, setChats] = useState([])

 useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const myOrders = allOrders.filter(o =>
      o.items.some(item => item.sellerId === user.id)
    )
    setSellerOrders(myOrders)

    // load chats
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const customers = users.filter(u => u.role === 'user')
    const myChats = customers.map(customer => {
      const chatKey = `chat_${Math.min(user.id, customer.id)}_${Math.max(user.id, customer.id)}`
      const msgs = JSON.parse(localStorage.getItem(chatKey) || '[]')
      return { customer, chatKey, msgs, lastMsg: msgs[msgs.length - 1] }
    }).filter(c => c.msgs.length > 0)
    setChats(myChats)
  }, [])

  const updateSellerOrder = (orderId, field, value) => {
    const all = JSON.parse(localStorage.getItem('orders') || '[]')
    const updated = all.map(o => {
      if (o.id !== orderId) return o
      const updatedOrder = { ...o, [field]: value }
      if (field === 'deliveryStatus') {
        const messages = {
          'not shipped': 'Your order has not been shipped yet.',
          'shipped': 'Your order is on the way!',
          'delivered': 'Your order has been delivered!'
        }
        const estimatedDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
        updatedOrder.deliveryInfo = { message: messages[value], estimatedDate }
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
        notifications.push({
          id: Date.now(),
          userId: o.userId,
          message: `Delivery update for order #${o.id}: ${messages[value]}`,
          read: false,
          createdAt: new Date().toLocaleString()
        })
        localStorage.setItem('notifications', JSON.stringify(notifications))
      }
      return updatedOrder
    })
    localStorage.setItem('orders', JSON.stringify(updated))
    setSellerOrders(updated.filter(o => o.items.some(item => item.sellerId === user.id)))
  }

  const styles = {
  page: { backgroundColor: t.bg, minHeight: '100vh' },
  layout: { display: 'flex' },
  sidebar: { width: '200px', backgroundColor: darkMode ? '#111' : '#fff', minHeight: 'calc(100vh - 57px)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', borderRight: `1px solid ${t.border}` },
  sidebarTitle: { color: t.subText, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
  sideLink: { color: t.subText, fontSize: '14px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none' },
  activeSideLink: { backgroundColor: darkMode ? '#1e1e2e' : '#f0eeff', color: t.accent },
  content: { flex: 1, padding: '30px' },
  heading: { color: t.text, marginBottom: '24px' },
  empty: { color: t.subText, textAlign: 'center', marginTop: '60px' },
  list: { display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '750px' },
  card: { backgroundColor: t.cardBg, borderRadius: '12px', padding: '20px', border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: '10px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { color: t.text, fontWeight: 'bold', fontSize: '15px' },
  status: { fontWeight: 'bold', fontSize: '13px' },
  customer: { color: t.text, fontSize: '14px', margin: 0 },
  address: { color: t.subText, fontSize: '13px', margin: 0 },
  date: { color: t.subText, fontSize: '13px', margin: 0 },
  items: { borderTop: `1px solid ${t.border}`, paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' },
  item: { display: 'flex', justifyContent: 'space-between' },
  itemName: { color: t.text, fontSize: '14px' },
  itemQty: { color: t.subText, fontSize: '13px' },
  itemPrice: { color: t.accent, fontSize: '14px' },
  payment: { color: t.subText, fontSize: '13px', margin: 0 },
  proofLabel: { color: t.subText, fontSize: '13px', marginBottom: '6px' },
  proofImg: { width: '100%', maxWidth: '300px', borderRadius: '8px', border: `1px solid ${t.border}` },
  cardPaid: { color: '#4caf50', fontSize: '13px' },
  actions: { display: 'flex', alignItems: 'center', gap: '10px', borderTop: `1px solid ${t.border}`, paddingTop: '10px' },
  actionLabel: { color: t.subText, fontSize: '13px' },
  select: { padding: '6px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.inputBg, color: t.text, fontSize: '13px' }
}

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.layout}>
        <div style={styles.sidebar}>
          <p style={styles.sidebarTitle}>Seller Menu</p>
          <Link to="/seller" style={{ ...styles.sideLink, ...styles.activeSideLink }}>🛒 Orders</Link>
          <Link to="/seller/products" style={styles.sideLink}>📦 Products</Link>
          <Link to="/seller/chats" style={styles.sideLink}>💬 Chats</Link>
          <Link to="/seller/analytics" style={styles.sideLink}>📊 Analytics</Link>
        </div>
        <div style={styles.content}>
          <h2 style={styles.heading}>🛒 Customer Orders</h2>
          {sellerOrders.length === 0 ? (
            <p style={styles.empty}>No orders yet.</p>
          ) : (
            <div style={styles.list}>
              {sellerOrders.map(order => (
                <div key={order.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <span style={styles.orderId}>Order #{order.id}</span>
                    <span style={{ ...styles.status, color: order.status === 'approved' ? '#4caf50' : order.status === 'rejected' ? '#ff4d4d' : '#f0a500' }}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={styles.customer}>👤 {order.userName}</p>
                  {order.deliveryAddress && <p style={styles.address}>📍 {order.deliveryAddress} | 📞 {order.deliveryPhone}</p>}
                  <p style={styles.date}>📅 {order.createdAt}</p>
                  <div style={styles.items}>
                    {order.items.filter(i => i.sellerId === user.id).map(item => (
                      <div key={item.id} style={styles.item}>
                        <span style={styles.itemName}>{item.name}</span>
                        <span style={styles.itemQty}>x{item.qty}</span>
                        <span style={styles.itemPrice}>{item.price * item.qty} RWF</span>
                      </div>
                    ))}
                  </div>
                  <p style={styles.payment}>
                    Payment: <span style={{ color: order.paymentStatus === 'paid' ? '#4caf50' : '#f0a500' }}>
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </p>
                  {order.paymentProof && order.paymentProof !== 'card_payment' && (
                    <div>
                      <p style={styles.proofLabel}>Payment Proof:</p>
                      <img src={order.paymentProof} alt="proof" style={styles.proofImg} />
                    </div>
                  )}
                  {order.paymentProof === 'card_payment' && (
                    <p style={styles.cardPaid}>💳 Paid by card</p>
                  )}
                  <div style={styles.actions}>
                    <label style={styles.actionLabel}>Delivery:</label>
                    <select style={styles.select} value={order.deliveryStatus || 'not shipped'} onChange={e => updateSellerOrder(order.id, 'deliveryStatus', e.target.value)}>
                      <option value="not shipped">Not Shipped</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



export default SellerDashboard