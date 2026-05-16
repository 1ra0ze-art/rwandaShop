import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth, theme } from '../context/AuthContext'

function ReviewItem({ item, orderId, userId }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]')
    const existing = reviews.find(r => r.productId === item.id && r.userId === userId && r.orderId === orderId)
    if (existing) {
      setRating(existing.rating)
      setComment(existing.comment)
      setSubmitted(true)
    }
  }, [])

  const submitReview = () => {
    if (rating === 0) return alert('Please select a rating')
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]')
    const existing = reviews.find(r => r.productId === item.id && r.userId === userId && r.orderId === orderId)
    if (existing) return
    reviews.push({ id: Date.now(), productId: item.id, productName: item.name, userId, orderId, rating, comment, createdAt: new Date().toLocaleString() })
    localStorage.setItem('reviews', JSON.stringify(reviews))
    setSubmitted(true)
  }

  return (
    <div style={reviewStyles.card}>
      <p style={reviewStyles.productName}>{item.name}</p>
      {submitted ? (
        <p style={reviewStyles.submitted}>✅ Review submitted — {rating}⭐</p>
      ) : (
        <>
          <div style={reviewStyles.stars}>
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ ...reviewStyles.star, color: s <= rating ? '#f0a500' : '#444' }} onClick={() => setRating(s)}>★</span>
            ))}
          </div>
          <textarea style={reviewStyles.input} placeholder="Write a comment (optional)" value={comment} onChange={e => setComment(e.target.value)} rows={2} />
          <button style={reviewStyles.btn} onClick={submitReview}>Submit Review</button>
        </>
      )}
    </div>
  )
}

