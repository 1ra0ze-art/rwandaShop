import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('orders')

  useEffect(() => {
    setOrders(JSON.parse(localStorage.getItem('orders') || '[]'))
  }, [])

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
      notifications.push({
        id: Date.now(),
        userId: order.userId,
        message: `Your order #${order.id} has been ${value}.`,
        read: false,
        createdAt: new Date().toLocaleString()
      })
      localStorage.setItem('notifications', JSON.stringify(notifications))
    }
  }

  const deleteUser = (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updated = users.filter(u => u.id !== id)
    localStorage.setItem('users', JSON.stringify(updated))
    window.location.reload()
  }

  const deleteProduct = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    const all = JSON.parse(localStorage.getItem('products') || '[]')
    const updated = all.filter(p => p.id !== id)
    localStorage.setItem('products', JSON.stringify(updated))
    window.location.reload()
  }

  const updateDelivery = (id, status) => {
    const estimatedDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
    const messages = {
      'not shipped': 'Your order has not been shipped yet.',
      'shipped': 'Your order is on the way!',
      'delivered': 'Your order has been delivered!'
    }
    const updated = orders.map(o => o.id === id ? {
      ...o,
      deliveryStatus: status,
      deliveryInfo: { message: messages[status], estimatedDate }
    } : o)
    setOrders(updated)
    localStorage.setItem('orders', JSON.stringify(updated))

    const order = orders.find(o => o.id === id)
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
    notifications.push({
      id: Date.now(),
      userId: order.userId,
      message: `Delivery update for order #${order.id}: ${messages[status]}`,
      read: false,
      createdAt: new Date().toLocaleString()
    })
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + Number(o.total), 0)

  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const products = JSON.parse(localStorage.getItem('products') || '[]')

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Admin Dashboard</h2>

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.stat}><p style={styles.statNum}>{orders.length}</p><p style={styles.statLabel}>Total Orders</p></div>
          <div style={styles.stat}><p style={styles.statNum}>{users.filter(u => u.role === 'user').length}</p><p style={styles.statLabel}>Customers</p></div>
          <div style={styles.stat}><p style={styles.statNum}>{users.filter(u => u.role === 'seller').length}</p><p style={styles.statLabel}>Sellers</p></div>
          <div style={styles.stat}><p style={styles.statNum}>{products.length}</p><p style={styles.statLabel}>Products</p></div>
          <div style={styles.stat}><p style={styles.statNum}>{totalRevenue} RWF</p><p style={styles.statLabel}>Revenue</p></div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {['orders', 'products', 'customers'].map(t => (
            <button key={t} style={{ ...styles.tab, ...(tab === t ? styles.activeTab : {}) }} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div style={styles.list}>
            {orders.length === 0 ? <p style={styles.empty}>No orders yet.</p> : orders.map(order => (
              <div key={order.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.orderId}>Order #{order.id}</span>
                  <span style={styles.date}>{order.createdAt}</span>
                </div>
                <p style={styles.customer}>👤 {order.userName}</p>
                {order.deliveryAddress && (
                    <p style={styles.address}>📍 {order.deliveryAddress} | 📞 {order.deliveryPhone}</p>
                  )}
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
                <div style={styles.actions}>
                  <div style={styles.actionGroup}>
                    <label style={styles.actionLabel}>Order Status:</label>
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
                {order.paymentProof && (
                  <div style={styles.proofSection}>
                    <p style={styles.proofLabel}>Payment Proof:</p>
                    <img src={order.paymentProof} alt="proof" style={styles.proofImg} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Products Tab */}
        {tab === 'products' && (
          <div style={styles.grid}>
            {products.length === 0 ? <p style={styles.empty}>No products.</p> : products.map(p => (
              <div key={p.id} style={styles.productCard}>
                {p.image && <img src={p.image} alt={p.name} style={styles.img} />}
                <h4 style={styles.name}>{p.name}</h4>
                <p style={styles.seller}>by {p.sellerName}</p>
                <p style={styles.price}>{p.price} RWF</p>
                <button style={styles.deleteBtn} onClick={() => deleteProduct(p.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}

        {/* Customers Tab */}
        {tab === 'customers' && (
          <div style={styles.list}>
            {users.filter(u => u.role !== 'admin').length === 0 ? <p style={styles.empty}>No users.</p> :
              users.filter(u => u.role !== 'admin').map(u => (
                <div key={u.id} style={styles.userCard}>
                  <span style={styles.userName}>👤 {u.name}</span>
                  <span style={styles.userEmail}>{u.email}</span>
                  <span style={{ ...styles.roleTag, backgroundColor: u.role === 'seller' ? '#6c63ff33' : '#4caf5033', color: u.role === 'seller' ? '#6c63ff' : '#4caf50' }}>{u.role}</span>
                  <button style={styles.deleteBtn} onClick={() => deleteUser(u.id)}>Delete</button>
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
  container: { padding: '30px' },
  heading: { color: '#fff', marginBottom: '24px' },
  stats: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' },
  stat: { backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '20px 28px', border: '1px solid #2a2a2a', textAlign: 'center', flex: 1, minWidth: '120px' },
  statNum: { color: '#6c63ff', fontSize: '24px', fontWeight: 'bold', margin: 0 },
  statLabel: { color: '#aaa', fontSize: '13px', margin: '4px 0 0' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '24px' },
  tab: { padding: '10px 20px', borderRadius: '8px', border: '1px solid #333', backgroundColor: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: '14px' },
  activeTab: { backgroundColor: '#6c63ff', color: '#fff', border: '1px solid #6c63ff' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '750px' },
  card: { backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '20px', border: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', gap: '10px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between' },
  orderId: { color: '#fff', fontWeight: 'bold' },
  date: { color: '#aaa', fontSize: '13px' },
  customer: { color: '#ccc', fontSize: '14px', margin: 0 },
  items: { borderTop: '1px solid #2a2a2a', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' },
  item: { display: 'flex', justifyContent: 'space-between' },
  itemName: { color: '#ccc', fontSize: '14px' },
  itemQty: { color: '#aaa', fontSize: '13px' },
  itemPrice: { color: '#6c63ff', fontSize: '14px' },
  total: { color: '#ccc', fontSize: '15px', margin: 0 },
  totalAmount: { color: '#6c63ff', fontWeight: 'bold' },
  actions: { display: 'flex', gap: '20px', flexWrap: 'wrap', borderTop: '1px solid #2a2a2a', paddingTop: '10px' },
  actionGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
  actionLabel: { color: '#aaa', fontSize: '13px' },
  select: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', fontSize: '13px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },
  productCard: { backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '16px', border: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', gap: '8px' },
  img: { width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' },
  name: { color: '#fff', margin: 0, fontSize: '15px' },
  seller: { color: '#aaa', fontSize: '12px', margin: 0 },
  price: { color: '#6c63ff', fontWeight: 'bold', margin: 0 },
  userCard: { backgroundColor: '#1a1a1a', borderRadius: '10px', padding: '16px 20px', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: '16px' },
  userName: { color: '#fff', fontWeight: 'bold', flex: 1 },
  userEmail: { color: '#aaa', fontSize: '13px', flex: 2 },
  roleTag: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  deleteBtn: { padding: '6px 14px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', cursor: 'pointer', fontSize: '12px' },
  address: { color: '#aaa', fontSize: '13px', margin: 0 },
  proofSection: { borderTop: '1px solid #2a2a2a', paddingTop: '10px' },
  proofLabel: { color: '#aaa', fontSize: '13px', marginBottom: '8px' },
  proofImg: { width: '100%', maxWidth: '300px', borderRadius: '8px', border: '1px solid #333' }
}

export default AdminDashboard