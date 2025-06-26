import { useState } from 'react'
import { supabase } from '../supabaseClient'

function ConsultaEstado() {
  const [identidad, setIdentidad] = useState('')
  const [persona, setPersona] = useState(null)
  const [cargando, setCargando] = useState(false)

  const formatearIdentidad = (valor) => {
    const limpio = valor.replace(/\D/g, '')
    const partes = []
    if (limpio.length > 0) partes.push(limpio.slice(0, 4))
    if (limpio.length > 4) partes.push(limpio.slice(4, 8))
    if (limpio.length > 8) partes.push(limpio.slice(8, 13))
    return partes.join('-')
  }

  const handleChange = (e) => {
    const formateado = formatearIdentidad(e.target.value)
    setIdentidad(formateado)
  }

  const buscarDocumentos = async (e) => {
    e.preventDefault()
    setCargando(true)

    const { data, error } = await supabase
      .from('personas')
      .select(`
        id,
        nombre,
        numero_identidad,
        documentos (
          id,
          nombre_documento,
          estados_documento (
            pendiente,
            solicitado,
            en_firma,
            apostillado,
            escaneado,
            enviado
          )
        )
      `)
      .eq('numero_identidad', identidad)
      .maybeSingle()

    if (!error && data) {
      setPersona(data)
    } else {
      setPersona(null)
    }

    setCargando(false)
  }

  const estados = ['pendiente', 'solicitado', 'en_firma', 'apostillado', 'escaneado', 'enviado']

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Consulta de Documento</h1>

        <form onSubmit={buscarDocumentos} className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Ingrese su número de identidad"
            value={identidad}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Consultar
          </button>
        </form>

        {cargando && <p className="text-center text-sm text-gray-500">Buscando...</p>}

        {!cargando && persona && (
          <div className="space-y-6">
            <div className="bg-gray-100 p-4 rounded border text-sm">
              <p><strong>Nombre:</strong> {persona.nombre}</p>
              <p><strong>Identidad:</strong> {persona.numero_identidad}</p>
            </div>

            {persona.documentos.length > 0 ? (
              <div className="space-y-4">
                {persona.documentos.map((doc) => (
                  <div key={doc.id} className="border p-4 rounded bg-gray-100">
                    <h2 className="font-semibold text-sm">{doc.nombre_documento}</h2>
                    <ul className="mt-2 space-y-1 text-sm">
                      {estados.map((estado) => (
                        <li key={estado}>
                          {estado.charAt(0).toUpperCase() + estado.slice(1)}:{' '}
                          {doc.estados_documento[0]?.[estado] ? '✅' : '—'}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-center text-gray-500">Esta persona no tiene documentos registrados.</p>
            )}
          </div>
        )}

        {!cargando && persona === null && identidad && (
          <p className="text-center text-sm text-red-500 mt-4">No se encontraron documentos.</p>
        )}
      </div>
    </div>
  )
}

export default ConsultaEstado
