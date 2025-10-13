import { useForm } from 'react-hook-form'
import { supabase } from '../supabaseClient'
import { Link, useNavigate } from 'react-router-dom'

function AgregarPersona() {
  const { register, handleSubmit, setValue } = useForm()
  const navigate = useNavigate()

  const formatearIdentidad = (valor) => {
    const limpio = valor.replace(/\D/g, '')
    const partes = []
    if (limpio.length > 0) partes.push(limpio.slice(0, 4))
    if (limpio.length > 4) partes.push(limpio.slice(4, 8))
    if (limpio.length > 8) partes.push(limpio.slice(8, 13))
    return partes.join('-')
  }

  const handleIdentidadChange = (e) => {
    const formateado = formatearIdentidad(e.target.value)
    setValue('numero_identidad', formateado)
  }

  const onSubmit = async (data) => {
    const { nombre, numero_identidad } = data

    const { error } = await supabase
      .from('personas')
      .insert([{ nombre, numero_identidad }])

    if (error) {
      alert('Error al agregar persona')
      console.error(error)
    } else {
      alert('Persona agregada correctamente')
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Agregar Persona</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            {...register('nombre', { required: true })}
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Número de identidad"
            {...register('numero_identidad', {
              required: true,
              pattern: /^\d{4}-\d{4}-\d{5}$/,
            })}
            onChange={handleIdentidadChange}
            className="border p-2 w-full rounded"
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Guardar Persona
          </button>
        </form>

        <div className="flex justify-between mt-6 text-sm">
          <Link to="/" className="text-blue-600 underline">Inicio</Link>
          <Link to="/agregar-documento" className="text-blue-600 underline">Agregar Documento</Link>
        </div>
      </div>
    </div>
  )
}

export default AgregarPersona
