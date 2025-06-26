import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function AgregarDocumento() {
  const navigate = useNavigate()
  const [personas, setPersonas] = useState([])
  const [documento, setDocumento] = useState({
    persona_id: '',
    nombre_documento: ''
  })

  useEffect(() => {
    const cargarPersonas = async () => {
      const { data, error } = await supabase.from('personas').select()
      if (!error) setPersonas(data)
    }
    cargarPersonas()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data: docInsertado, error: errorDoc } = await supabase
      .from('documentos')
      .insert([documento])
      .select()

    if (errorDoc) {
      alert("Error al agregar documento")
      return
    }

    const documentoId = docInsertado[0].id
    const { error: errorEstado } = await supabase
      .from('estados_documento')
      .insert([{ documento_id: documentoId, pendiente: true }])

    if (errorEstado) {
      alert("Documento agregado, pero error creando estado")
    } else {
      alert("Documento agregado correctamente")
      navigate('/')
    }

    setDocumento({ persona_id: '', nombre_documento: '' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Agregar Documento</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={documento.persona_id}
            onChange={(e) =>
              setDocumento({ ...documento, persona_id: e.target.value })
            }
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
            value={documento.nombre_documento}
            onChange={(e) =>
              setDocumento({ ...documento, nombre_documento: e.target.value })
            }
            className="border p-2 w-full rounded"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Guardar Documento
          </button>
        </form>

        <div className="flex justify-between mt-6 text-sm">
          <Link to="/" className="text-blue-600 underline">Inicio</Link>
          <Link to="/agregar-persona" className="text-green-600 underline">+ Persona</Link>
        </div>
      </div>
    </div>
  )
}

export default AgregarDocumento
