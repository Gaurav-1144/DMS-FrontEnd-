import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocuments } from '../hooks/useDocuments'
import { useToast, ToastContainer } from '../components/Toast'
import SearchBar    from '../components/SearchBar'
import DocumentList from '../components/DocumentList'
import StatsBar     from '../components/StatsBar'

export default function DocumentsPage() {
  const [hasFilters, setHasFilters] = useState(false)
  const { toasts, add: addToast, remove: removeToast } = useToast()
  const { documents, loading, error, fetchAll, search, remove } = useDocuments()

  const handleSearch = useCallback((filters) => {
    const active = !!(filters.subject || filters.dateFrom || filters.dateTo)
    setHasFilters(active)
    active ? search(filters) : fetchAll()
  }, [search, fetchAll])

  const handleReset = useCallback(() => {
    setHasFilters(false)
    fetchAll()
  }, [fetchAll])

  const handleDelete = useCallback(async (id) => {
    const { ok, message } = await remove(id)
    ok
      ? addToast('Document deleted.', 'info')
      : addToast(message || 'Failed to delete document.', 'error')
  }, [remove, addToast])

  return (
    <>
      {/* ── page header ───────────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-white tracking-tight">Documents</h1>
          <p className="text-ink-500 text-xs font-mono mt-1">
            {loading
              ? 'Loading…'
              : `${documents.length} document${documents.length !== 1 ? 's' : ''} stored`}
            {hasFilters && <span className="text-gold-DEFAULT ml-2">· filtered</span>}
          </p>
        </div>

        <Link
          to="/upload"
          className="flex items-center gap-2 bg-gold-DEFAULT hover:bg-gold-dark text-ink-950 font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-gold-DEFAULT/20 hover:shadow-gold-DEFAULT/30 hover:-translate-y-0.5 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Upload Document
        </Link>
      </div>

      {/* ── stats ─────────────────────────────────────────────────────── */}
      {!loading && documents.length > 0 && (
        <div className="mb-5 animate-fade-in">
          <StatsBar documents={documents} />
        </div>
      )}

      {/* ── error banner ──────────────────────────────────────────────── */}
      {error && (
        <div className="mb-5 bg-ruby-DEFAULT/10 border border-ruby-DEFAULT/30 rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in">
          <svg className="w-4 h-4 text-ruby-light shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className="text-ruby-light text-sm font-mono flex-1">{error}</p>
          <button onClick={fetchAll} className="text-xs text-ruby-light hover:text-white underline">Retry</button>
        </div>
      )}

      {/* ── search bar ────────────────────────────────────────────────── */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} onReset={handleReset} loading={loading} />
      </div>

      {/* ── document grid ─────────────────────────────────────────────── */}
      <DocumentList
        documents={documents}
        loading={loading}
        onDelete={handleDelete}
        hasFilters={hasFilters}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
