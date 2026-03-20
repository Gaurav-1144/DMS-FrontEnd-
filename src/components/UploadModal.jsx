import React, { useCallback, useRef, useState } from 'react'
import { validateFile } from '../utils/helpers'
import { useUpload } from '../hooks/useDocuments'

export default function UploadModal({ isOpen, onClose, onUploaded }) {
  const [file,          setFile]         = useState(null)
  const [subject,       setSubject]      = useState('')
  const [documentDate,  setDocumentDate] = useState('')
  const [dragOver,      setDragOver]     = useState(false)
  const [fileError,     setFileError]    = useState('')
  const inputRef = useRef(null)

  /* ── upload hook ────────────────────────────────────────────────────────── */
  const handleSuccess = useCallback((doc) => {
    onUploaded?.(doc)
    doClose()
  }, [onUploaded]) // eslint-disable-line react-hooks/exhaustive-deps

  const { upload, uploading, progress, error: uploadError, setError: setUploadError } = useUpload(handleSuccess)

  /* ── helpers ────────────────────────────────────────────────────────────── */
  const reset = () => {
    setFile(null); setSubject(''); setDocumentDate('')
    setFileError(''); setUploadError(null)
  }
  const doClose = () => { reset(); onClose() }

  const pickFile = (f) => {
    const err = validateFile(f)
    if (err) { setFileError(err); return }
    setFileError('')
    setFile(f)
  }

  /* ── drag handlers ──────────────────────────────────────────────────────── */
  const onDragOver  = (e) => { e.preventDefault(); setDragOver(true)  }
  const onDragLeave = ()  => setDragOver(false)
  const onDrop      = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) pickFile(f) }

  /* ── submit ─────────────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file)            { setFileError('Please select a file.'); return }
    if (!subject.trim())  return
    if (!documentDate)    return
    await upload(file, subject.trim(), documentDate)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={doClose} />

      {/* panel */}
      <div
        className="relative w-full max-w-lg bg-ink-800 border border-ink-600 rounded-2xl shadow-2xl shadow-black/50 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-ink-700">
          <div>
            <h2 className="font-display font-bold text-lg text-white tracking-tight">Upload Document</h2>
            <p className="text-xs font-mono text-ink-500 mt-0.5">PDF · DOCX · Images · max 50 MB</p>
          </div>
          <button onClick={doClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-500 hover:text-white hover:bg-ink-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* ── drop zone ──────────────────────────────────────────────────── */}
          <div
            onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={[
              'relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer select-none transition-all duration-200',
              dragOver          ? 'border-gold-DEFAULT bg-gold-DEFAULT/5 scale-[1.01]' : '',
              file              ? 'border-jade-DEFAULT bg-jade-DEFAULT/5'              : '',
              !dragOver && !file? 'border-ink-600 hover:border-ink-500 hover:bg-ink-700/30' : '',
            ].join(' ')}
          >
            <input
              ref={inputRef} type="file" className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f) }}
            />

            {file ? (
              /* selected state */
              <div className="flex flex-col items-center gap-2">
                <div className="w-11 h-11 rounded-xl bg-jade-DEFAULT/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-jade-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <p className="text-white font-medium text-sm max-w-xs truncate">{file.name}</p>
                <p className="text-ink-500 text-xs font-mono">{(file.size/1_048_576).toFixed(2)} MB</p>
                <button type="button" onClick={(e)=>{e.stopPropagation();setFile(null);setFileError('')}}
                  className="text-xs text-ruby-light hover:text-ruby-DEFAULT transition-colors">
                  Remove
                </button>
              </div>
            ) : (
              /* idle state */
              <div className="flex flex-col items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-ink-700 flex items-center justify-center">
                  <svg className="w-5 h-5 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Drop file here or <span className="text-gold-DEFAULT">browse</span></p>
                  <p className="text-ink-500 text-xs mt-0.5">PDF, DOCX, DOC, JPEG, PNG, GIF, WEBP</p>
                </div>
              </div>
            )}
          </div>
          {fileError && <p className="text-ruby-light text-xs font-mono -mt-2">{fileError}</p>}

          {/* ── upload progress ─────────────────────────────────────────────── */}
          {uploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-ink-500">
                <span>Uploading…</span><span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-ink-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-DEFAULT rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* ── subject ─────────────────────────────────────────────────────── */}
          <div>
            <label className="block text-xs font-mono text-ink-500 uppercase tracking-widest mb-1.5">Subject *</label>
            <input
              type="text" required value={subject} onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Q4 Financial Report 2024"
              className="w-full bg-ink-900 border border-ink-600 focus:border-gold-DEFAULT rounded-xl px-4 py-2.5 text-white text-sm placeholder-ink-500 outline-none transition-colors"
            />
          </div>

          {/* ── document date ───────────────────────────────────────────────── */}
          <div>
            <label className="block text-xs font-mono text-ink-500 uppercase tracking-widest mb-1.5">Document Date *</label>
            <input
              type="date" required value={documentDate} onChange={(e) => setDocumentDate(e.target.value)}
              className="w-full bg-ink-900 border border-ink-600 focus:border-gold-DEFAULT rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors [color-scheme:dark]"
            />
          </div>

          {/* ── server error ─────────────────────────────────────────────────── */}
          {uploadError && (
            <div className="bg-ruby-DEFAULT/10 border border-ruby-DEFAULT/30 rounded-xl px-4 py-3">
              <p className="text-ruby-light text-sm font-mono">{uploadError}</p>
            </div>
          )}

          {/* ── actions ──────────────────────────────────────────────────────── */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={doClose}
              className="flex-1 bg-ink-700 hover:bg-ink-600 text-white font-medium text-sm rounded-xl py-2.5 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={uploading}
              className="flex-1 bg-gold-DEFAULT hover:bg-gold-dark disabled:opacity-50 disabled:cursor-not-allowed text-ink-950 font-bold text-sm rounded-xl py-2.5 transition-all flex items-center justify-center gap-2">
              {uploading
                ? <><Spinner /> Uploading…</>
                : <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                    Upload Document
                  </>
              }
            </button>
          </div>
        </form>
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
