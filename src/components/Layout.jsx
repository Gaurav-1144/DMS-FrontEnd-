import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
    : user?.username?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="min-h-screen bg-ink-950 text-white font-sans">
      {/* ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-80 -right-80 w-[700px] h-[700px] rounded-full bg-gold-DEFAULT/[0.025] blur-[140px]" />
        <div className="absolute -bottom-80 -left-80 w-[600px] h-[600px] rounded-full bg-cobalt-DEFAULT/[0.03] blur-[140px]" />
      </div>

      {/* navbar */}
      <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">

          {/* logo */}
          <NavLink to="/" className="flex items-center gap-2 shrink-0 group mr-2">
            <div className="w-7 h-7 bg-gold-DEFAULT rounded-lg flex items-center justify-center shadow-md shadow-gold-DEFAULT/20 group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 text-ink-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">NIC : DOCUMENT MANAGEMENT SYSTEM </span>
          </NavLink>

          {/* nav */}
          <nav className="flex items-center gap-1 flex-1">
            <NavLink to="/" end className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'bg-ink-700 text-white' : 'text-ink-400 hover:text-white hover:bg-ink-800'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
              Documents
            </NavLink>
            <NavLink to="/upload" className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gold-DEFAULT text-ink-950 font-bold shadow-md shadow-gold-DEFAULT/20'
                  : 'bg-gold-DEFAULT/10 text-gold-DEFAULT border border-gold-DEFAULT/30 hover:bg-gold-DEFAULT hover:text-ink-950 hover:border-transparent hover:font-bold'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              Upload
            </NavLink>
          </nav>

          {/* user menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setDropOpen(v => !v)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-ink-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gold-DEFAULT/20 border border-gold-DEFAULT/30 flex items-center justify-center">
                <span className="text-gold-DEFAULT font-bold text-xs font-mono">{initials}</span>
              </div>
              <span className="text-sm text-ink-300 font-medium hidden sm:block">{user?.fullName || user?.username}</span>
              <svg className={`w-3.5 h-3.5 text-ink-500 transition-transform ${dropOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {dropOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-ink-800 border border-ink-700 rounded-xl shadow-2xl py-1 animate-scale-in z-50"
                onMouseLeave={() => setDropOpen(false)}>
                <div className="px-3 py-2 border-b border-ink-700 mb-1">
                  <p className="text-white text-sm font-medium truncate">{user?.fullName}</p>
                  <p className="text-ink-500 text-xs font-mono truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ruby-light hover:bg-ruby-DEFAULT/10 transition-colors text-left"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>

      <footer className="relative border-t border-ink-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center">
          <p className="text-ink-600 text-xs font-mono">DocVault · React + Vite · Spring Boot · JWT · PostgreSQL</p>
        </div>
      </footer>
    </div>
  )
}
