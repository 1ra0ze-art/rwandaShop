import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

function SellerProducts() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('Electronics')
  const [editingId, setEditingId] = useState(null)
  const [stock, setStock] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [momoNumber, setMomoNumber] = useState(user.paymentMethods?.momoNumber || '')
  const [bankAccount, setBankAccount] = useState(user.paymentMethods?.bankAccount || '')
  const [bankName, setBankName] = useState(user.paymentMethods?.bankName || '')
  const [paymentSuccess, setPaymentSuccess] = useState('')

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('products') || '[]')
    setProducts(all.filter(p => p.sellerId === user.id))
  }, [])

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setImage(reader.result)
    reader.readAsDataURL(file)
  }

  const addProduct = () => {
    if (!name || !price) return setError('Name and price are required')
    const all = JSON.parse(localStorage.getItem('products') || '[]')
    if (editingId) {
      const updated = all.map(p => p.id === editingId ? { ...p, name, description, price, image, category, stock: parseInt(stock) || 0 } : p)
      localStorage.setItem('products', JSON.stringify(updated))
      setProducts(updated.filter(p => p.sellerId === user.id))
      setEditingId(null)
      setSuccess('Product updated!')
    } else {
      const newProduct = { id: Date.now(), sellerId: user.id, sellerName: user.name, name, description, price, image, category, stock: parseInt(stock) || 0 }
      all.push(newProduct)
      localStorage.setItem('products', JSON.stringify(all))
      setProducts(prev => [...prev, newProduct])
      setSuccess('Product added!')
    }
    setName(''); setDescription(''); setPrice(''); setImage('')
    setError(''); setTimeout(() => setSuccess(''), 3000)
  }

  const deleteProduct = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    const all = JSON.parse(localStorage.getItem('products') || '[]')
    const updated = all.filter(p => p.id !== id)
    localStorage.setItem('products', JSON.stringify(updated))
    setProducts(updated.filter(p => p.sellerId === user.id))
  }

  const editProduct = (p) => {
    setEditingId(p.id)
    setName(p.name)
    setDescription(p.description)
    setPrice(p.price)
    setImage(p.image)
    setCategory(p.category || 'Electronics')
    setStock(p.stock || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updatePaymentMethods = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updated = users.map(u => u.id === user.id ? { ...u, paymentMethods: { momoNumber, bankAccount, bankName } } : u)
    localStorage.setItem('users', JSON.stringify(updated))
    localStorage.setItem('currentUser', JSON.stringify({ ...user, paymentMethods: { momoNumber, bankAccount, bankName } }))
    setPaymentSuccess('Payment methods updated!')
    setTimeout(() => setPaymentSuccess(''), 3000)
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.layout}>
        <div style={styles.sidebar}>
          <p style={styles.sidebarTitle}>Seller Menu</p>
          <Link to="/seller" style={styles.sideLink}>🛒 Orders</Link>
          <Link to="/seller/products" style={{ ...styles.sideLink, ...styles.activeSideLink }}>📦 Products</Link>
          <Link to="/seller/chats" style={styles.sideLink}>💬 Chats</Link>
          <Link to="/seller/analytics" style={styles.sideLink}>📊 Analytics</Link>
        </div>
        <div style={styles.content}>
          <h2 style={styles.heading}>📦 My Products</h2>

          <div style={styles.form}>
            <h3 style={styles.subheading}>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}
            <input style={styles.input} placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} />
            <select style={styles.input} value={category} onChange={e => setCategory(e.target.value)}>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Food & Drinks</option>
              <option>Home & Living</option>
              <option>Beauty</option>
              <option>Sports</option>
              <option>Other</option>
            </select>
            <textarea style={styles.input} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
            <input style={styles.input} placeholder="Price (RWF)" type="number" value={price} onChange={e => setPrice(e.target.value)} />
            <input style={styles.input} placeholder="Stock Quantity" type="number" value={stock} onChange={e => setStock(e.target.value)} />
            <label style={styles.label}>Product Image</label>
            <input type="file" accept="image/*" onChange={handleImage} style={styles.fileInput} />
            {image && <img src={image} alt="preview" style={styles.preview} />}
            <button style={styles.btn} onClick={addProduct}>{editingId ? 'Update Product' : 'Add Product'}</button>
          </div>

          <div style={styles.form}>
            <h3 style={styles.subheading}>💳 Payment Methods</h3>
            {paymentSuccess && <p style={styles.success}>{paymentSuccess}</p>}
            <input style={styles.input} placeholder="MoMo Number" value={momoNumber} onChange={e => setMomoNumber(e.target.value)} />
            <input style={styles.input} placeholder="Bank Account Number (optional)" value={bankAccount} onChange={e => setBankAccount(e.target.value)} />
            <input style={styles.input} placeholder="Bank Name (e.g. BK, Equity)" value={bankName} onChange={e => setBankName(e.target.value)} />
            <button style={styles.btn} onClick={updatePaymentMethods}>Update Payment Methods</button>
          </div>

          <h3 style={styles.subheading}>All Products ({products.length})</h3>
          {products.length === 0 ? <p style={styles.empty}>No products yet.</p> : (
            <div style={styles.grid}>
              {products.map(p => (
                <div key={p.id} style={styles.card}>
                  {p.image && <img src={p.image} alt={p.name} style={styles.img} />}
                  <h4 style={styles.name}>{p.name}</h4>
                  <p style={styles.desc}>{p.description}</p>
                  <p style={styles.price}>{p.price} RWF</p>
                  <button style={styles.editBtn} onClick={() => editProduct(p)}>Edit</button>
                  <button style={styles.deleteBtn} onClick={() => deleteProduct(p.id)}>Delete</button>
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
  subheading: { color: '#ccc', marginBottom: '16px' },
  form: { backgroundColor: '#1a1a1a', padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px', marginBottom: '32px', border: '1px solid #2a2a2a' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', fontSize: '14px', resize: 'vertical' },
  label: { color: '#aaa', fontSize: '13px' },
  fileInput: { color: '#aaa', fontSize: '13px' },
  preview: { width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' },
  btn: { padding: '12px', borderRadius: '8px', backgroundColor: '#6c63ff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: '#ff4d4d', fontSize: '13px' },
  success: { color: '#4caf50', fontSize: '13px' },
  empty: { color: '#aaa' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid #2a2a2a' },
  img: { width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' },
  name: { color: '#fff', margin: 0 },
  desc: { color: '#aaa', fontSize: '13px', margin: 0 },
  price: { color: '#6c63ff', fontWeight: 'bold', margin: 0 },
  editBtn: { padding: '8px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid #6c63ff', color: '#6c63ff', cursor: 'pointer' },
  deleteBtn: { padding: '8px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', cursor: 'pointer' }
}

export default SellerProducts