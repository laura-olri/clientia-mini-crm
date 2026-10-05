import type { Cliente, Estado } from '../types'
import { ESTADOS } from '../types'

interface Props {
  cliente: Cliente
  onCambiarEstado: (id: number, estado: Estado) => void
  onEliminar: (cliente: Cliente) => void
}

// Una fila de la lista: datos del cliente, selector de estado y botón de eliminar
export default function ClienteFila({ cliente, onCambiarEstado, onEliminar }: Props) {
  const fechaAlta = new Date(cliente.created_at).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <li className={`fila fila-${cliente.estado}`}>
      <div className="fila-datos">
        <p className="fila-nombre">{cliente.nombre}</p>
        {cliente.empresa && <p className="fila-empresa">{cliente.empresa}</p>}
        {cliente.notas && <p className="fila-notas">{cliente.notas}</p>}
        <p className="fila-fecha">Alta el {fechaAlta}</p>
      </div>

      <div className="fila-contacto">
        {cliente.email && <a href={`mailto:${cliente.email}`}>{cliente.email}</a>}
        {cliente.telefono && <a href={`tel:${cliente.telefono}`}>{cliente.telefono}</a>}
        {!cliente.email && !cliente.telefono && (
          <span className="sin-dato">Sin datos de contacto</span>
        )}
      </div>

      <div className="fila-acciones">
        <label htmlFor={`estado-${cliente.id}`} className="oculto">
          Estado de {cliente.nombre}
        </label>
        <select
          id={`estado-${cliente.id}`}
          value={cliente.estado}
          onChange={(e) => onCambiarEstado(cliente.id, e.target.value as Estado)}
        >
          {ESTADOS.map(({ valor, etiqueta }) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </select>
        <button className="boton boton-texto boton-peligro" onClick={() => onEliminar(cliente)}>
          Eliminar
        </button>
      </div>
    </li>
  )
}
