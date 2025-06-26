import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Login() {
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase
      .from('usuarios')
      .select('contraseña')
      .eq('nombre', 'admin')
      .single()

    if (error || !data || data.contraseña !== password) {
      alert('Contraseña incorrecta')
      return
    }

    localStorage.setItem('auth', 'true')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <div className="mt-6 text-center">
        <a
          href="#/estado-documento"
          className="text-blue-600 underline text-sm"
        >
          Consultar estado de mi documento
        </a>
      </div>
        <h1 className="text-2xl font-bold mb-6 text-center">Acceso</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
