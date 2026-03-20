import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'dms_token'
const USER_KEY  = 'dms_user'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user,  setUser]  = useState(() => {
    const saved = localStorage.getItem(USER_KEY)
    try { return saved ? JSON.parse(saved) : null } catch { return null }
  })

  const login = useCallback((authResponse) => {
    localStorage.setItem(TOKEN_KEY, authResponse.token)
    localStorage.setItem(USER_KEY,  JSON.stringify({
      username: authResponse.username,
      email:    authResponse.email,
      fullName: authResponse.fullName,
      userId:   authResponse.userId,
    }))
    setToken(authResponse.token)
    setUser({
      username: authResponse.username,
      email:    authResponse.email,
      fullName: authResponse.fullName,
      userId:   authResponse.userId,
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
