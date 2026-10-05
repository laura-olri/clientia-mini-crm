import { useEffect, useState } from 'react'
import { supabase, faltaConfiguracion } from './supabaseClient'
import type { Cliente, Estado, NuevoCliente } from './types'
import Embudo from './components/Embudo'
import ClienteForm from './components/ClienteForm'
import ClienteFila from './components/ClienteFila'

type Filtro = Estado | 'todos'

export default function App() {
  // Estado de la aplicación: cuando cambia, React vuelve a pintar la pantalla
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [formAbierto, setFormAbierto] = useState(false)

  // Al abrir la aplicación, se cargan los clientes desde Supabase (solo una vez)
  useEffect(() => {
    if (faltaConfiguracion) return

    const cargarClientes = async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(`No se han podido cargar los clientes: ${error.message}`)
      } else {
        setClientes(data as Cliente[])
      }
      setCargando(false)
    }

    cargarClientes()
  }, [])

  // Guarda un cliente nuevo y lo añade al principio de la lista
  const crearCliente = async (nuevo: NuevoCliente) => {
    const { data, error } = await supabase
      .from('clientes')
      .insert(nuevo)
      .select()
      .single()

    if (error) {
      setError(`No se ha podido guardar el cliente: ${error.message}`)
      return false
    }

    setClientes((actuales) => [data as Cliente, ...actuales])
    setFormAbierto(false)
    return true
  }

  // Cambia el estado de un cliente (posible, contactado o cliente)
  const cambiarEstado = async (id: number, estado: Estado) => {
    const { error } = await supabase.from('clientes').update({ estado }).eq('id', id)

    if (error) {
      setError(`No se ha podido cambiar el estado: ${error.message}`)
      return
    }

    setClientes((actuales) =>
      actuales.map((c) => (c.id === id ? { ...c, estado } : c)),
    )
  }

  // Elimina un cliente después de pedir confirmación
  const eliminarCliente = async (cliente: Cliente) => {
    const confirmado = window.confirm(
      `¿Eliminar a ${cliente.nombre}? Esta acción no se puede deshacer.`,
    )
    if (!confirmado) return

    const { error } = await supabase.from('clientes').delete().eq('id', cliente.id)

    if (error) {
      setError(`No se ha podido eliminar el cliente: ${error.message}`)
      return
    }

    setClientes((actuales) => actuales.filter((c) => c.id !== cliente.id))
  }

  // Clientes que se muestran según la búsqueda y el filtro de estado
  const texto = busqueda.trim().toLowerCase()
  const visibles = clientes.filter((c) => {
    const coincideEstado = filtro === 'todos' || c.estado === filtro
    const coincideTexto =
      texto === '' ||
      [c.nombre, c.empresa, c.email].some((campo) =>
        campo?.toLowerCase().includes(texto),
      )
    return coincideEstado && coincideTexto
  })

  const quitarFiltros = () => {
    setBusqueda('')
    setFiltro('todos')
  }

  if (faltaConfiguracion) {
    return (
      <main className="app">
        <h1 className="titulo">Clientia</h1>
        <div className="aviso" role="alert">
          <p>Falta conectar la aplicación con Supabase.</p>
          <p>
            Copia el archivo <code>.env.example</code> como <code>.env</code>,
            rellena la URL y la clave pública de tu proyecto y vuelve a ejecutar{' '}
            <code>npm run dev</code>.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="app">
      <header className="cabecera">
        <div>
          <h1 className="titulo">Clientia</h1>
          <p className="subtitulo">
            Mini CRM para seguir a tus clientes.
          </p>
        </div>
        <button
          className="boton boton-principal"
          onClick={() => setFormAbierto(!formAbierto)}
          aria-expanded={formAbierto}
        >
          {formAbierto ? 'Cerrar formulario' : 'Añadir cliente'}
        </button>
      </header>

      {formAbierto && (
        <ClienteForm onGuardar={crearCliente} onCancelar={() => setFormAbierto(false)} />
      )}

      <Embudo clientes={clientes} filtro={filtro} onFiltrar={setFiltro} />

      <div className="barra-busqueda">
        <label htmlFor="busqueda" className="oculto">
          Buscar clientes
        </label>
        <input
          id="busqueda"
          type="search"
          placeholder="Buscar cliente"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <span className="contador" aria-live="polite">
          {visibles.length} de {clientes.length}
        </span>
      </div>

      {error && (
        <div className="error" role="alert">
          <p>{error}</p>
          <button className="boton boton-texto" onClick={() => setError(null)}>
            Cerrar aviso
          </button>
        </div>
      )}

      {cargando ? (
        <p className="vacio">Cargando clientes…</p>
      ) : clientes.length === 0 ? (
        <p className="vacio">
          Todavía no hay clientes. Añade el primero con el botón de arriba.
        </p>
      ) : visibles.length === 0 ? (
        <div className="vacio">
          <p>Ningún cliente coincide con la búsqueda.</p>
          <button className="boton boton-texto" onClick={quitarFiltros}>
            Quitar filtros
          </button>
        </div>
      ) : (
        <ul className="lista">
          {visibles.map((cliente) => (
            <ClienteFila
              key={cliente.id}
              cliente={cliente}
              onCambiarEstado={cambiarEstado}
              onEliminar={eliminarCliente}
            />
          ))}
        </ul>
      )}
    </main>
  )
}
