import React from 'react'
import DocumentCard from './DocumentCard'

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="bg-ink-800 border border-ink-700 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-ink-700 shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 bg-ink-700 rounded-lg w-3/5" />
          <div className="h-3 bg-ink-700 rounded w-2/5" />
          <div className="flex gap-4 mt-1">
            <div className="h-3 bg-ink-700 rounded w-20" />
            <div className="h-3 bg-ink-700 rounded w-28" />
            <div className="h-3 bg-ink-700 rounded w-14" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-ink-700">
        <div className="h-7 bg-ink-700 rounded-lg w-16" />
        <div className="h-7 bg-ink-700 rounded-lg w-22" />
      </div>
    </div>
  )
}

/* ── Empty state ──────────────────────────────────────────────────────────── */
function Empty({ hasFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center col-span-2">
      <div className="w-16 h-16 rounded-2xl bg-ink-800 border border-ink-700 flex items-center justify-center mb-5">
        <svg className="w-7 h-7 text-ink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      <p className="font-display font-bold text-xl text-white">
        {hasFilters ? 'No results found' : 'No documents yet'}
      </p>
      <p className="text-ink-500 text-sm mt-2 font-mono max-w-xs leading-relaxed">
        {hasFilters
          ? 'Try adjusting your search or clearing the filters.'
          : 'Click "Upload" to add your first document.'}
      </p>
    </div>
  )
}

/* ── DocumentList ─────────────────────────────────────────────────────────── */
export default function DocumentList({ documents, loading, onDelete, hasFilters }) {
  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)}
      </div>
    )
  }

  if (!documents.length) {
    return (
      <div className="grid lg:grid-cols-2">
        <Empty hasFilters={hasFilters} />
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} doc={doc} onDelete={onDelete} />
      ))}
    </div>
  )
}
