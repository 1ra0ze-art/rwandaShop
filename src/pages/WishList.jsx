import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

useEffect(() => { document.title = 'Wishlist — RwandaShop' }, [])

function Wishlist() {
  const { user } = useAuth()
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

const styles = {
  page: { backgroundColor: '#0f0f0f', minHeight: '100vh' },
  container: { padding: '30px' },
  heading: { color: '#fff', marginBottom: '24px' },
  empty: { color: '#aaa', textAlign: 'center', marginTop: '60px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid #2a2a2a' },
  img: { width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' },
  name: { color: '#fff', fontSize: '16px', margin: 0 },
  desc: { color: '#aaa', fontSize: '13px', margin: 0 },
  price: { color: '#6c63ff', fontWeight: 'bold', fontSize: '15px', margin: 0 },
  cartBtn: { padding: '10px', borderRadius: '8px', backgroundColor: '#6c63ff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  removeBtn: { padding: '10px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', cursor: 'pointer' }
}

export default Wishlist