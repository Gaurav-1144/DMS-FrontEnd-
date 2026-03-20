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
  const [confirmDel,  setConfirmDel]  = useState(false)
  const [deleting,    setDeleting]    = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [viewing,     setViewing]     = useState(false)
  const [actionError, setActionError] = useState('')

  const { label, colorKey } = fileTypeInfo(doc.fileType)
  const badge = BADGE[colorKey] ?? BADGE.gray

  /* ── fetch blob via Axios so the JWT header is sent ───────────────────── */
  const fetchBlob = async (type) => {
    const data = await documentService.fetchFile(doc.id, type)   // arraybuffer
    return new Blob([data], { type: doc.fileType || 'application/octet-stream' })
  }

  const handleDownload = async () => {
    setDownloading(true)
    setActionError('')
    try {
      const blob = await fetchBlob('download')
      const url  = URL.createObjectURL(blob)
      const a    = Object.assign(document.createElement('a'), {
        href:     url,
        download: doc.originalFileName || 'document',
      })
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 10_000)
    } catch (err) {
      setActionError('Download failed: ' + err.message)
    } finally {
      setDownloading(false)
    }
  }

  const handleView = async () => {
    setViewing(true)
    setActionError('')
    try {
      const blob = await fetchBlob('view')
      const url  = URL.createObjectURL(blob)
      window.open(url, '_blank', 'noopener,noreferrer')
      // revoke after a delay to give the new tab time to load
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch (err) {
      setActionError('Could not open file: ' + err.message)
    } finally {
      setViewing(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDel) { setConfirmDel(true); return }
    setDeleting(true)
    await onDelete(doc.id)
    setDeleting(false)
    setConfirmDel(false)
  }

  return (
    <article className="group bg-ink-800 hover:bg-ink-700/60 border border-ink-700 hover:border-ink-600 rounded-2xl p-5 transition-all duration-200 animate-fade-in">

      {/* top row */}
      <div className="flex items-start gap-4">
        <div className={`shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center font-mono font-bold text-xs tracking-wider ${badge}`}>
          {label}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-white text-sm leading-snug truncate" title={doc.subject}>
            {doc.subject}
          </h3>
          <p className="text-ink-500 font-mono text-xs mt-0.5 truncate" title={doc.originalFileName}>
            {doc.originalFileName}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
            <Meta label="Doc date" value={formatDate(doc.documentDate)} />
            <Meta label="Uploaded" value={formatDateTime(doc.createdAt)} />
            <Meta label="Size"     value={formatFileSize(doc.fileSize)} />
          </div>
        </div>
      </div>

      {/* action error */}
      {actionError && (
        <div className="mt-3 flex items-center gap-2 bg-ruby-DEFAULT/10 border border-ruby-DEFAULT/30 rounded-lg px-3 py-2">
          <svg className="w-3.5 h-3.5 text-ruby-light shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className="text-ruby-light text-xs font-mono flex-1">{actionError}</p>
          <button onClick={() => setActionError('')} className="text-ink-500 hover:text-white transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      )}

      {/* action bar */}
      <div className="flex items-center gap-1 mt-4 pt-4 border-t border-ink-700">
        <Btn
          onClick={handleView}
          icon="eye" label={viewing ? 'Opening…' : 'View'}
          loading={viewing}
          cls="hover:text-gold-DEFAULT hover:bg-gold-DEFAULT/10"
        />
        <Btn
          onClick={handleDownload}
          icon="download" label={downloading ? 'Saving…' : 'Download'}
          loading={downloading}
          cls="hover:text-jade-light hover:bg-jade-DEFAULT/10"
        />

        <div className="flex-1" />

        {confirmDel ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-ruby-light">Delete?</span>
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
          <Btn onClick={handleDelete} icon="trash" label="Delete"
            cls="text-ink-500 hover:text-ruby-light hover:bg-ruby-DEFAULT/10" />
        )}
      </div>
    </article>
  )
}

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

function Btn({ onClick, icon, label, cls, loading = false }) {
  const paths = ICON_PATHS[icon]
  return (
    <button onClick={onClick} disabled={loading} title={label}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-ink-400 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${cls}`}>
      {loading
        ? <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {paths.map((d, i) => <path key={i} strokeLinecap="round" strokeLinejoin="round" d={d}/>)}
          </svg>
      }
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
