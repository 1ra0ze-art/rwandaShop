import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth, theme } from '../context/AuthContext'

function AppDemo() {
  const [step, setStep] = useState(0)

  const screens = [
    { bg: '#1a1a2e', icon: '🛍️', title: 'Browse Products', desc: 'Find what you need' },
    { bg: '#1a2e1a', icon: '🛒', title: 'Add to Cart', desc: 'Pick your favorites' },
    { bg: '#2e1a1a', icon: '💳', title: 'Pay Easily', desc: 'MoMo, Bank or Card' },
    { bg: '#2e2a1a', icon: '🚚', title: 'Fast Delivery', desc: 'Track in real time' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev + 1) % screens.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={demoStyles.wrapper}>
      <style>{`
        @keyframes truckMove {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
        @keyframes phoneScreen {
          0% { opacity: 0; transform: translateY(20px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes road {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .phone-float { animation: float 3s ease-in-out infinite; }
        .truck { animation: truckMove 4s linear infinite; }
        .screen-content { animation: phoneScreen 2s ease infinite; }
        .road-line { animation: road 1s linear infinite; }
      `}</style>

      <div style={demoStyles.left}>
        <h3 style={demoStyles.heading}>How RwandaShop Works</h3>
        <div style={demoStyles.steps}>
          {screens.map((s, i) => (
            <div key={i} style={{ ...demoStyles.step, ...(i === step ? demoStyles.activeStep : {}) }} onClick={() => setStep(i)}>
              <span style={demoStyles.stepIcon}>{s.icon}</span>
              <p style={demoStyles.stepTitle}>{s.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={demoStyles.right}>
        <div className="phone-float" style={demoStyles.phone}>
          <div style={demoStyles.phoneTop}>
            <div style={demoStyles.camera} />
          </div>
          <div style={{ ...demoStyles.screen, backgroundColor: screens[step].bg }}>
            <div className="screen-content" key={step} style={demoStyles.screenContent}>
              <span style={demoStyles.screenIcon}>{screens[step].icon}</span>
              <p style={demoStyles.screenTitle}>{screens[step].title}</p>
              <p style={demoStyles.screenDesc}>{screens[step].desc}</p>
              <div style={demoStyles.fakeBar} />
              <div style={demoStyles.fakeBar2} />
            </div>
          </div>
          <div style={demoStyles.homeBtn} />
        </div>
      </div>

      <div style={demoStyles.roadWrapper}>
        <div style={demoStyles.road}>
          <div style={demoStyles.roadMarkings}>
            <div className="road-line" style={demoStyles.markingInner} />
          </div>
        </div>
        <div className="truck" style={demoStyles.truck}>🚚</div>
      </div>
    </div>
  )
}

const demoStyles = {
  wrapper: { background: 'linear-gradient(135deg, #0d0d1a, #1a1a2e)', borderRadius: '20px', padding: '30px', marginBottom: '30px', border: '1px solid #6c63ff33', display: 'flex', gap: '40px', alignItems: 'center', position: 'relative', overflow: 'hidden', minHeight: '280px' },
  left: { flex: 1 },
  heading: { color: '#fff', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', margin: '0 0 20px 0' },
  steps: { display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: 'wrap' },
  step: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '10px', border: '1px solid transparent', transition: 'all 0.3s', cursor: 'pointer' },
  activeStep: { backgroundColor: 'rgba(108,99,255,0.15)', border: '1px solid #6c63ff55' },
  stepIcon: { fontSize: '22px' },
  stepTitle: { color: '#fff', fontSize: '14px', fontWeight: 'bold', margin: 0 },
  stepDesc: { color: '#aaa', fontSize: '12px', margin: 0 },
  right: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  phone: { width: '120px', backgroundColor: '#111', borderRadius: '20px', border: '3px solid #333', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' },
  phoneTop: { backgroundColor: '#111', padding: '8px', display: 'flex', justifyContent: 'center' },
  camera: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#333' },
  screen: { height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.5s' },
  screenContent: { textAlign: 'center', padding: '10px' },
  screenIcon: { fontSize: '32px' },
  screenTitle: { color: '#fff', fontSize: '11px', fontWeight: 'bold', margin: '4px 0 2px' },
  screenDesc: { color: '#aaa', fontSize: '10px', margin: 0 },
  fakeBar: { height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', margin: '8px auto 4px', width: '70%' },
  fakeBar2: { height: '4px', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '2px', margin: '0 auto', width: '50%' },
  homeBtn: { height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' },
  roadWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px' },
  road: { backgroundColor: '#1a1a1a', height: '30px', position: 'relative', overflow: 'hidden' },
  roadMarkings: { position: 'absolute', top: '50%', left: 0, right: 0, height: '3px', overflow: 'hidden' },
  markingInner: { display: 'flex', gap: '20px', width: '200%' },
  truck: { position: 'absolute', bottom: '8px', fontSize: '28px', zIndex: 2 },
}
function Home() {
  const { user, darkMode } = useAuth()
  const t = darkMode ? theme.dark : theme.light
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist') || '[]'))
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Electronics', 'Clothing', 'Food & Drinks', 'Home & Living', 'Beauty', 'Sports', 'Other']

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('products') || '[]')
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]')
    const featuredIds = JSON.parse(localStorage.getItem('featuredProducts') || '[]').map(f => f.id)
    const withRatings = stored.map(p => {
      const productReviews = reviews.filter(r => r.productId === p.id)
      const avgRating = productReviews.length > 0
        ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
        : null
      return { ...p, avgRating, reviewCount: productReviews.length, isFeatured: featuredIds.includes(p.id) }
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

  const styles = {
  page: { backgroundColor: t.bg, minHeight: '100vh' },
  container: { padding: '30px' },
  heading: { color: t.text, marginBottom: '20px' },
  search: { padding: '10px 16px', borderRadius: '8px', border: `1px solid ${t.border}`, backgroundColor: t.inputBg, color: t.text, fontSize: '14px', width: '100%', maxWidth: '400px', marginBottom: '30px' },
  empty: { color: t.subText, textAlign: 'center', marginTop: '60px' },
  categories: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' },
  catBtn: { padding: '8px 16px', borderRadius: '20px', border: `1px solid ${t.border}`, backgroundColor: 'transparent', color: t.subText, cursor: 'pointer', fontSize: '13px' },
  activeCat: { backgroundColor: t.accent, color: '#fff', border: `1px solid ${t.accent}` },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  card: { backgroundColor: t.cardBg, borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: `1px solid ${t.border}`, boxShadow: darkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s', cursor: 'default' },
  imgWrapper: { position: 'relative', backgroundColor: darkMode ? '#2a2a2a' : '#f8f8f8' },
  img: { width: '100%', height: '200px', objectFit: 'contain', padding: '10px' },
  noImg: { width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' },
  wishlistIcon: { position: 'absolute', top: '8px', right: '8px', backgroundColor: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' },
  cardBody: { padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  category: { color: t.accent, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' },
  name: { color: t.text, fontSize: '15px', margin: 0, fontWeight: 'bold', lineHeight: '1.3' },
  desc: { color: t.subText, fontSize: '13px', margin: 0 },
  price: { color: darkMode ? '#ff9900' : '#B12704', fontWeight: 'bold', fontSize: '18px', margin: 0 },
  stock: { fontSize: '12px', fontWeight: 'bold', margin: 0 },
  rating: { color: '#f0a500', fontSize: '13px', margin: 0 },
  ratingCount: { color: t.subText, fontSize: '12px' },
  btn: { padding: '10px', borderRadius: '8px', backgroundColor: darkMode ? t.accent : '#f0c14b', color: darkMode ? '#fff' : '#111', border: darkMode ? 'none' : '1px solid #a88734', cursor: 'pointer', fontWeight: 'bold', marginTop: '4px' },
  disabledBtn: { backgroundColor: t.border, color: t.subText, cursor: 'not-allowed', border: 'none' },
  iconRow: { display: 'flex', gap: '8px', marginTop: '4px' },
  iconBtn: { flex: 1, padding: '7px', borderRadius: '8px', backgroundColor: 'transparent', border: `1px solid ${t.border}`, color: t.subText, cursor: 'pointer', fontSize: '12px' }
}

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <AppDemo />
        {products.filter(p => p.isFeatured).length > 0 && (
          <>
            <h2 style={styles.heading}>⭐ Featured Products</h2>
            <div style={styles.grid}>
              {products.filter(p => p.isFeatured).map(product => (
                <div key={product.id} style={{ ...styles.card, border: `2px solid ${t.accent}` }}>
                  <div style={styles.imgWrapper}>
                    {product.image
                      ? <img src={product.image} alt={product.name} style={styles.img} />
                      : <div style={styles.noImg}>📦</div>
                    }
                    <button
                      style={{ ...styles.wishlistIcon, color: wishlist.find(i => i.id === product.id) ? '#ff4d4d' : t.subText }}
                      onClick={() => toggleWishlist(product)}
                    >
                      {wishlist.find(i => i.id === product.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <div style={styles.cardBody}>
                    <p style={styles.category}>⭐ Featured — {product.category}</p>
                    <h3 style={styles.name}>{product.name}</h3>
                    {product.avgRating && (
                      <p style={styles.rating}>
                        {'★'.repeat(Math.round(product.avgRating))}{'☆'.repeat(5 - Math.round(product.avgRating))} <span style={styles.ratingCount}>({product.reviewCount})</span>
                      </p>
                    )}
                    <p style={styles.price}>{Number(product.price).toLocaleString()} RWF</p>
                    <p style={{ ...styles.stock, color: product.stock === 0 ? '#ff4d4d' : product.stock <= 5 ? '#f0a500' : '#4caf50' }}>
                      {product.stock === 0 ? '❌ Out of stock' : product.stock <= 5 ? `⚠️ Only ${product.stock} left` : `✅ In stock`}
                    </p>
                    <button
                      style={{ ...styles.btn, ...(product.stock === 0 ? styles.disabledBtn : {}) }}
                      onClick={() => product.stock !== 0 && addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
                    </button>
                    <div style={styles.iconRow}>
                      <button style={styles.iconBtn} title="Chat with Seller" onClick={() => navigate(`/chat/${product.sellerId}`)}>💬 Chat</button>
                      <button style={styles.iconBtn} title="View Seller" onClick={() => navigate(`/seller-profile/${product.sellerId}`)}>👤 Seller</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <h2 style={styles.heading}>All Products</h2>
          </>
        )}
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
                  <div style={styles.imgWrapper}>
                    {product.image
                      ? <img src={product.image} alt={product.name} style={styles.img} />
                      : <div style={styles.noImg}>📦</div>
                    }
                    <button
                      style={{ ...styles.wishlistIcon, color: wishlist.find(i => i.id === product.id) ? '#ff4d4d' : t.subText }}
                      onClick={() => toggleWishlist(product)}
                    >
                      {wishlist.find(i => i.id === product.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <div style={styles.cardBody}>
                    <p style={styles.category}>{product.category}</p>
                    <h3 style={styles.name}>{product.name}</h3>
                    {product.avgRating && (
                      <p style={styles.rating}>
                        {'★'.repeat(Math.round(product.avgRating))}{'☆'.repeat(5 - Math.round(product.avgRating))} <span style={styles.ratingCount}>({product.reviewCount})</span>
                      </p>
                    )}
                    <p style={styles.price}>{Number(product.price).toLocaleString()} RWF</p>
                    <p style={{ ...styles.stock, color: product.stock === 0 ? '#ff4d4d' : product.stock <= 5 ? '#f0a500' : '#4caf50' }}>
                      {product.stock === 0 ? '❌ Out of stock' : product.stock <= 5 ? `⚠️ Only ${product.stock} left` : `✅ In stock`}
                    </p>
                    <button
                      style={{ ...styles.btn, ...(product.stock === 0 ? styles.disabledBtn : {}) }}
                      onClick={() => product.stock !== 0 && addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
                    </button>
                    <div style={styles.iconRow}>
                      <button style={styles.iconBtn} title="Chat with Seller" onClick={() => navigate(`/chat/${product.sellerId}`)}>💬 Chat</button>
                      <button style={styles.iconBtn} title="View Seller" onClick={() => navigate(`/seller-profile/${product.sellerId}`)}>👤 Seller</button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


export default Home