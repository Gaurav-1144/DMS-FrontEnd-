import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute  from './components/ProtectedRoute'
import Layout          from './components/Layout'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import DocumentsPage   from './pages/DocumentsPage'
import UploadPage      from './pages/UploadPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected app routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index          element={<DocumentsPage />} />
            <Route path="upload"  element={<UploadPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
