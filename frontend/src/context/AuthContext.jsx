import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const saveAuth = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const signup = async (name, email, password) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/signup', { name, email, password })
      saveAuth(res.data.token, res.data.user)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Signup failed' }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      saveAuth(res.data.token, res.data.user)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = useCallback(async () => {
    try {
      const res = await api.get('/profile/me')
      const updated = res.data.user
      localStorage.setItem('user', JSON.stringify(updated))
      setUser(updated)
    } catch {
      // ignore
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, refreshProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
