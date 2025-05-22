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

    if (error) {
      alert('Error verificando credenciales')
      console.error(error)
      return
    }

    if (data.contraseña === password) {
      localStorage.setItem('auth', 'true')
      navigate('/')
    } else {
      alert('Contraseña incorrecta')
    }
  }

  return (
    <div className="p-4 max-w-screen-sm mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Acceso a la app</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Ingresar
        </button>
      </form>
    </div>
  )
}

export default Login
