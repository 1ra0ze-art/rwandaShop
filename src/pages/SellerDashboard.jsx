import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

function SellerDashboard() {
  const { user } = useAuth()
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

const styles = {
  page: { backgroundColor: '#0f0f0f', minHeight: '100vh' },
  layout: { display: 'flex' },
  sidebar: { width: '200px', backgroundColor: '#111', minHeight: 'calc(100vh - 57px)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid #222' },
  sidebarTitle: { color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
  sideLink: { color: '#aaa', fontSize: '14px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none' },
  activeSideLink: { backgroundColor: '#1e1e2e', color: '#6c63ff' },
  content: { flex: 1, padding: '30px' },
  heading: { color: '#fff', marginBottom: '24px' },
  empty: { color: '#aaa', textAlign: 'center', marginTop: '60px' },
  list: { display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '750px' },
  card: { backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '20px', border: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', gap: '10px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { color: '#fff', fontWeight: 'bold', fontSize: '15px' },
  status: { fontWeight: 'bold', fontSize: '13px' },
  customer: { color: '#ccc', fontSize: '14px', margin: 0 },
  address: { color: '#aaa', fontSize: '13px', margin: 0 },
  date: { color: '#aaa', fontSize: '13px', margin: 0 },
  items: { borderTop: '1px solid #2a2a2a', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' },
  item: { display: 'flex', justifyContent: 'space-between' },
  itemName: { color: '#ccc', fontSize: '14px' },
  itemQty: { color: '#aaa', fontSize: '13px' },
  itemPrice: { color: '#6c63ff', fontSize: '14px' },
  payment: { color: '#aaa', fontSize: '13px', margin: 0 },
  proofLabel: { color: '#aaa', fontSize: '13px', marginBottom: '6px' },
  proofImg: { width: '100%', maxWidth: '300px', borderRadius: '8px', border: '1px solid #333' },
  cardPaid: { color: '#4caf50', fontSize: '13px' },
  actions: { display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid #2a2a2a', paddingTop: '10px' },
  actionLabel: { color: '#aaa', fontSize: '13px' },
  select: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', fontSize: '13px' }
}

export default SellerDashboard