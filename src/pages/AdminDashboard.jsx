import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth, theme } from '../context/AuthContext'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

function AdminDashboard() {
  const { darkMode } = useAuth()
  const t = darkMode ? theme.dark : theme.light
  const [tab, setTab] = useState('overview')
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [featured, setFeatured] = useState([])
  const [disputes, setDisputes] = useState([])

  useEffect(() => {
    document.title = 'Admin — RwandaShop'
    setOrders(JSON.parse(localStorage.getItem('orders') || '[]'))
    setUsers(JSON.parse(localStorage.getItem('users') || '[]'))
    setProducts(JSON.parse(localStorage.getItem('products') || '[]'))
    setFeatured(JSON.parse(localStorage.getItem('featuredProducts') || '[]'))
    setDisputes(JSON.parse(localStorage.getItem('disputes') || '[]'))
  }, [])

  const customers = users.filter(u => u.role === 'user')
  const sellers = users.filter(u => u.role === 'seller')
  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + Number(o.total), 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const pendingSellers = sellers.filter(s => !s.approved && !s.suspended).length

  // revenue over time
  const revenueMap = {}
  orders.filter(o => o.paymentStatus === 'paid').forEach(o => {
    const date = o.createdAt?.split(',')[0] || 'Unknown'
    revenueMap[date] = (revenueMap[date] || 0) + Number(o.total)
  })
  const revenueData = Object.entries(revenueMap).map(([date, amount]) => ({ date, amount }))

  // revenue by seller
  const sellerRevenueMap = {}
  orders.filter(o => o.paymentStatus === 'paid').forEach(o => {
    o.items.forEach(item => {
      sellerRevenueMap[item.sellerName] = (sellerRevenueMap[item.sellerName] || 0) + item.price * item.qty
    })
  })
  const sellerRevenueData = Object.entries(sellerRevenueMap).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount).slice(0, 5)

  const updateOrder = (id, field, value) => {
    if (field === 'status' && value === 'rejected') {
      if (!window.confirm('Are you sure you want to reject this order?')) return
    }
    const updated = orders.map(o => o.id === id ? { ...o, [field]: value } : o)
    setOrders(updated)
    localStorage.setItem('orders', JSON.stringify(updated))
    if (field === 'status') {
      const order = orders.find(o => o.id === id)
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
      notifications.push({ id: Date.now(), userId: order.userId, message: `Your order #${order.id} has been ${value}.`, read: false, createdAt: new Date().toLocaleString() })
      localStorage.setItem('notifications', JSON.stringify(notifications))
    }
  }

  const updateDelivery = (id, status) => {
    const estimatedDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
    const messages = { 'not shipped': 'Your order has not been shipped yet.', 'shipped': 'Your order is on the way!', 'delivered': 'Your order has been delivered!' }
    const updated = orders.map(o => o.id === id ? { ...o, deliveryStatus: status, deliveryInfo: { message: messages[status], estimatedDate } } : o)
    setOrders(updated)
    localStorage.setItem('orders', JSON.stringify(updated))
    const order = orders.find(o => o.id === id)
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
    notifications.push({ id: Date.now(), userId: order.userId, message: `Delivery update for order #${order.id}: ${messages[status]}`, read: false, createdAt: new Date().toLocaleString() })
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }

  const approveSeller = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, approved: true, suspended: false } : u)
    setUsers(updated)
    localStorage.setItem('users', JSON.stringify(updated))
  }

  const rejectSeller = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, approved: false, rejected: true } : u)
    setUsers(updated)
    localStorage.setItem('users', JSON.stringify(updated))
  }

  const suspendUser = (id) => {
    if (!window.confirm('Suspend this user?')) return
    const updated = users.map(u => u.id === id ? { ...u, suspended: true } : u)
    setUsers(updated)
    localStorage.setItem('users', JSON.stringify(updated))
  }

  const unsuspendUser = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, suspended: false } : u)
    setUsers(updated)
    localStorage.setItem('users', JSON.stringify(updated))
  }

  const toggleFeatured = (product) => {
    const isFeatured = featured.find(f => f.id === product.id)
    const updated = isFeatured ? featured.filter(f => f.id !== product.id) : [...featured, product]
    setFeatured(updated)
    localStorage.setItem('featuredProducts', JSON.stringify(updated))
  }

  const resolveDispute = (id, resolution) => {
    const updated = disputes.map(d => d.id === id ? { ...d, status: 'resolved', resolution } : d)
    setDisputes(updated)
    localStorage.setItem('disputes', JSON.stringify(updated))
  }

  const styles = {
    page: { backgroundColor: t.bg, minHeight: '100vh' },
    container: { padding: '30px' },
    heading: { color: t.text, marginBottom: '24px' },
    stats: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' },
    stat: { backgroundColor: t.cardBg, borderRadius: '12px', padding: '20px 28px', border: `1px solid ${t.border}`, textAlign: 'center', flex: 1, minWidth: '120px' },
    statNum: { color: t.accent, fontSize: '24px', fontWeight: 'bold', margin: 0 },
    statLabel: { color: t.subText, fontSize: '13px', margin: '4px 0 0' },
    statAlert: { color: '#ff4d4d', fontSize: '24px', fontWeight: 'bold', margin: 0 },
    tabs: { display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' },
    tab: { padding: '10px 20px', borderRadius: '8px', border: `1px solid ${t.border}`, backgroundColor: 'transparent', color: t.subText, cursor: 'pointer', fontSize: '14px' },
    activeTab: { backgroundColor: t.accent, color: '#fff', border: `1px solid ${t.accent}` },
    list: { display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px' },
    card: { backgroundColor: t.cardBg, borderRadius: '12px', padding: '20px', border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: '10px' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    orderId: { color: t.text, fontWeight: 'bold' },
    date: { color: t.subText, fontSize: '13px' },
    customer: { color: t.text, fontSize: '14px', margin: 0 },
    address: { color: t.subText, fontSize: '13px', margin: 0 },
    items: { borderTop: `1px solid ${t.border}`, paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' },
    item: { display: 'flex', justifyContent: 'space-between' },
    itemName: { color: t.text, fontSize: '14px' },
    itemQty: { color: t.subText, fontSize: '13px' },
    itemPrice: { color: t.accent, fontSize: '14px' },
    total: { color: t.text, fontSize: '15px', margin: 0 },
    totalAmount: { color: t.accent, fontWeight: 'bold' },
    actions: { display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: `1px solid ${t.border}`, paddingTop: '10px' },
    actionGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
    actionLabel: { color: t.subText, fontSize: '13px' },
    select: { padding: '6px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.inputBg, color: t.text, fontSize: '13px' },
    approveBtn: { padding: '7px 16px', borderRadius: '6px', backgroundColor: '#4caf50', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
    rejectBtn: { padding: '7px 16px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', cursor: 'pointer', fontSize: '13px' },
    suspendBtn: { padding: '7px 16px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid #f0a500', color: '#f0a500', cursor: 'pointer', fontSize: '13px' },
    userCard: { backgroundColor: t.cardBg, borderRadius: '10px', padding: '16px 20px', border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
    userName: { color: t.text, fontWeight: 'bold', flex: 1 },
    userEmail: { color: t.subText, fontSize: '13px' },
    roleTag: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    statusTag: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },
    productCard: { backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: '8px' },
    img: { width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' },
    name: { color: t.text, margin: 0, fontSize: '15px' },
    seller: { color: t.subText, fontSize: '12px', margin: 0 },
    price: { color: t.accent, fontWeight: 'bold', margin: 0 },
    featuredBtn: { padding: '8px', borderRadius: '8px', border: `1px solid ${t.accent}`, backgroundColor: 'transparent', color: t.accent, cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
    featuredActiveBtn: { padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: t.accent, color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
    chartSection: { backgroundColor: t.cardBg, borderRadius: '12px', padding: '24px', border: `1px solid ${t.border}`, marginBottom: '24px' },
    chartTitle: { color: t.text, marginBottom: '16px', fontSize: '15px' },
    chartRow: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
    proofSection: { borderTop: `1px solid ${t.border}`, paddingTop: '10px' },
    proofLabel: { color: t.subText, fontSize: '13px', marginBottom: '6px' },
    proofImg: { width: '100%', maxWidth: '300px', borderRadius: '8px', border: `1px solid ${t.border}` },
    empty: { color: t.subText, textAlign: 'center', marginTop: '40px' },
    disputeCard: { backgroundColor: t.cardBg, borderRadius: '12px', padding: '20px', border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: '10px' },
    disputeTitle: { color: t.text, fontWeight: 'bold', fontSize: '15px', margin: 0 },
    disputeDesc: { color: t.subText, fontSize: '13px', margin: 0 },
    resolvedTag: { color: '#4caf50', fontSize: '12px', fontWeight: 'bold' }
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Admin Dashboard</h2>

        <div style={styles.stats}>
          <div style={styles.stat}><p style={styles.statNum}>{orders.length}</p><p style={styles.statLabel}>Total Orders</p></div>
          <div style={styles.stat}><p style={styles.statAlert}>{pendingOrders}</p><p style={styles.statLabel}>Pending Orders</p></div>
          <div style={styles.stat}><p style={styles.statNum}>{customers.length}</p><p style={styles.statLabel}>Customers</p></div>
          <div style={styles.stat}><p style={styles.statAlert}>{pendingSellers}</p><p style={styles.statLabel}>Pending Sellers</p></div>
          <div style={styles.stat}><p style={styles.statNum}>{sellers.filter(s => s.approved).length}</p><p style={styles.statLabel}>Active Sellers</p></div>
          <div style={styles.stat}><p style={styles.statNum}>{products.length}</p><p style={styles.statLabel}>Products</p></div>
          <div style={styles.stat}><p style={styles.statNum}>{totalRevenue.toLocaleString()} RWF</p><p style={styles.statLabel}>Revenue</p></div>
        </div>

        <div style={styles.tabs}>
          {['overview', 'orders', 'sellers', 'customers', 'featured', 'disputes'].map(t => (
            <button key={t} style={{ ...styles.tab, ...(tab === t ? styles.activeTab : {}) }} onClick={() => setTab(t)}>
              {t === 'overview' ? '📊 Overview' : t === 'orders' ? '🛒 Orders' : t === 'sellers' ? '🏪 Sellers' : t === 'customers' ? '👤 Customers' : t === 'featured' ? '⭐ Featured' : '⚠️ Disputes'}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <>
            <div style={styles.chartSection}>
              <h3 style={styles.chartTitle}>Revenue Over Time</h3>
              {revenueData.length === 0 ? <p style={styles.empty}>No data yet.</p> : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenueData}>
                    <XAxis dataKey="date" stroke="#555" tick={{ fill: t.subText, fontSize: 12 }} />
                    <YAxis stroke="#555" tick={{ fill: t.subText, fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, color: t.text }} />
                    <Line type="monotone" dataKey="amount" stroke={t.accent} strokeWidth={2} dot={{ fill: t.accent }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            <div style={styles.chartSection}>
              <h3 style={styles.chartTitle}>Top Sellers by Revenue</h3>
              {sellerRevenueData.length === 0 ? <p style={styles.empty}>No data yet.</p> : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={sellerRevenueData}>
                    <XAxis dataKey="name" stroke="#555" tick={{ fill: t.subText, fontSize: 12 }} />
                    <YAxis stroke="#555" tick={{ fill: t.subText, fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, color: t.text }} />
                    <Bar dataKey="amount" fill={t.accent} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}

        {tab === 'orders' && (
          <div style={styles.list}>
            {orders.length === 0 ? <p style={styles.empty}>No orders yet.</p> : orders.map(order => (
              <div key={order.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.orderId}>Order #{order.id}</span>
                  <span style={{ color: order.status === 'approved' ? '#4caf50' : order.status === 'rejected' ? '#ff4d4d' : '#f0a500', fontWeight: 'bold', fontSize: '13px' }}>{order.status.toUpperCase()}</span>
                </div>
                <p style={styles.customer}>👤 {order.userName}</p>
                {order.deliveryAddress && <p style={styles.address}>📍 {order.deliveryAddress} | 📞 {order.deliveryPhone}</p>}
                <p style={styles.date}>📅 {order.createdAt}</p>
                <div style={styles.items}>
                  {order.items.map(item => (
                    <div key={item.id} style={styles.item}>
                      <span style={styles.itemName}>{item.name}</span>
                      <span style={styles.itemQty}>x{item.qty}</span>
                      <span style={styles.itemPrice}>{item.price * item.qty} RWF</span>
                    </div>
                  ))}
                </div>
                <p style={styles.total}>Total: <span style={styles.totalAmount}>{order.total} RWF</span></p>
                {order.paymentProof && order.paymentProof !== 'card_payment' && (
                  <div style={styles.proofSection}>
                    <p style={styles.proofLabel}>Payment Proof:</p>
                    <img src={order.paymentProof} alt="proof" style={styles.proofImg} />
                  </div>
                )}
                {order.paymentProof === 'card_payment' && <p style={{ color: '#4caf50', fontSize: '13px' }}>💳 Paid by card</p>}
                <div style={styles.actions}>
                  <div style={styles.actionGroup}>
                    <label style={styles.actionLabel}>Status:</label>
                    <select style={styles.select} value={order.status} onChange={e => updateOrder(order.id, 'status', e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div style={styles.actionGroup}>
                    <label style={styles.actionLabel}>Payment:</label>
                    <select style={styles.select} value={order.paymentStatus} onChange={e => updateOrder(order.id, 'paymentStatus', e.target.value)}>
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                  <div style={styles.actionGroup}>
                    <label style={styles.actionLabel}>Delivery:</label>
                    <select style={styles.select} value={order.deliveryStatus || 'not shipped'} onChange={e => updateDelivery(order.id, e.target.value)}>
                      <option value="not shipped">Not Shipped</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'sellers' && (
          <div style={styles.list}>
            {sellers.length === 0 ? <p style={styles.empty}>No sellers yet.</p> : sellers.map(s => (
              <div key={s.id} style={styles.userCard}>
                <div style={{ flex: 1 }}>
                  <p style={styles.userName}>🏪 {s.name}</p>
                  <p style={styles.userEmail}>{s.email}</p>
                </div>
                <span style={{ ...styles.statusTag, backgroundColor: s.suspended ? '#ff4d4d22' : s.approved ? '#4caf5022' : s.rejected ? '#ff4d4d22' : '#f0a50022', color: s.suspended ? '#ff4d4d' : s.approved ? '#4caf50' : s.rejected ? '#ff4d4d' : '#f0a500' }}>
                  {s.suspended ? 'Suspended' : s.approved ? 'Active' : s.rejected ? 'Rejected' : 'Pending'}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {!s.approved && !s.rejected && !s.suspended && <>
                    <button style={styles.approveBtn} onClick={() => approveSeller(s.id)}>✓ Approve</button>
                    <button style={styles.rejectBtn} onClick={() => rejectSeller(s.id)}>✗ Reject</button>
                  </>}
                  {s.approved && !s.suspended && <button style={styles.suspendBtn} onClick={() => suspendUser(s.id)}>⏸ Suspend</button>}
                  {s.suspended && <button style={styles.approveBtn} onClick={() => unsuspendUser(s.id)}>▶ Unsuspend</button>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'customers' && (
          <div style={styles.list}>
            {customers.length === 0 ? <p style={styles.empty}>No customers yet.</p> : customers.map(c => (
              <div key={c.id} style={styles.userCard}>
                <div style={{ flex: 1 }}>
                  <p style={styles.userName}>👤 {c.name}</p>
                  <p style={styles.userEmail}>{c.email}</p>
                </div>
                <span style={{ ...styles.statusTag, backgroundColor: c.suspended ? '#ff4d4d22' : '#4caf5022', color: c.suspended ? '#ff4d4d' : '#4caf50' }}>
                  {c.suspended ? 'Suspended' : 'Active'}
                </span>
                {c.suspended
                  ? <button style={styles.approveBtn} onClick={() => unsuspendUser(c.id)}>▶ Unsuspend</button>
                  : <button style={styles.suspendBtn} onClick={() => suspendUser(c.id)}>⏸ Suspend</button>
                }
              </div>
            ))}
          </div>
        )}

        {tab === 'featured' && (
          <div style={styles.grid}>
            {products.length === 0 ? <p style={styles.empty}>No products yet.</p> : products.map(p => (
              <div key={p.id} style={styles.productCard}>
                {p.image && <img src={p.image} alt={p.name} style={styles.img} />}
                <p style={styles.name}>{p.name}</p>
                <p style={styles.seller}>by {p.sellerName}</p>
                <p style={styles.price}>{p.price} RWF</p>
                <button
                  style={featured.find(f => f.id === p.id) ? styles.featuredActiveBtn : styles.featuredBtn}
                  onClick={() => toggleFeatured(p)}
                >
                  {featured.find(f => f.id === p.id) ? '⭐ Featured' : 'Add to Featured'}
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'disputes' && (
          <div style={styles.list}>
            {disputes.length === 0 ? <p style={styles.empty}>No disputes yet.</p> : disputes.map(d => (
              <div key={d.id} style={styles.disputeCard}>
                <div style={styles.cardHeader}>
                  <p style={styles.disputeTitle}>⚠️ Order #{d.orderId} — {d.subject}</p>
                  {d.status === 'resolved' && <span style={styles.resolvedTag}>✅ Resolved</span>}
                </div>
                <p style={styles.disputeDesc}>{d.description}</p>
                <p style={styles.date}>By {d.userName} — {d.createdAt}</p>
                {d.status !== 'resolved' && (
                  <div style={styles.actions}>
                    <button style={styles.approveBtn} onClick={() => resolveDispute(d.id, 'refund')}>✓ Refund Customer</button>
                    <button style={styles.rejectBtn} onClick={() => resolveDispute(d.id, 'seller_favor')}>✗ Favor Seller</button>
                  </div>
                )}
                {d.resolution && <p style={{ color: '#4caf50', fontSize: '13px' }}>Resolution: {d.resolution === 'refund' ? 'Customer refunded' : 'Resolved in seller favor'}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard