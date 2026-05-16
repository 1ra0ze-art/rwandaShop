import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('currentUser')
    return saved ? JSON.parse(saved) : null
  })

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') !== 'false'
  })

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      localStorage.setItem('darkMode', !prev)
      return !prev
    })
  }

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) return { success: false, message: 'Wrong email or password' }
    if (found.suspended) return { success: false, message: 'Your account has been suspended. Contact support.' }
    if (found.role === 'seller' && !found.approved) return { success: false, message: 'Your seller account is pending approval from admin.' }
    if (found.role === 'seller' && found.rejected) return { success: false, message: 'Your seller account was rejected.' }
    setUser(found)
    localStorage.setItem('currentUser', JSON.stringify(found))
    return { success: true, role: found.role }
  }

  const register = (name, email, password, role, paymentMethods = null) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const exists = users.find(u => u.email === email)
    if (exists) return { success: false, message: 'Email already registered' }

    const newUser = { id: Date.now(), name, email, password, role, paymentMethods }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    setUser(newUser)
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    return { success: true, role }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export const theme = {
  dark: {
    bg: '#0f0f0f', cardBg: '#1a1a1a', border: '#2a2a2a', text: '#fff',
    subText: '#aaa', inputBg: '#2a2a2a', navBg: '#111', accent: '#6c63ff'
  },
  light: {
    bg: '#f0f2f5', cardBg: '#fff', border: '#e0e0e0', text: '#111',
    subText: '#666', inputBg: '#f5f5f5', navBg: '#fff', accent: '#6c63ff'
  }
}