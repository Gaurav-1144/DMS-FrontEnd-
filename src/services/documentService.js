import axios from 'axios'

const BASE = '/api/documents'

const http = axios.create({ baseURL: BASE, timeout: 60_000 })

// Attach JWT to every request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('dms_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Normalise errors
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('dms_token')
      localStorage.removeItem('dms_user')
      window.location.href = '/login'
    }
    const msg =
      err.response?.data?.message ||
      err.response?.data?.messages?.[0] ||
      err.message ||
      'An error occurred.'
    return Promise.reject(new Error(msg))
  }
)

const documentService = {
  /** Upload a new document */
  upload(file, subject, documentDate, onProgress) {
    const form = new FormData()
    form.append('file', file)
    form.append('subject', subject)
    form.append('documentDate', documentDate)
    return http.post('/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress(e) {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total))
      },
    }).then(r => r.data)
  },

  /** Fetch all documents */
  getAll() { return http.get('').then(r => r.data) },

  /** Search / filter */
  search({ subject, dateFrom, dateTo } = {}) {
    const params = {}
    if (subject)  params.subject  = subject
    if (dateFrom) params.dateFrom = dateFrom
    if (dateTo)   params.dateTo   = dateTo
    return http.get('/search', { params }).then(r => r.data)
  },

  /** Get single document metadata */
  getById(id) { return http.get(`/${id}`).then(r => r.data) },

  /**
   * Fetch binary file data with the JWT token attached.
   * Returns an ArrayBuffer — caller wraps it in a Blob.
   * @param {number} id
   * @param {'download'|'view'} type
   */
  fetchFile(id, type = 'download') {
    return http.get(`/${id}/${type}`, { responseType: 'arraybuffer' })
      .then(r => r.data)
  },

  /** Delete document */
  delete(id) { return http.delete(`/${id}`) },
}

export default documentService
