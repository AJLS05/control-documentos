import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AgregarPersona from './pages/AgregarPersona.jsx'
import AgregarDocumento from './pages/AgregarDocumento.jsx'
import './index.css'
import ConsultaEstado from './pages/ConsultaEstado.jsx'

// Ruta protegida por auth local
function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem('auth') === 'true'
  return isAuth ? children : <Login />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/estado-documento" element={<ConsultaEstado />}/>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
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
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center text-center p-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">404</h1>
                <p className="text-gray-600 mb-4">Ruta no encontrada</p>
                <a href="#/" className="text-blue-600 underline">
                  Volver al inicio
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  </React.StrictMode>
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))