import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

export default function RegisterPage() {
  const [form,    setForm]    = useState({ fullName: '', username: '', email: '', password: '', confirm: '' })
  const [showPw,  setShowPw]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const { login } = useAuth()
  const navigate  = useNavigate()

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setFieldErrors(fe => ({ ...fe, [field]: '' }))
    setError('')
  }

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim())         errs.fullName = 'Full name is required.'
    if (form.username.trim().length < 3) errs.username = 'Username must be at least 3 characters.'
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (form.password.length < 6)      errs.password = 'Password must be at least 6 characters.'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match.'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setError('')
    setLoading(true)
    try {
      const data = await authService.register(
        form.username.trim(), form.email.trim().toLowerCase(),
        form.password, form.fullName.trim()
      )
      login(data)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ name, label, type = 'text', placeholder, icon, extra }) => (
    <div>
      <label className="block text-xs font-mono text-ink-500 uppercase tracking-widest mb-1.5">{label}</label>
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon}/>
        </svg>
        <input
          type={type} value={form[name]} onChange={set(name)}
          placeholder={placeholder}
          className={`w-full bg-ink-900 border rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-ink-500 outline-none transition-colors ${
            fieldErrors[name] ? 'border-ruby-DEFAULT' : 'border-ink-600 focus:border-gold-DEFAULT'
          }`}
        />
        {extra}
      </div>
      {fieldErrors[name] && (
        <p className="text-ruby-light text-xs font-mono mt-1">{fieldErrors[name]}</p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-60 -right-60 w-[500px] h-[500px] rounded-full bg-gold-DEFAULT/[0.04] blur-[120px]" />
        <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] rounded-full bg-jade-DEFAULT/[0.03] blur-[120px]" />
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
            <h2 className="font-display font-bold text-xl text-white">Create account</h2>
            <p className="text-ink-500 text-sm mt-1">Fill in the details below to get started</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 bg-ruby-DEFAULT/10 border border-ruby-DEFAULT/30 rounded-xl px-4 py-3 animate-fade-in">
              <svg className="w-4 h-4 text-ruby-light shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p className="text-ruby-light text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              name="fullName" label="Full Name" placeholder="Jane Smith"
              icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
            <Field
              name="username" label="Username" placeholder="janedoe"
              icon="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <Field
              name="email" label="Email" type="email" placeholder="jane@example.com"
              icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />

            {/* password with toggle */}
            <div>
              <label className="block text-xs font-mono text-ink-500 uppercase tracking-widest mb-1.5">Password</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <input
                  type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={set('password')} placeholder="Min. 6 characters"
                  className={`w-full bg-ink-900 border rounded-xl pl-10 pr-11 py-2.5 text-white text-sm placeholder-ink-500 outline-none transition-colors ${
                    fieldErrors.password ? 'border-ruby-DEFAULT' : 'border-ink-600 focus:border-gold-DEFAULT'}`}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {showPw
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
                    }
                  </svg>
                </button>
              </div>
              {fieldErrors.password && <p className="text-ruby-light text-xs font-mono mt-1">{fieldErrors.password}</p>}
            </div>

            {/* confirm password */}
            <div>
              <label className="block text-xs font-mono text-ink-500 uppercase tracking-widest mb-1.5">Confirm Password</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <input
                  type={showPw ? 'text' : 'password'} value={form.confirm}
                  onChange={set('confirm')} placeholder="Repeat password"
                  className={`w-full bg-ink-900 border rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-ink-500 outline-none transition-colors ${
                    fieldErrors.confirm ? 'border-ruby-DEFAULT' : 'border-ink-600 focus:border-gold-DEFAULT'}`}
                />
              </div>
              {fieldErrors.confirm && <p className="text-ruby-light text-xs font-mono mt-1">{fieldErrors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gold-DEFAULT hover:bg-gold-dark disabled:opacity-60 disabled:cursor-not-allowed text-ink-950 font-bold text-sm rounded-xl py-3 mt-2 transition-all shadow-lg shadow-gold-DEFAULT/20">
              {loading
                ? <><Spinner /> Creating account…</>
                : <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                    </svg>
                    Create Account
                  </>
              }
            </button>
          </form>

          <p className="text-center text-ink-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-DEFAULT hover:text-gold-light font-semibold transition-colors">
              Sign in
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
