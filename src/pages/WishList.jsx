import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth, theme } from '../context/AuthContext'

function Wishlist() {
  const { user, darkMode } = useAuth()
const t = darkMode ? theme.dark : theme.light
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    setWishlist(JSON.parse(localStorage.getItem('wishlist') || '[]'))
  }, [])

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(i => i.id !== id)
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
  }

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(i => i.id === product.id)
    if (existing) existing.qty += 1
    else cart.push({ ...product, qty: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart!')
  }

  const styles = {
  page: { backgroundColor: t.bg, minHeight: '100vh' },
  container: { padding: '30px' },
  heading: { color: t.text, marginBottom: '24px' },
  empty: { color: t.subText, textAlign: 'center', marginTop: '60px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  card: { backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', border: `1px solid ${t.border}` },
  img: { width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' },
  name: { color: t.text, fontSize: '16px', margin: 0 },
  desc: { color: t.subText, fontSize: '13px', margin: 0 },
  price: { color: t.accent, fontWeight: 'bold', fontSize: '15px', margin: 0 },
  cartBtn: { padding: '10px', borderRadius: '8px', backgroundColor: t.accent, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  removeBtn: { padding: '10px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', cursor: 'pointer' }
}

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>❤️ My Wishlist</h2>
        {wishlist.length === 0 ? (
          <p style={styles.empty}>Your wishlist is empty.</p>
        ) : (
          <div style={styles.grid}>
            {wishlist.map(product => (
              <div key={product.id} style={styles.card}>
                {product.image && <img src={product.image} alt={product.name} style={styles.img} />}
                <h3 style={styles.name}>{product.name}</h3>
                <p style={styles.desc}>{product.description}</p>
                <p style={styles.price}>{product.price} RWF</p>
                <button style={styles.cartBtn} onClick={() => addToCart(product)}>Add to Cart</button>
                <button style={styles.removeBtn} onClick={() => removeFromWishlist(product.id)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



export default Wishlist