const reviewStyles = {
  card: { backgroundColor: '#0f0f0f', borderRadius: '8px', padding: '12px', border: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', gap: '8px' },
  productName: { color: '#ccc', fontSize: '14px', fontWeight: 'bold', margin: 0 },
  stars: { display: 'flex', gap: '6px' },
  star: { fontSize: '24px', cursor: 'pointer' },
  input: { padding: '8px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '13px', resize: 'vertical' },
  btn: { padding: '8px 16px', borderRadius: '6px', backgroundColor: '#6c63ff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
  submitted: { color: '#4caf50', fontSize: '13px' }
}
function Orders() {
  const { user, darkMode } = useAuth()
const t = darkMode ? theme.dark : theme.light
  const [orders, setOrders] = useState([])
  const [selectedPayMethod, setSelectedPayMethod] = useState({})

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('orders') || '[]')
    setOrders(all.filter(o => o.userId === user.id))
  }, [])

  const uploadPaymentProof = (orderId, e, method = 'momo') => {
    if (method === 'card') {
      const all = JSON.parse(localStorage.getItem('orders') || '[]')
      const updated = all.map(o => o.id === orderId ? { ...o, paymentProof: 'card_payment', paymentMethod: 'card' } : o)
      localStorage.setItem('orders', JSON.stringify(updated))
      setOrders(updated.filter(o => o.userId === user.id))
      alert('Card payment submitted! Waiting for admin verification.')
      return
    }
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const all = JSON.parse(localStorage.getItem('orders') || '[]')
      const updated = all.map(o => o.id === orderId ? { ...o, paymentProof: reader.result, paymentMethod: selectedPayMethod[orderId] } : o)
      localStorage.setItem('orders', JSON.stringify(updated))
      setOrders(updated.filter(o => o.userId === user.id))
      alert('Payment proof uploaded! Waiting for admin verification.')
    }
    reader.readAsDataURL(file)
  }

  const statusColor = (status) => {
    if (status === 'approved') return '#4caf50'
    if (status === 'rejected') return '#ff4d4d'
    return '#f0a500'
  }

  const styles = {
  page: { backgroundColor: t.bg, minHeight: '100vh' },
  container: { padding: '30px' },
  heading: { color: t.text, marginBottom: '24px' },
  empty: { color: t.subText, textAlign: 'center', marginTop: '60px' },
  list: { display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '700px' },
  card: { backgroundColor: t.cardBg, borderRadius: '12px', padding: '20px', border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: '10px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { color: t.text, fontWeight: 'bold', fontSize: '15px' },
  status: { fontWeight: 'bold', fontSize: '13px' },
  date: { color: t.subText, fontSize: '13px', margin: 0 },
  address: { color: t.subText, fontSize: '13px', margin: 0 },
  payment: { color: t.subText, fontSize: '13px', margin: 0 },
  proofSection: { backgroundColor: t.bg, borderRadius: '8px', padding: '12px', border: `1px solid ${t.border}` },
  proofHint: { color: t.subText, fontSize: '13px', marginBottom: '8px' },
  proofUploaded: { color: '#4caf50', fontSize: '13px' },
  fileInput: { color: t.subText, fontSize: '13px' },
  payMethods: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' },
  sellerName: { color: t.subText, fontSize: '12px', marginBottom: '4px' },
  payMethodBtn: { padding: '10px 14px', borderRadius: '8px', border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text, cursor: 'pointer', fontSize: '13px', textAlign: 'left' },
  activePayMethod: { border: `1px solid ${t.accent}`, color: t.accent, backgroundColor: t.bg },
  cardForm: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
  cardInput: { padding: '10px 12px', borderRadius: '8px', border: `1px solid ${t.border}`, backgroundColor: t.inputBg, color: t.text, fontSize: '14px' },
  cardRow: { display: 'flex', gap: '10px' },
  payBtn: { padding: '12px', borderRadius: '8px', backgroundColor: t.accent, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  delivery: { color: t.subText, fontSize: '13px', margin: 0 },
  deliveryInfo: { backgroundColor: t.bg, borderRadius: '8px', padding: '12px', border: `1px solid ${t.border}` },
  deliveryText: { color: t.text, fontSize: '13px', margin: 0 },
  deliveryDate: { color: t.accent, fontSize: '13px', margin: '4px 0 0' },
  items: { borderTop: `1px solid ${t.border}`, paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' },
  item: { display: 'flex', justifyContent: 'space-between' },
  itemName: { color: t.text, fontSize: '14px' },
  itemQty: { color: t.subText, fontSize: '13px' },
  itemPrice: { color: t.accent, fontSize: '14px' },
  total: { color: t.text, fontSize: '15px', borderTop: `1px solid ${t.border}`, paddingTop: '10px', margin: 0 },
  totalAmount: { color: t.accent, fontWeight: 'bold', fontSize: '18px' },
  reviewSection: { borderTop: `1px solid ${t.border}`, paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' },
  reviewTitle: { color: '#f0a500', fontSize: '14px', fontWeight: 'bold', margin: 0 },
  disputeBtn: { padding: '8px 16px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid #f0a500', color: '#f0a500', cursor: 'pointer', fontSize: '13px' },
  disputedTag: { color: '#f0a500', fontSize: '13px', margin: 0 }
}

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>My Orders</h2>
        {orders.length === 0 ? (
          <p style={styles.empty}>No orders yet.</p>
        ) : (
          <div style={styles.list}>
            {orders.map(order => (
              <div key={order.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.orderId}>Order #{order.id}</span>
                  <span style={{ ...styles.status, color: statusColor(order.status) }}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <p style={styles.date}>📅 {order.createdAt}</p>
                {order.deliveryAddress && (
                  <p style={styles.address}>📍 {order.deliveryAddress} | 📞 {order.deliveryPhone}</p>
                )}
                <p style={styles.payment}>
                  Payment: <span style={{ color: order.paymentStatus === 'paid' ? '#4caf50' : '#f0a500' }}>
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </p>
                {order.paymentStatus === 'unpaid' && (
                  <div style={styles.proofSection}>
                    {order.paymentProof ? (
                      <p style={styles.proofUploaded}>✅ Payment proof uploaded — awaiting verification</p>
                    ) : (
                      <>
                        <p style={styles.proofHint}>Select payment method:</p>
                        <div style={styles.payMethods}>
                          {order.sellerPayments?.map(sp => (
                            <div key={sp.sellerId}>
                              <p style={styles.sellerName}>Seller: {sp.sellerName}</p>
                              {sp.paymentMethods?.momoNumber && (
                                <button
                                  style={{ ...styles.payMethodBtn, ...(selectedPayMethod[order.id] === 'momo_' + sp.sellerId ? styles.activePayMethod : {}) }}
                                  onClick={() => setSelectedPayMethod(prev => ({ ...prev, [order.id]: 'momo_' + sp.sellerId }))}
                                >
                                  📲 MoMo — {sp.paymentMethods.momoNumber}
                                </button>
                              )}
                              {sp.paymentMethods?.bankAccount && (
                                <button
                                  style={{ ...styles.payMethodBtn, ...(selectedPayMethod[order.id] === 'bank_' + sp.sellerId ? styles.activePayMethod : {}) }}
                                  onClick={() => setSelectedPayMethod(prev => ({ ...prev, [order.id]: 'bank_' + sp.sellerId }))}
                                >
                                  🏦 {sp.paymentMethods.bankName} — {sp.paymentMethods.bankAccount}
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            style={{ ...styles.payMethodBtn, ...(selectedPayMethod[order.id] === 'card' ? styles.activePayMethod : {}) }}
                            onClick={() => setSelectedPayMethod(prev => ({ ...prev, [order.id]: 'card' }))}
                          >
                            💳 Credit / Debit Card
                          </button>
                        </div>
                        {selectedPayMethod[order.id] === 'card' && (
                          <div style={styles.cardForm}>
                            <input style={styles.cardInput} placeholder="Card Number" maxLength={16} />
                            <div style={styles.cardRow}>
                              <input style={styles.cardInput} placeholder="MM/YY" maxLength={5} />
                              <input style={styles.cardInput} placeholder="CVV" maxLength={3} />
                            </div>
                            <input style={styles.cardInput} placeholder="Cardholder Name" />
                            <button style={styles.payBtn} onClick={() => uploadPaymentProof(order.id, null, 'card')}>Pay {order.total} RWF</button>
                          </div>
                        )}
                        {selectedPayMethod[order.id] && selectedPayMethod[order.id] !== 'card' && (
                          <>
                            <p style={styles.proofHint}>Upload payment screenshot:</p>
                            <input type="file" accept="image/*" onChange={e => uploadPaymentProof(order.id, e)} style={styles.fileInput} />
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
                <p style={styles.delivery}>
                  Delivery: <span style={{ color: order.deliveryStatus === 'delivered' ? '#4caf50' : order.deliveryStatus === 'shipped' ? '#6c63ff' : '#f0a500' }}>
                    {(order.deliveryStatus || 'not shipped').toUpperCase()}
                  </span>
                </p>
                {order.deliveryInfo && (
                  <div style={styles.deliveryInfo}>
                    <p style={styles.deliveryText}>🚚 {order.deliveryInfo.message}</p>
                    <p style={styles.deliveryDate}>📅 Est. delivery: {order.deliveryInfo.estimatedDate}</p>
                  </div>
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
                {order.status === 'approved' && !order.disputed && (
                  <button style={styles.disputeBtn} onClick={() => {
                    const subject = prompt('What is the issue? (e.g. Wrong item, Not delivered)')
                    const description = prompt('Describe the problem:')
                    if (!subject || !description) return
                    const disputes = JSON.parse(localStorage.getItem('disputes') || '[]')
                    disputes.push({ id: Date.now(), orderId: order.id, userId: user.id, userName: user.name, subject, description, status: 'open', createdAt: new Date().toLocaleString() })
                    localStorage.setItem('disputes', JSON.stringify(disputes))
                    const all = JSON.parse(localStorage.getItem('orders') || '[]')
                    const updated = all.map(o => o.id === order.id ? { ...o, disputed: true } : o)
                    localStorage.setItem('orders', JSON.stringify(updated))
                    setOrders(updated.filter(o => o.userId === user.id))
                    alert('Dispute filed! Admin will review it.')
                  }}>⚠️ File a Dispute</button>
                )}
                {order.disputed && <p style={styles.disputedTag}>⚠️ Dispute filed — under review</p>}
                {order.deliveryStatus === 'delivered' && (
                  <div style={styles.reviewSection}>
                    <p style={styles.reviewTitle}>⭐ Rate your products</p>
                    {order.items.map(item => (
                      <ReviewItem key={item.id} item={item} orderId={order.id} userId={user.id} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


export default Orders