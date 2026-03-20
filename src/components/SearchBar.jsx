import React, { useState } from 'react'

export default function SearchBar({ onSearch, onReset, loading }) {
  const [subject,  setSubject]  = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo,   setDateTo]   = useState('')
  const [open,     setOpen]     = useState(false)

  const hasFilters = subject || dateFrom || dateTo

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch({
      subject:  subject  || undefined,
      dateFrom: dateFrom || undefined,
      dateTo:   dateTo   || undefined,
    })
  }

  const handleReset = () => {
    setSubject(''); setDateFrom(''); setDateTo('')
    onReset()
  }

  return (
    <div className="bg-ink-800 border border-ink-700 rounded-2xl p-4">
      <form onSubmit={handleSubmit}>

        {/* ── main row ──────────────────────────────────────────────────────── */}
        <div className="flex gap-2 items-center">
          {/* subject input */}
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
              placeholder="Search by subject…"
              className="w-full bg-ink-900 border border-ink-600 focus:border-gold-DEFAULT rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-ink-500 outline-none transition-colors"
            />
          </div>

          {/* filter toggle */}
          <button
            type="button" onClick={() => setOpen((v) => !v)}
            title="Toggle date filters"
            className={[
              'flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium border transition-all',
              open
                ? 'bg-gold-DEFAULT/10 border-gold-DEFAULT/40 text-gold-DEFAULT'
                : 'bg-ink-700 border-ink-600 text-ink-400 hover:text-white hover:border-ink-500',
            ].join(' ')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
            </svg>
            <span className="hidden sm:inline">Filters</span>
            {(dateFrom || dateTo) && <span className="w-1.5 h-1.5 rounded-full bg-gold-DEFAULT" />}
          </button>

          {/* search button */}
          <button
            type="submit" disabled={loading}
            className="bg-gold-DEFAULT hover:bg-gold-dark disabled:opacity-50 text-ink-950 font-bold text-sm px-5 py-2.5 rounded-xl transition-all whitespace-nowrap"
          >
            {loading ? 'Searching…' : 'Search'}
          </button>

          {/* reset */}
          {hasFilters && (
            <button type="button" onClick={handleReset} title="Clear filters"
              className="p-2.5 text-ink-500 hover:text-ruby-light transition-colors rounded-xl hover:bg-ruby-DEFAULT/10">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        {/* ── date row (collapsible) ─────────────────────────────────────────── */}
        {open && (
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-ink-700 animate-fade-in">
            <div>
              <label className="block text-xs font-mono text-ink-500 uppercase tracking-widest mb-1.5">From</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-ink-900 border border-ink-600 focus:border-gold-DEFAULT rounded-xl px-3 py-2 text-white text-sm outline-none transition-colors [color-scheme:dark]"/>
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-500 uppercase tracking-widest mb-1.5">To</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-ink-900 border border-ink-600 focus:border-gold-DEFAULT rounded-xl px-3 py-2 text-white text-sm outline-none transition-colors [color-scheme:dark]"/>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
