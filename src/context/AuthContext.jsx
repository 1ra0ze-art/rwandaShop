import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('currentUser')
    return saved ? JSON.parse(saved) : null
  })

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (found) {
      setUser(found)
      localStorage.setItem('currentUser', JSON.stringify(found))
      return { success: true, role: found.role }
    }
    return { success: false }
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
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}