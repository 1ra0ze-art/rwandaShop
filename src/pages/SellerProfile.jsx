import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

function SellerProfile() {
  const { sellerId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [seller, setSeller] = useState(null)
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const found = users.find(u => u.id === parseInt(sellerId))
    setSeller(found)

    const allProducts = JSON.parse(localStorage.getItem('products') || '[]')
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]')
    const sellerProducts = allProducts.filter(p => p.sellerId === parseInt(sellerId))
    const withRatings = sellerProducts.map(p => {
      const productReviews = allReviews.filter(r => r.productId === p.id)
      const avgRating = productReviews.length > 0
        ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
        : null
      return { ...p, avgRating, reviewCount: productReviews.length }
    })
    setProducts(withRatings)

    const sellerReviews = allReviews.filter(r => sellerProducts.some(p => p.id === r.productId))
    setReviews(sellerReviews)
  }, [sellerId])

  const avgSellerRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const addToCart = (product) => {
    if (!user) return navigate('/login')
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(i => i.id === product.id)
    if (existing) existing.qty += 1
    else cart.push({ ...product, qty: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart!')
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        {!seller ? <p style={styles.empty}>Seller not found.</p> : <>
          <div style={styles.profileCard}>
            <div style={styles.avatar}>👤</div>
            <div>
              <h2 style={styles.sellerName}>{seller.name}</h2>
              <p style={styles.sellerEmail}>{seller.email}</p>
              {avgSellerRating && (
                <p style={styles.rating}>⭐ {avgSellerRating} avg rating ({reviews.length} reviews)</p>
              )}
              <p style={styles.productCount}>{products.length} products listed</p>
            </div>
            {user?.role === 'user' && (
              <button style={styles.chatBtn} onClick={() => navigate(`/chat/${sellerId}`)}>
                💬 Chat with Seller
              </button>
            )}
          </div>

          <h3 style={styles.subheading}>Products by {seller.name}</h3>
          {products.length === 0 ? <p style={styles.empty}>No products yet.</p> : (
            <div style={styles.grid}>
              {products.map(p => (
                <div key={p.id} style={styles.card}>
                  {p.image && <img src={p.image} alt={p.name} style={styles.img} />}
                  {p.avgRating && <p style={styles.cardRating}>{'★'.repeat(Math.round(p.avgRating))}{'☆'.repeat(5 - Math.round(p.avgRating))} {p.avgRating}</p>}
                  <h4 style={styles.name}>{p.name}</h4>
                  <p style={styles.desc}>{p.description}</p>
                  <p style={styles.price}>{p.price} RWF</p>
                  <p style={{ ...styles.stock, color: p.stock === 0 ? '#ff4d4d' : p.stock <= 5 ? '#f0a500' : '#4caf50' }}>
                    {p.stock === 0 ? 'Out of stock' : p.stock <= 5 ? `Only ${p.stock} left` : `${p.stock} in stock`}
                  </p>
                  <button
                    style={{ ...styles.btn, ...(p.stock === 0 ? styles.disabledBtn : {}) }}
                    onClick={() => p.stock !== 0 && addToCart(p)}
                    disabled={p.stock === 0}
                  >
                    {p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              ))}
            </div>
          )}

          <h3 style={styles.subheading}>Customer Reviews</h3>
          {reviews.length === 0 ? <p style={styles.empty}>No reviews yet.</p> : (
            <div style={styles.reviewList}>
              {reviews.map(r => (
                <div key={r.id} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <span style={styles.reviewProduct}>{r.productName}</span>
                    <span style={styles.reviewRating}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  {r.comment && <p style={styles.reviewComment}>{r.comment}</p>}
                  <p style={styles.reviewDate}>{r.createdAt}</p>
                </div>
              ))}
            </div>
          )}
        </>}
      </div>
    </div>
  )
}

const styles = {
  page: { backgroundColor: '#0f0f0f', minHeight: '100vh' },
  container: { padding: '30px', maxWidth: '1000px', margin: '0 auto' },
  profileCard: { backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '24px', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' },
  avatar: { fontSize: '48px', backgroundColor: '#2a2a2a', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  sellerName: { color: '#fff', margin: 0, fontSize: '22px' },
  sellerEmail: { color: '#aaa', fontSize: '13px', margin: '4px 0' },
  rating: { color: '#f0a500', fontSize: '14px', margin: '4px 0' },
  productCount: { color: '#6c63ff', fontSize: '13px', margin: '4px 0' },
  chatBtn: { marginLeft: 'auto', padding: '10px 20px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid #6c63ff', color: '#6c63ff', cursor: 'pointer', fontWeight: 'bold' },
  subheading: { color: '#ccc', marginBottom: '16px', fontSize: '16px' },
  empty: { color: '#aaa' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' },
  card: { backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid #2a2a2a' },
  img: { width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' },
  cardRating: { color: '#f0a500', fontSize: '13px', margin: 0 },
  name: { color: '#fff', margin: 0 },
  desc: { color: '#aaa', fontSize: '13px', margin: 0 },
  price: { color: '#6c63ff', fontWeight: 'bold', margin: 0 },
  stock: { fontSize: '12px', fontWeight: 'bold', margin: 0 },
  btn: { padding: '10px', borderRadius: '8px', backgroundColor: '#6c63ff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  disabledBtn: { backgroundColor: '#333', color: '#666', cursor: 'not-allowed' },
  reviewList: { display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '700px' },
  reviewCard: { backgroundColor: '#1a1a1a', borderRadius: '10px', padding: '16px', border: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', gap: '6px' },
  reviewHeader: { display: 'flex', justifyContent: 'space-between' },
  reviewProduct: { color: '#ccc', fontSize: '14px', fontWeight: 'bold' },
  reviewRating: { color: '#f0a500', fontSize: '14px' },
  reviewComment: { color: '#aaa', fontSize: '13px', margin: 0 },
  reviewDate: { color: '#555', fontSize: '12px', margin: 0 }
}

export default SellerProfile