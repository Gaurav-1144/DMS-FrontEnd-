import React, { useState } from 'react'
import { formatDate, formatDateTime, formatFileSize, fileTypeInfo } from '../utils/helpers'
import documentService from '../services/documentService'

const BADGE = {
  ruby:   'bg-ruby-DEFAULT/15   text-ruby-light   border-ruby-DEFAULT/30',
  cobalt: 'bg-cobalt-DEFAULT/15 text-cobalt-light  border-cobalt-DEFAULT/30',
  jade:   'bg-jade-DEFAULT/15   text-jade-light    border-jade-DEFAULT/30',
  gray:   'bg-ink-600/20        text-ink-400       border-ink-600/40',
}

export default function DocumentCard({ doc, onDelete }) {
  const [confirmDel, setConfirmDel] = useState(false)
  const [deleting,   setDeleting]   = useState(false)

  const { label, colorKey } = fileTypeInfo(doc.fileType)
  const badge = BADGE[colorKey] ?? BADGE.gray

  /* ── actions ──────────────────────────────────────────────────────────── */
  const handleDownload = () => {
    const a = Object.assign(document.createElement('a'), {
      href:     documentService.downloadUrl(doc.id),
      download: doc.originalFileName || doc.fileName,
    })
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const handleView = () =>
    window.open(documentService.viewUrl(doc.id), '_blank', 'noopener,noreferrer')

  const handleDelete = async () => {
    if (!confirmDel) { setConfirmDel(true); return }
    setDeleting(true)
    await onDelete(doc.id)
    setDeleting(false)
    setConfirmDel(false)
  }

  return (
    <article className="group bg-ink-800 hover:bg-ink-700/60 border border-ink-700 hover:border-ink-600 rounded-2xl p-5 transition-all duration-200 animate-fade-in">

      {/* ── top row ───────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-4">
        {/* type badge */}
        <div className={`shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center font-mono font-bold text-xs tracking-wider ${badge}`}>
          {label}
        </div>

        {/* meta */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-white text-sm leading-snug truncate" title={doc.subject}>
            {doc.subject}
          </h3>
          <p className="text-ink-500 font-mono text-xs mt-0.5 truncate" title={doc.originalFileName}>
            {doc.originalFileName || doc.fileName}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
            <Meta label="Doc date"  value={formatDate(doc.documentDate)} />
            <Meta label="Uploaded"  value={formatDateTime(doc.createdAt)} />
            <Meta label="Size"      value={formatFileSize(doc.fileSize)} />
          </div>
        </div>
      </div>

      {/* ── action bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 mt-4 pt-4 border-t border-ink-700">
        <Btn onClick={handleView}     icon="eye"      label="View"     cls="hover:text-gold-DEFAULT   hover:bg-gold-DEFAULT/10" />
        <Btn onClick={handleDownload} icon="download" label="Download" cls="hover:text-jade-light     hover:bg-jade-DEFAULT/10" />

        <div className="flex-1" />

        {confirmDel ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-ruby-light">Delete this document?</span>
            <button onClick={() => setConfirmDel(false)}
              className="text-xs text-ink-500 hover:text-white px-2 py-1 rounded transition-colors">
              Cancel
            </button>
            <button onClick={handleDelete} disabled={deleting}
              className="text-xs text-ruby-light hover:text-white bg-ruby-DEFAULT/15 hover:bg-ruby-DEFAULT px-2.5 py-1 rounded-lg transition-all disabled:opacity-50">
              {deleting ? 'Deleting…' : 'Confirm'}
            </button>
          </div>
        ) : (
          <Btn onClick={handleDelete} icon="trash" label="Delete" cls="text-ink-500 hover:text-ruby-light hover:bg-ruby-DEFAULT/10" />
        )}
      </div>
    </article>
  )
}

/* ── tiny helpers ─────────────────────────────────────────────────────────── */
function Meta({ label, value }) {
  return (
    <span className="flex items-center gap-1 text-xs font-mono">
      <span className="text-ink-600">{label}:</span>
      <span className="text-ink-400">{value}</span>
    </span>
  )
}

const ICON_PATHS = {
  eye:      ['M15 12a3 3 0 11-6 0 3 3 0 016 0z', 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'],
  download: ['M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'],
  trash:    ['M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'],
}

function Btn({ onClick, icon, label, cls }) {
  const paths = ICON_PATHS[icon]
  return (
    <button onClick={onClick} title={label}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-ink-400 transition-all duration-150 ${cls}`}>
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {paths.map((d, i) => <path key={i} strokeLinecap="round" strokeLinejoin="round" d={d}/>)}
      </svg>
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
