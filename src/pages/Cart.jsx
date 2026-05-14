import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

function Cart() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'))
  }, [])

  const updateQty = (id, qty) => {
    if (qty < 1) return
    const updated = cart.map(i => i.id === id ? { ...i, qty } : i)
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const remove = (id) => {
    const updated = cart.filter(i => i.id !== id)
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

 const placeOrder = () => {
    if (cart.length === 0) return
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const sellerIds = [...new Set(cart.map(i => i.sellerId))]
    const sellerPayments = sellerIds.map(id => {
      const seller = users.find(u => u.id === id)
      return { sellerId: id, sellerName: seller?.name, paymentMethods: seller?.paymentMethods }
    })

    if (!address || !phone) return alert('Please enter your delivery address and phone number')

    const newOrder = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      items: cart,
      total,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentProof: null,
      deliveryStatus: 'not shipped',
      deliveryInfo: null,
      sellerPayments,
      paymentMethod: null,
      deliveryAddress: address,
      deliveryPhone: phone,
      createdAt: new Date().toLocaleString()
    }
    orders.push(newOrder)
    localStorage.setItem('orders', JSON.stringify(orders))
    // reduce stock
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]')
    const updatedProducts = allProducts.map(p => {
      const cartItem = cart.find(i => i.id === p.id)
      if (cartItem) return { ...p, stock: Math.max(0, (p.stock || 0) - cartItem.qty) }
      return p
    })
    localStorage.setItem('products', JSON.stringify(updatedProducts))
    localStorage.setItem('cart', '[]')
    setCart([])
    alert('Order placed! Please upload payment proof in My Orders.')
    navigate('/orders')
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>My Cart</h2>
        {cart.length === 0 ? (
          <p style={styles.empty}>Your cart is empty.</p>
        ) : (
          <>
            <div style={styles.list}>
              {cart.map(item => (
                <div key={item.id} style={styles.item}>
                  {item.image && <img src={item.image} alt={item.name} style={styles.img} />}
                  <div style={styles.info}>
                    <h4 style={styles.name}>{item.name}</h4>
                    <p style={styles.price}>{item.price} RWF</p>
                  </div>
                  <div style={styles.controls}>
                    <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                    <span style={styles.qty}>{item.qty}</span>
                    <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <p style={styles.subtotal}>{item.price * item.qty} RWF</p>
                  <button style={styles.removeBtn} onClick={() => remove(item.id)}>✕</button>
                </div>
              ))}
            </div>
           <div style={styles.footer}>
              <div style={styles.addressSection}>
                <p style={styles.addressLabel}>📍 Delivery Details</p>
                <input
                  style={styles.addressInput}
                  placeholder="Full address (e.g. Kigali, Gasabo, Kimironko)"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
                <input
                  style={styles.addressInput}
                  placeholder="Phone number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
              <div style={styles.footerBottom}>
                <p style={styles.total}>Total: <span style={styles.totalAmount}>{total} RWF</span></p>
                <button style={styles.orderBtn} onClick={placeOrder}>Place Order</button>
              </div>
            </div>
          </>
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
  list: { display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '700px' },
  item: { backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #2a2a2a' },
  img: { width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' },
  info: { flex: 1 },
  name: { color: '#fff', margin: 0, fontSize: '15px' },
  price: { color: '#aaa', fontSize: '13px', margin: '4px 0 0' },
  controls: { display: 'flex', alignItems: 'center', gap: '10px' },
  qtyBtn: { width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: '#fff', cursor: 'pointer', fontSize: '16px' },
  qty: { color: '#fff', minWidth: '20px', textAlign: 'center' },
  subtotal: { color: '#6c63ff', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' },
  removeBtn: { backgroundColor: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '16px' },
  footer: { marginTop: '30px', maxWidth: '700px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  total: { color: '#ccc', fontSize: '16px' },
  totalAmount: { color: '#6c63ff', fontWeight: 'bold', fontSize: '20px' },
  orderBtn: { padding: '12px 28px', borderRadius: '8px', backgroundColor: '#6c63ff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
  addressSection: { backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '20px', border: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '700px', marginBottom: '20px' },
  addressLabel: { color: '#6c63ff', fontWeight: 'bold', fontSize: '14px' },
  addressInput: { padding: '12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', fontSize: '14px' },
  footerBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '700px' }
}

export default Cart