import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import AgregarPersona from './pages/AgregarPersona.jsx'
import AgregarDocumento from './pages/AgregarDocumento.jsx'
import Login from './pages/Login.jsx'

function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem('auth') === 'true'
  return isAuth ? children : <Login />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agregar-persona"
        element={
          <ProtectedRoute>
            <AgregarPersona />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agregar-documento"
        element={
          <ProtectedRoute>
            <AgregarDocumento />
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
)
