import { useState, useEffect, useCallback } from 'react'
import documentService from '../services/documentService'

/** Hook for fetching + managing the document list */
export function useDocuments() {
  const [documents, setDocuments] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await documentService.getAll()
      setDocuments(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const search = useCallback(async (filters) => {
    setLoading(true)
    setError(null)
    try {
      const data = await documentService.search(filters)
      setDocuments(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const remove = useCallback(async (id) => {
    try {
      await documentService.delete(id)
      setDocuments((prev) => prev.filter((d) => d.id !== id))
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.message }
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  return { documents, loading, error, fetchAll, search, remove }
}

/** Hook for uploading a single document */
export function useUpload(onSuccess) {
  const [uploading, setUploading] = useState(false)
  const [progress,  setProgress]  = useState(0)
  const [error,     setError]     = useState(null)

  const upload = useCallback(async (file, subject, documentDate) => {
    setUploading(true)
    setProgress(0)
    setError(null)
    try {
      const result = await documentService.upload(file, subject, documentDate, setProgress)
      setProgress(100)
      onSuccess?.(result)
      return result
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setUploading(false)
    }
  }, [onSuccess])

  const reset = useCallback(() => {
    setProgress(0)
    setError(null)
  }, [])

  return { upload, uploading, progress, error, reset, setError }
}
