import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import './index.css'
import AgregarPersona from './pages/AgregarPersona.jsx'
import AgregarDocumento from './pages/AgregarDocumento.jsx'
import Login from './pages/Login.jsx'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'


function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem('auth') === 'true'
  return isAuth ? children : <Login />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <Router>
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
  </Router>
)
