/** Format bytes → human-readable size string */
export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—'
  if (bytes === 0) return '0 B'
  if (bytes < 1_024) return `${bytes} B`
  if (bytes < 1_048_576) return `${(bytes / 1_024).toFixed(1)} KB`
  return `${(bytes / 1_048_576).toFixed(2)} MB`
}

/** Format ISO date string → "15 Jan 2025" */
export function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

/** Format ISO datetime → "15 Jan 2025, 10:30" */
export function formatDateTime(str) {
  if (!str) return '—'
  return new Date(str).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

/** Map MIME type → { label, colorKey } */
export function fileTypeInfo(mime) {
  if (!mime) return { label: 'FILE', colorKey: 'gray' }
  if (mime === 'application/pdf')               return { label: 'PDF',  colorKey: 'ruby'   }
  if (mime.includes('word') || mime.includes('document')) return { label: 'DOCX', colorKey: 'cobalt' }
  if (mime.startsWith('image/'))                return { label: 'IMG',  colorKey: 'jade'   }
  return { label: 'FILE', colorKey: 'gray' }
}

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
])

/** Client-side file validation — returns error string or null */
export function validateFile(file) {
  if (!file) return 'No file selected.'
  if (!ALLOWED_MIME.has(file.type))
    return `File type "${file.type}" is not allowed. Use PDF, DOCX, DOC, JPEG, PNG, GIF or WEBP.`
  if (file.size > 50 * 1_048_576)
    return 'File exceeds the 50 MB limit.'
  return null
}
