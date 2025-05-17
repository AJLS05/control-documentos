import { useState } from 'react'
import { supabase } from '../supabaseClient.js'
import { Link } from 'react-router-dom'

function AgregarPersona() {
  const [nuevaPersona, setNuevaPersona] = useState({
    nombre: '',
    numero_identidad: ''
  })

  const handleAgregarPersona = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from('personas')
      .insert([nuevaPersona])

    if (error) {
      alert("Error al agregar persona")
      console.error(error)
    } else {
      alert("Persona agregada correctamente")
      setNuevaPersona({ nombre: '', numero_identidad: '' })
    }
  }

  return (
    <div className="p-4 max-w-screen-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Agregar Persona</h1>

      <form onSubmit={handleAgregarPersona} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevaPersona.nombre}
          onChange={(e) => setNuevaPersona({ ...nuevaPersona, nombre: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="Número de identidad"
          value={nuevaPersona.numero_identidad}
          onChange={(e) => setNuevaPersona({ ...nuevaPersona, numero_identidad: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
          Guardar Persona
        </button>
      </form>

      <div className="flex justify-between mt-6">
        <Link to="/" className="bg-gray-200 px-4 py-2 rounded">Inicio</Link>
        <Link to="/agregar-documento" className="bg-blue-500 text-white px-4 py-2 rounded">+ Documento</Link>
      </div>
    </div>
  )
}

export default AgregarPersona
