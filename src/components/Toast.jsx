import React, { useCallback, useEffect, useRef, useState } from 'react'

/* ── Individual toast ─────────────────────────────────────────────────────── */
function Toast({ id, message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(() => onClose(id), 4000)
    return () => clearTimeout(t)
  }, [id, onClose])

  const cfg = {
    success: { bar: 'bg-jade-DEFAULT',   icon: 'text-jade-light',   bg: 'bg-jade-DEFAULT/10  border-jade-DEFAULT/30'  },
    error:   { bar: 'bg-ruby-DEFAULT',   icon: 'text-ruby-light',   bg: 'bg-ruby-DEFAULT/10  border-ruby-DEFAULT/30'  },
    info:    { bar: 'bg-gold-DEFAULT',   icon: 'text-gold-light',   bg: 'bg-gold-DEFAULT/10  border-gold-DEFAULT/30'  },
  }[type] ?? {}

  const paths = {
    success: 'M5 13l4 4L19 7',
    error:   'M6 18L18 6M6 6l12 12',
    info:    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  }

  return (
    <div className={`relative flex items-start gap-3 border rounded-xl px-4 py-3 shadow-2xl overflow-hidden max-w-sm w-full animate-slide-up ${cfg.bg}`}>
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${cfg.bar}`} />
      <svg className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={paths[type]} />
      </svg>
      <p className="text-sm text-white/90 leading-snug flex-1">{message}</p>
      <button onClick={() => onClose(id)} className="shrink-0 text-ink-500 hover:text-white transition-colors mt-0.5">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

/* ── Container ────────────────────────────────────────────────────────────── */
export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast {...t} onClose={onRemove} />
        </div>
      ))}
    </div>
  )
}

/* ── useToast hook ────────────────────────────────────────────────────────── */
let _id = 0
export function useToast() {
  const [toasts, setToasts] = useState([])

  const add = useCallback((message, type = 'success') => {
    const id = ++_id
    setToasts((p) => [...p, { id, message, type }])
  }, [])

  const remove = useCallback((id) => {
    setToasts((p) => p.filter((t) => t.id !== id))
  }, [])

  return { toasts, add, remove }
}
