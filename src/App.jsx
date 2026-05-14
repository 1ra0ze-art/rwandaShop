import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Notifications from './pages/Notifications'
import SellerDashboard from './pages/SellerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import SellerProducts from './pages/SellerProducts'
import Chat from './pages/Chat'
import SellerChats from './pages/SellerChats'
import SellerAnalytics from './pages/SellerAnalytics'
import SellerProfile from './pages/SellerProfile'
import Wishlist from './pages/Wishlist'
import NotFound from './pages/NotFound'
import EditProfile from './pages/EditProfile'
import ForgotPassword from './pages/ForgotPassword'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cart" element={<ProtectedRoute role="user"><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute role="user"><Orders /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute role="user"><Notifications /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute role="user"><Wishlist /></ProtectedRoute>} />
          <Route path="/chat/:sellerId" element={<ProtectedRoute role="user"><Chat /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/seller" element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />
          <Route path="/seller/products" element={<ProtectedRoute role="seller"><SellerProducts /></ProtectedRoute>} />
          <Route path="/seller/chats" element={<ProtectedRoute role="seller"><SellerChats /></ProtectedRoute>} />
          <Route path="/seller/analytics" element={<ProtectedRoute role="seller"><SellerAnalytics /></ProtectedRoute>} />
          <Route path="/seller-profile/:sellerId" element={<SellerProfile />} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App