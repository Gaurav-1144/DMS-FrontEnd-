import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

// ✅ Field moved OUTSIDE main component
function Field({ name, label, type = 'text', placeholder, icon, extra, form, set, fieldErrors }) {
  return (
    <div>
      <label className="block text-xs font-mono text-ink-500 uppercase tracking-widest mb-1.5">{label}</label>
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon}/>
        </svg>
        <input
          type={type}
          value={form[name]}
          onChange={set(name)}
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
}

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
              name="fullName"
              label="Full Name"
              placeholder="Jane Smith"
              icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              form={form} set={set} fieldErrors={fieldErrors}
            />
            <Field
              name="username"
              label="Username"
              placeholder="janedoe"
              icon="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
              form={form} set={set} fieldErrors={fieldErrors}
            />
            <Field
              name="email"
              label="Email"
              type="email"
              placeholder="jane@example.com"
              icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              form={form} set={set} fieldErrors={fieldErrors}
            />

            {/* password */}
            <div>
              <label className="block text-xs font-mono text-ink-500 uppercase tracking-widest mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 6 characters"
                  className={`w-full bg-ink-900 border rounded-xl pl-10 pr-11 py-2.5 text-white text-sm placeholder-ink-500 outline-none transition-colors ${
                    fieldErrors.password ? 'border-ruby-DEFAULT' : 'border-ink-600 focus:border-gold-DEFAULT'
                  }`}
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 hover:text-white transition-colors">
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
              {fieldErrors.password && <p className="text-ruby-light text-xs font-mono mt-1">{fieldErrors.password}</p>}
            </div>

            {/* confirm password */}
            <div>
              <label className="block text-xs font-mono text-ink-500 uppercase tracking-widest mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={set('confirm')}
                  placeholder="Repeat password"
                  className={`w-full bg-ink-900 border rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-ink-500 outline-none transition-colors ${
                    fieldErrors.confirm ? 'border-ruby-DEFAULT' : 'border-ink-600 focus:border-gold-DEFAULT'
                  }`}
                />
              </div>
              {fieldErrors.confirm && <p className="text-ruby-light text-xs font-mono mt-1">{fieldErrors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gold-DEFAULT hover:bg-gold-dark disabled:opacity-60 disabled:cursor-not-allowed text-ink-950 font-bold text-sm rounded-xl py-3 mt-2 transition-all shadow-lg shadow-gold-DEFAULT/20">
              {loading ? 'Creating account…' : 'Create Account'}
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
