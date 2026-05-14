import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist') || '[]'))
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Electronics', 'Clothing', 'Food & Drinks', 'Home & Living', 'Beauty', 'Sports', 'Other']

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('products') || '[]')
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]')
    const withRatings = stored.map(p => {
      const productReviews = reviews.filter(r => r.productId === p.id)
      const avgRating = productReviews.length > 0
        ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
        : null
      return { ...p, avgRating, reviewCount: productReviews.length }
    })
    setProducts(withRatings)
  }, [])

  const addToCart = (product) => {
    if (!user) return navigate('/login')
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(i => i.id === product.id)
    if (existing) {
      existing.qty += 1
    } else {
      cart.push({ ...product, qty: 1 })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart!')
  }
  const toggleWishlist = (product) => {
    if (!user) return navigate('/login')
    const existing = wishlist.find(i => i.id === product.id)
    let updated
    if (existing) {
      updated = wishlist.filter(i => i.id !== product.id)
    } else {
      updated = [...wishlist, product]
    }
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
  }

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'All' || p.category === activeCategory
    return matchSearch && matchCategory
  })

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Browse Products</h2>
       <input
          style={styles.search}
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat}
              style={{ ...styles.catBtn, ...(activeCategory === cat ? styles.activeCat : {}) }}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p style={styles.empty}>No products available yet.</p>
        ) : (
          <div style={styles.grid}>
            {filtered.map(product => (
              <div key={product.id} style={styles.card}>
                {product.image && (
                  <img src={product.image} alt={product.name} style={styles.img} />
                )}
                <h3 style={styles.name}>{product.name}</h3>
                <p style={styles.desc}>{product.description}</p>
                <p style={styles.price}>{product.price} RWF</p>
                {product.avgRating && (
                  <p style={styles.rating}>
                    {'★'.repeat(Math.round(product.avgRating))}{'☆'.repeat(5 - Math.round(product.avgRating))} {product.avgRating} ({product.reviewCount})
                  </p>
                )}
                <p style={{ ...styles.stock, color: product.stock === 0 ? '#ff4d4d' : product.stock <= 5 ? '#f0a500' : '#4caf50' }}>
                  {product.stock === 0 ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} in stock`}
                </p>
                <button
                  style={{ ...styles.btn, ...(product.stock === 0 ? styles.disabledBtn : {}) }}
                  onClick={() => product.stock !== 0 && addToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <div style={styles.iconRow}>
                  <button style={styles.iconBtn} title="Chat with Seller" onClick={() => navigate(`/chat/${product.sellerId}`)}>💬</button>
                  <button style={styles.iconBtn} title="View Seller" onClick={() => navigate(`/seller-profile/${product.sellerId}`)}>👤</button>
                  <button
                    style={{ ...styles.iconBtn, color: wishlist.find(i => i.id === product.id) ? '#ff4d4d' : '#aaa', borderColor: wishlist.find(i => i.id === product.id) ? '#ff4d4d' : '#333' }}
                    title="Wishlist"
                    onClick={() => toggleWishlist(product)}
                  >
                    {wishlist.find(i => i.id === product.id) ? '❤️' : '🤍'}
                  </button>
                </div>
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
  heading: { color: '#fff', marginBottom: '20px' },
  search: { padding: '10px 16px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px', width: '100%', maxWidth: '400px', marginBottom: '30px' },
  empty: { color: '#aaa', textAlign: 'center', marginTop: '60px' },
  categories: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' },
  catBtn: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #333', backgroundColor: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: '13px' },
  activeCat: { backgroundColor: '#6c63ff', color: '#fff', border: '1px solid #6c63ff' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid #2a2a2a' },
  img: { width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' },
  name: { color: '#fff', fontSize: '16px', margin: 0 },
  desc: { color: '#aaa', fontSize: '13px', margin: 0 },
  price: { color: '#6c63ff', fontWeight: 'bold', fontSize: '15px', margin: 0 },
  btn: { padding: '10px', borderRadius: '8px', backgroundColor: '#6c63ff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  disabledBtn: { backgroundColor: '#333', color: '#666', cursor: 'not-allowed' },
  stock: { fontSize: '12px', fontWeight: 'bold', margin: 0 },
  rating: { color: '#f0a500', fontSize: '13px', margin: 0 },
  iconRow: { display: 'flex', gap: '8px' },
  iconBtn: { flex: 1, padding: '8px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid #333', color: '#aaa', cursor: 'pointer', fontSize: '16px' }
  
  
}
export default Home