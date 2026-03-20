import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authService.login(username.trim(), password)
      login(data)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-60 -left-60 w-[500px] h-[500px] rounded-full bg-gold-DEFAULT/[0.04] blur-[120px]" />
        <div className="absolute -bottom-60 -right-60 w-[500px] h-[500px] rounded-full bg-cobalt-DEFAULT/[0.04] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        {/* logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gold-DEFAULT rounded-2xl flex items-center justify-center shadow-xl shadow-gold-DEFAULT/25 mb-4">
            <svg className="w-7 h-7 text-ink-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h1 className="font-display font-bold text-3xl text-white tracking-tight">DocVault</h1>
          <p className="text-ink-500 text-sm font-mono mt-1">Document Management System</p>
        </div>

        {/* card */}
        <div className="bg-ink-800 border border-ink-700 rounded-2xl p-8 shadow-2xl shadow-black/40">
          <div className="mb-6">
            <h2 className="font-display font-bold text-xl text-white">Welcome back</h2>
            <p className="text-ink-500 text-sm mt-1">Sign in to your account to continue</p>
          </div>

          {/* error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-ruby-DEFAULT/10 border border-ruby-DEFAULT/30 rounded-xl px-4 py-3 animate-fade-in">
              <svg className="w-4 h-4 text-ruby-light shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p className="text-ruby-light text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* username */}
            <div>
              <label className="block text-xs font-mono text-ink-500 uppercase tracking-widest mb-1.5">Username</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <input
                  type="text" required autoFocus
                  value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="your username"
                  className="w-full bg-ink-900 border border-ink-600 focus:border-gold-DEFAULT rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-ink-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* password */}
            <div>
              <label className="block text-xs font-mono text-ink-500 uppercase tracking-widest mb-1.5">Password</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <input
                  type={showPw ? 'text' : 'password'} required
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-ink-900 border border-ink-600 focus:border-gold-DEFAULT rounded-xl pl-10 pr-11 py-3 text-white text-sm placeholder-ink-500 outline-none transition-colors"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 hover:text-white transition-colors">
                  {showPw
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* submit */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gold-DEFAULT hover:bg-gold-dark disabled:opacity-60 disabled:cursor-not-allowed text-ink-950 font-bold text-sm rounded-xl py-3 mt-2 transition-all shadow-lg shadow-gold-DEFAULT/20">
              {loading
                ? <><Spinner /> Signing in…</>
                : <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                    </svg>
                    Sign In
                  </>
              }
            </button>
          </form>

          {/* register link */}
          <p className="text-center text-ink-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold-DEFAULT hover:text-gold-light font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  )
}
