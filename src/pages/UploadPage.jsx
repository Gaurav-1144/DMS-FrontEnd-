import React, { useRef, useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { validateFile } from '../utils/helpers'
import { useUpload } from '../hooks/useDocuments'
import { useToast, ToastContainer } from '../components/Toast'

export default function UploadPage() {
  const navigate = useNavigate()
  const { toasts, add: addToast, remove: removeToast } = useToast()

  const [file,         setFile]         = useState(null)
  const [subject,      setSubject]      = useState('')
  const [documentDate, setDocumentDate] = useState('')
  const [dragOver,     setDragOver]     = useState(false)
  const [fileError,    setFileError]    = useState('')
  const [done,         setDone]         = useState(false)   // success state
  const inputRef = useRef(null)

  const handleSuccess = useCallback((doc) => {
    setDone(true)
    addToast(`"${doc.subject}" uploaded successfully!`, 'success')
  }, [addToast])

  const { upload, uploading, progress, error: uploadError, setError: setUploadError } = useUpload(handleSuccess)

  /* ── file picking ─────────────────────────────────────────────────────── */
  const pickFile = (f) => {
    const err = validateFile(f)
    if (err) { setFileError(err); return }
    setFileError('')
    setFile(f)
    setDone(false)
  }

  const onDragOver  = (e) => { e.preventDefault(); setDragOver(true)  }
  const onDragLeave = ()  => setDragOver(false)
  const onDrop      = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) pickFile(f) }

  /* ── reset form ───────────────────────────────────────────────────────── */
  const resetForm = () => {
    setFile(null); setSubject(''); setDocumentDate('')
    setFileError(''); setUploadError(null); setDone(false)
  }

  /* ── submit ───────────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file)           { setFileError('Please select a file.'); return }
    if (!subject.trim()) return
    if (!documentDate)   return
    await upload(file, subject.trim(), documentDate)
  }

  return (
    <>
      <div className="max-w-2xl mx-auto">

        {/* ── breadcrumb ──────────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-xs font-mono text-ink-500 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Documents</Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
          <span className="text-gold-DEFAULT">Upload</span>
        </nav>

        {/* ── page title ──────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-white tracking-tight">Upload Document</h1>
          <p className="text-ink-500 text-sm font-mono mt-1">
            Supported: PDF · DOCX · DOC · JPEG · PNG · GIF · WEBP · max 50 MB
          </p>
        </div>

        {/* ── success state ───────────────────────────────────────────── */}
        {done && (
          <div className="mb-6 bg-jade-DEFAULT/10 border border-jade-DEFAULT/30 rounded-2xl p-6 flex flex-col items-center gap-4 animate-scale-in text-center">
            <div className="w-14 h-14 rounded-2xl bg-jade-DEFAULT/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-jade-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <p className="font-display font-bold text-white text-lg">Upload Successful!</p>
              <p className="text-ink-400 text-sm font-mono mt-1">"{subject}" has been saved.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="flex items-center gap-2 bg-ink-700 hover:bg-ink-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                Upload Another
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 bg-gold-DEFAULT hover:bg-gold-dark text-ink-950 font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-gold-DEFAULT/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                </svg>
                View Documents
              </Link>
            </div>
          </div>
        )}

        {/* ── upload form ─────────────────────────────────────────────── */}
        {!done && (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* drop zone */}
            <div>
              <label className="block text-xs font-mono text-ink-500 uppercase tracking-widest mb-2">File *</label>
              <div
                onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={[
                  'rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer select-none transition-all duration-200',
                  dragOver           ? 'border-gold-DEFAULT bg-gold-DEFAULT/5 scale-[1.01]' : '',
                  file && !dragOver  ? 'border-jade-DEFAULT bg-jade-DEFAULT/5'              : '',
                  !dragOver && !file ? 'border-ink-600 hover:border-ink-500 hover:bg-ink-800/50' : '',
                ].join(' ')}
              >
                <input
                  ref={inputRef} type="file" className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f) }}
                />

                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-jade-DEFAULT/20 flex items-center justify-center">
                      <svg className="w-7 h-7 text-jade-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{file.name}</p>
                      <p className="text-ink-500 text-xs font-mono mt-0.5">{(file.size / 1_048_576).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null); setFileError('') }}
                      className="text-xs text-ruby-light hover:text-ruby-DEFAULT transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-ink-700 flex items-center justify-center">
                      <svg className="w-7 h-7 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        Drop your file here or{' '}
                        <span className="text-gold-DEFAULT font-semibold">browse</span>
                      </p>
                      <p className="text-ink-500 text-sm font-mono mt-1">PDF · DOCX · DOC · JPEG · PNG · GIF · WEBP</p>
                    </div>
                  </div>
                )}
              </div>
              {fileError && (
                <p className="text-ruby-light text-xs font-mono mt-2 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {fileError}
                </p>
              )}
            </div>

            {/* upload progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-ink-500">
                  <span>Uploading…</span>
                  <span className="text-gold-DEFAULT">{progress}%</span>
                </div>
                <div className="h-2 bg-ink-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-DEFAULT to-gold-light rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* subject */}
            <div>
              <label className="block text-xs font-mono text-ink-500 uppercase tracking-widest mb-2">
                Subject *
              </label>
              <input
                type="text" required value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Q4 Financial Report 2024"
                className="w-full bg-ink-800 border border-ink-600 focus:border-gold-DEFAULT rounded-xl px-4 py-3 text-white placeholder-ink-500 outline-none transition-colors text-sm"
              />
            </div>

            {/* document date */}
            <div>
              <label className="block text-xs font-mono text-ink-500 uppercase tracking-widest mb-2">
                Document Date *
              </label>
              <input
                type="date" required value={documentDate}
                onChange={(e) => setDocumentDate(e.target.value)}
                className="w-full bg-ink-800 border border-ink-600 focus:border-gold-DEFAULT rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm [color-scheme:dark]"
              />
            </div>

            {/* server error */}
            {uploadError && (
              <div className="bg-ruby-DEFAULT/10 border border-ruby-DEFAULT/30 rounded-xl px-4 py-3 flex items-start gap-3">
                <svg className="w-4 h-4 text-ruby-light mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p className="text-ruby-light text-sm font-mono">{uploadError}</p>
              </div>
            )}

            {/* action buttons */}
            <div className="flex gap-3 pt-2">
              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-2 bg-ink-700 hover:bg-ink-600 text-white font-medium text-sm rounded-xl py-3 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit" disabled={uploading}
                className="flex-1 flex items-center justify-center gap-2 bg-gold-DEFAULT hover:bg-gold-dark disabled:opacity-50 disabled:cursor-not-allowed text-ink-950 font-bold text-sm rounded-xl py-3 transition-all shadow-lg shadow-gold-DEFAULT/20"
              >
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
        )}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
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
