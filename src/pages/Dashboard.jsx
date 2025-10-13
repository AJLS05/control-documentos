import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'

function Dashboard() {
  const [registros, setRegistros] = useState([])
  const [busqueda, setBusqueda] = useState('')

  const cargarDatos = async () => {
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
            id,
            pendiente,
            solicitado,
            en_firma,
            apostillado,
            escaneado,
            enviado
          )
        )
      `)

    if (!error) setRegistros(data)
    else console.error(error)
  }

  const actualizarEstado = async (estadoId, campo, valor) => {
    const { error } = await supabase
      .from('estados_documento')
      .update({ [campo]: valor })
      .eq('id', estadoId)

    if (!error) cargarDatos()
    else console.error(error)
  }

  // 🧩 NUEVA FUNCIÓN para eliminar documentos
const eliminarDocumento = async (docId) => {
  const confirmar = window.confirm("¿Seguro que deseas eliminar este documento?")
  if (!confirmar) return

  const { error } = await supabase
    .from('documentos')
    .delete()
    .eq('id', docId)

  if (error) {
    console.error("Error al eliminar documento:", error)
  } else {
    alert("Documento eliminado correctamente.")
    cargarDatos()
  }
}


  useEffect(() => {
    cargarDatos()
  }, [])

  const filtrados = registros.filter((persona) => {
    const coincidePersona =
      persona.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      persona.numero_identidad.includes(busqueda)
    const coincideDocumento = persona.documentos.some((doc) =>
      doc.nombre_documento.toLowerCase().includes(busqueda.toLowerCase())
    )
    return coincidePersona || coincideDocumento
  })

  return (
    <div className="min-h-screen bg-gray-950 p-4 grid flex flex-row justify-center">
      <h1 className="text-2xl font-bold mb-4 text-center text-white">Control de Trámites</h1>

      <div className="flex flex-row justify-between items-center mb-4 text-white">
        <Link to="/agregar-persona" className="border rounded border-blue-500 text-white px-3 py-2 rounded text-sm no-underline text-decoration-none">
          Agregar Persona
        </Link>
        <input
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border rounded p-2 w-full mx-2"
        />
        <Link to="/agregar-documento" className="border rounded border-blue-500 text-white px-3 py-2 rounded text-sm no-underline text-decoration-none">
          Agregar Documento
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300 bg-gray-950 text-white rounded">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Identidad</th>
              <th className="p-2 border">Documento</th>
              <th className="p-2 border">Pendiente</th>
              <th className="p-2 border">Solicitado</th>
              <th className="p-2 border">En Firma de la Corte</th>
              <th className="p-2 border">En Apostilla de R.R.E.E.</th>
              <th className="p-2 border">Escaneado</th>
              <th className="p-2 border">Enviado</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((persona) =>
              persona.documentos.map((doc) => (
                <tr key={doc.id} className="even:bg-gray-950">
                  <td className="p-2 border">{persona.nombre}</td>
                  <td className="p-2 border">{persona.numero_identidad}</td>
                  <td className="p-2 border">{doc.nombre_documento}</td>
                  {['pendiente', 'solicitado', 'en_firma', 'apostillado', 'escaneado', 'enviado'].map((estado) => (
                    <td className="p-2 border text-center" key={estado}>
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={doc.estados_documento[0]?.[estado] || false}
                        onChange={() =>
                          actualizarEstado(
                            doc.estados_documento[0]?.id,
                            estado,
                            !doc.estados_documento[0]?.[estado]
                          )
                        }
                      />
                    </td>
                  ))}
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => eliminarDocumento(doc.id)}
                      className="text-white bg-red-600 border border-red-500 px-2 py-1 rounded text-sm"
                    >
                      Eliminar 🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
