import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { Link } from 'react-router-dom'


function App() {
  const [registros, setRegistros] = useState([])
  // Mover actualizarEstado fuera de useEffect para que esté disponible en el JSX
  const actualizarEstado = async (estadoId, campo, nuevoValor) => {
    // Actualizar el estado del documento en la base de datos
    const { error } = await supabase
      .from('estados_documento')
      .update({ [campo]: nuevoValor })
      .eq('id', estadoId)

    if (error) {
      alert('Error actualizando estado')  
      console.error(error)
    } else {
      // Recargar los datos para reflejar el cambio
      const { data } = await supabase
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
      setRegistros(data)
    }
  }

  useEffect(() => {
    // Función para obtener los datos de la tabla personas
    const fetchData = async () => {
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

      if (error) {
        console.error(error)
      } else {
        setRegistros(data)
      }
    }
    fetchData()
  }, [])

  const [busqueda, setBusqueda] = useState('')

  return (
    
  <div className="p-4 max-w-screen-sm mx-auto">
    <button
      onClick={() => {
        localStorage.removeItem('auth')
        window.location.href = './login'
      }}
      className="text-sm text-red-500 underline ml-auto"
    >
      Cerrar sesión
    </button>
    <h1 className="text-2xl font-bold mb-4 text-center">Control de Trámites</h1>
    <input
      type="text"
      placeholder="Buscar por nombre, documento o identidad..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      className="w-full border p-2 mb-4 rounded"
      autoFocus
    />

    <div className="flex justify-between mb-4">
      <Link to="/agregar-persona" className="bg-green-500 text-white px-4 py-2 rounded text-sm">
        + Persona
      </Link>
      <Link to="/agregar-documento" className="bg-blue-500 text-white px-4 py-2 rounded text-sm">
        + Documento
      </Link>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Identidad</th>
            <th className="p-2 border">Documento</th>
            <th className="p-2 border">Pendiente</th>
            <th className="p-2 border">Solicitado</th>
            <th className="p-2 border">En Firma</th>
            <th className="p-2 border">Apostillando</th>
            <th className="p-2 border">Escaneado</th>
            <th className="p-2 border">Enviado</th>
          </tr>
        </thead>
        <tbody>
          {registros.filter((persona) => {
            const matchPersona = persona.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            persona.numero_identidad.includes(busqueda)
              const tieneDocumentos = persona.documentos.some((doc) =>
              doc.nombre_documento.toLowerCase().includes(busqueda.toLowerCase())
            )
            return matchPersona || tieneDocumentos
          }).map((persona) =>
            persona.documentos.map((doc) => (
              <tr key={doc.id} className="even:bg-gray-50">
                <td className="p-2 border">{persona.nombre}</td>
                <td className="p-2 border">{persona.numero_identidad}</td>
                <td className="p-2 border">{doc.nombre_documento}</td>
                {["pendiente", "solicitado", "en_firma", "apostillando", "escaneado", "enviado"].map((estado) => (
                  <td className="p-2 border text-center" key={estado}>
                    <input
                      type="checkbox"
                      checked={doc.estados_documento[0]?.[estado] || false}
                      onChange={() =>
                        actualizarEstado(doc.estados_documento[0]?.id, estado, !doc.estados_documento[0]?.[estado])
                      }
                      className="w-4 h-4"
                    />
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default App
