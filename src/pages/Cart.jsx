import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth, theme } from '../context/AuthContext'
import emailjs from '@emailjs/browser'

function Cart() {
  const { user, darkMode } = useAuth()
  const t = darkMode ? theme.dark : theme.light
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    document.title = 'Cart — RwandaShop'
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

  const placeOrder = async () => {
    if (cart.length === 0) return
    if (!address || !phone) return alert('Please enter your delivery address and phone number')

    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const sellerIds = [...new Set(cart.map(i => i.sellerId))]
    const sellerPayments = sellerIds.map(id => {
      const seller = users.find(u => u.id === id)
      return { sellerId: id, sellerName: seller?.name, paymentMethods: seller?.paymentMethods }
    })

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

    // send email to each seller
    sellerIds.forEach(async (sellerId) => {
      const seller = users.find(u => u.id === sellerId)
      if (!seller?.email) return
      const sellerItems = cart.filter(i => i.sellerId === sellerId)
      const itemsList = sellerItems.map(i => `${i.name} x${i.qty} — ${i.price * i.qty} RWF`).join(', ')
      try {
        await emailjs.send(
          'service_vdhxxej',
          'template_0dm0hqb',
          {
            email: seller.email,
            customer_name: user.name,
            order_id: newOrder.id,
            items: itemsList,
            total: sellerItems.reduce((sum, i) => sum + i.price * i.qty, 0),
            address: address
          },
          '7Pi3rV-nmN_Bl1jvq'
        )
      } catch (e) {
        console.log('Seller email failed:', e)
      }
    })

    localStorage.setItem('cart', '[]')
    setCart([])
    alert('Order placed! Please upload payment proof in My Orders.')
    navigate('/orders')
  }

  const styles = {
    page: { backgroundColor: t.bg, minHeight: '100vh' },
    container: { padding: '30px' },
    heading: { color: t.text, marginBottom: '24px' },
    empty: { color: t.subText, textAlign: 'center', marginTop: '60px' },
    list: { display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '700px' },
    item: { backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', border: `1px solid ${t.border}` },
    img: { width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' },
    info: { flex: 1 },
    name: { color: t.text, margin: 0, fontSize: '15px' },
    price: { color: t.subText, fontSize: '13px', margin: '4px 0 0' },
    controls: { display: 'flex', alignItems: 'center', gap: '10px' },
    qtyBtn: { width: '28px', height: '28px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.inputBg, color: t.text, cursor: 'pointer', fontSize: '16px' },
    qty: { color: t.text, minWidth: '20px', textAlign: 'center' },
    subtotal: { color: t.accent, fontWeight: 'bold', minWidth: '80px', textAlign: 'right' },
    removeBtn: { backgroundColor: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '16px' },
    footer: { marginTop: '30px', maxWidth: '700px' },
    addressSection: { backgroundColor: t.cardBg, borderRadius: '12px', padding: '20px', border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' },
    addressLabel: { color: t.accent, fontWeight: 'bold', fontSize: '14px' },
    addressInput: { padding: '12px', borderRadius: '8px', border: `1px solid ${t.border}`, backgroundColor: t.inputBg, color: t.text, fontSize: '14px' },
    footerBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '700px' },
    total: { color: t.text, fontSize: '16px' },
    totalAmount: { color: t.accent, fontWeight: 'bold', fontSize: '20px' },
    orderBtn: { padding: '12px 28px', borderRadius: '8px', backgroundColor: t.accent, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }
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
                <input style={styles.addressInput} placeholder="Full address (e.g. Kigali, Gasabo, Kimironko)" value={address} onChange={e => setAddress(e.target.value)} />
                <input style={styles.addressInput} placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} />
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

export default Cart