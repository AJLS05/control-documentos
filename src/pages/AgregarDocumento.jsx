import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient.js'
import { Link } from 'react-router-dom'

function AgregarDocumento() {
  const [nuevoDocumento, setNuevoDocumento] = useState({
    nombre_documento: '',
    persona_id: ''
  })
  const [personas, setPersonas] = useState([])

  useEffect(() => {
    const obtenerPersonas = async () => {
      const { data, error } = await supabase.from('personas').select()
      if (!error) setPersonas(data)
    }
    obtenerPersonas()
  }, [])

  const handleAgregarDocumento = async (e) => {
    e.preventDefault()

    const { data: docInsertado, error: errorDoc } = await supabase
      .from('documentos')
      .insert([nuevoDocumento])
      .select()

    if (errorDoc) {
      alert("Error al agregar documento")
      console.error(errorDoc)
      return
    }

    const documentoId = docInsertado[0].id
    const { error: errorEstado } = await supabase
      .from('estados_documento')
      .insert([{ documento_id: documentoId, pendiente: true }])

    if (errorEstado) {
      alert("Documento agregado, pero error creando estado")
      console.error(errorEstado)
    } else {
      alert("Documento agregado correctamente")
    }

    setNuevoDocumento({ nombre_documento: '', persona_id: '' })
  }

  return (
    <div className="p-4 max-w-screen-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Agregar Documento</h1>

      <form onSubmit={handleAgregarDocumento} className="space-y-4">
        <select
          value={nuevoDocumento.persona_id}
          onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, persona_id: e.target.value })}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Seleccionar persona</option>
          {personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} - {p.numero_identidad}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nombre del documento"
          value={nuevoDocumento.nombre_documento}
          onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, nombre_documento: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Guardar Documento
        </button>
      </form>

      <div className="flex justify-between mt-6">
        <Link to="/" className="bg-gray-200 px-4 py-2 rounded">Inicio</Link>
        <Link to="/agregar-persona" className="bg-green-500 text-white px-4 py-2 rounded">+ Persona</Link>
      </div>
    </div>
  )
}

export default AgregarDocumento
