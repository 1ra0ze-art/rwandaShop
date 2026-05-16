import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth, theme } from '../context/AuthContext'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts'

function SellerAnalytics() {
  const { user, darkMode } = useAuth()
  const t = darkMode ? theme.dark : theme.light
  const [orders, setOrders] = useState([])
  const [revenue, setRevenue] = useState(0)
  const [revenueData, setRevenueData] = useState([])
  const [productData, setProductData] = useState([])
  const [statusData, setStatusData] = useState([])

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const myOrders = allOrders.filter(o => o.items.some(i => i.sellerId === user.id))
    setOrders(myOrders)

    // total revenue
    const totalRev = myOrders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => {
        const myItems = o.items.filter(i => i.sellerId === user.id)
        return sum + myItems.reduce((s, i) => s + i.price * i.qty, 0)
      }, 0)
    setRevenue(totalRev)

    // revenue over time
    const revenueMap = {}
    myOrders.forEach(o => {
      const date = o.createdAt.split(',')[0]
      const myItems = o.items.filter(i => i.sellerId === user.id)
      const amt = myItems.reduce((s, i) => s + i.price * i.qty, 0)
      revenueMap[date] = (revenueMap[date] || 0) + amt
    })
    setRevenueData(Object.entries(revenueMap).map(([date, amount]) => ({ date, amount })))

    // top products
    const productMap = {}
    myOrders.forEach(o => {
      o.items.filter(i => i.sellerId === user.id).forEach(item => {
        productMap[item.name] = (productMap[item.name] || 0) + item.qty
      })
    })
    setProductData(Object.entries(productMap).map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty).slice(0, 5))

    // order status
    const statusMap = { pending: 0, approved: 0, rejected: 0 }
    myOrders.forEach(o => { statusMap[o.status] = (statusMap[o.status] || 0) + 1 })
    setStatusData([
      { name: 'Pending', value: statusMap.pending, color: '#f0a500' },
      { name: 'Approved', value: statusMap.approved, color: '#4caf50' },
      { name: 'Rejected', value: statusMap.rejected, color: '#ff4d4d' }
    ])
  }, [])

  const styles = {
  page: { backgroundColor: t.bg, minHeight: '100vh' },
  layout: { display: 'flex' },
  sidebar: { width: '200px', backgroundColor: darkMode ? '#111' : '#fff', minHeight: 'calc(100vh - 57px)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', borderRight: `1px solid ${t.border}` },
  sidebarTitle: { color: t.subText, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
  sideLink: { color: t.subText, fontSize: '14px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none' },
  activeSideLink: { backgroundColor: darkMode ? '#1e1e2e' : '#f0eeff', color: t.accent },
  content: { flex: 1, padding: '30px' },
  heading: { color: t.text, marginBottom: '24px' },
  stats: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' },
  stat: { backgroundColor: t.cardBg, borderRadius: '12px', padding: '20px 28px', border: `1px solid ${t.border}`, textAlign: 'center', flex: 1, minWidth: '140px' },
  statNum: { color: t.accent, fontSize: '22px', fontWeight: 'bold', margin: 0 },
  statLabel: { color: t.subText, fontSize: '13px', margin: '4px 0 0' },
  chartSection: { backgroundColor: t.cardBg, borderRadius: '12px', padding: '24px', border: `1px solid ${t.border}`, marginBottom: '24px', flex: 1 },
  chartRow: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
  chartTitle: { color: t.text, marginBottom: '16px', fontSize: '15px' },
  empty: { color: t.subText, fontSize: '13px' }
}

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.layout}>
        <div style={styles.sidebar}>
          <p style={styles.sidebarTitle}>Seller Menu</p>
          <Link to="/seller" style={styles.sideLink}>🛒 Orders</Link>
          <Link to="/seller/products" style={styles.sideLink}>📦 Products</Link>
          <Link to="/seller/chats" style={styles.sideLink}>💬 Chats</Link>
          <Link to="/seller/analytics" style={{ ...styles.sideLink, ...styles.activeSideLink }}>📊 Analytics</Link>
        </div>
        <div style={styles.content}>
          <h2 style={styles.heading}>📊 My Analytics</h2>

          <div style={styles.stats}>
            <div style={styles.stat}>
              <p style={styles.statNum}>{orders.length}</p>
              <p style={styles.statLabel}>Total Orders</p>
            </div>
            <div style={styles.stat}>
              <p style={styles.statNum}>{revenue.toLocaleString()} RWF</p>
              <p style={styles.statLabel}>Total Revenue</p>
            </div>
            <div style={styles.stat}>
              <p style={styles.statNum}>{orders.filter(o => o.status === 'approved').length}</p>
              <p style={styles.statLabel}>Approved Orders</p>
            </div>
            <div style={styles.stat}>
              <p style={styles.statNum}>{orders.filter(o => o.paymentStatus === 'paid').length}</p>
              <p style={styles.statLabel}>Paid Orders</p>
            </div>
          </div>

          <div style={styles.chartSection}>
            <h3 style={styles.chartTitle}>Revenue Over Time</h3>
            {revenueData.length === 0 ? <p style={styles.empty}>No data yet.</p> : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <XAxis dataKey="date" stroke="#555" tick={{ fill: '#aaa', fontSize: 12 }} />
                  <YAxis stroke="#555" tick={{ fill: '#aaa', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff' }} />
                  <Line type="monotone" dataKey="amount" stroke="#6c63ff" strokeWidth={2} dot={{ fill: '#6c63ff' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={styles.chartRow}>
            <div style={styles.chartSection}>
              <h3 style={styles.chartTitle}>Top Products</h3>
              {productData.length === 0 ? <p style={styles.empty}>No data yet.</p> : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={productData}>
                    <XAxis dataKey="name" stroke="#555" tick={{ fill: '#aaa', fontSize: 12 }} />
                    <YAxis stroke="#555" tick={{ fill: '#aaa', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff' }} />
                    <Bar dataKey="qty" fill="#6c63ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div style={styles.chartSection}>
              <h3 style={styles.chartTitle}>Order Status</h3>
              {statusData.every(s => s.value === 0) ? <p style={styles.empty}>No data yet.</p> : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {statusData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ color: '#aaa' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



export default SellerAnalytics