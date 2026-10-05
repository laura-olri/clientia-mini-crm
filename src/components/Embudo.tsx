import type { Cliente, Estado } from '../types'
import { ESTADOS } from '../types'

interface Props {
  clientes: Cliente[]
  filtro: Estado | 'todos'
  onFiltrar: (filtro: Estado | 'todos') => void
}

// Barra del embudo de ventas: cada tramo crece según cuántos clientes tiene
// y al pulsarlo filtra la lista por ese estado
export default function Embudo({ clientes, filtro, onFiltrar }: Props) {
  return (
    <section className="embudo" aria-label="Clientes por estado">
      <button
        className={`etapa etapa-todos ${filtro === 'todos' ? 'activa' : ''}`}
        aria-pressed={filtro === 'todos'}
        onClick={() => onFiltrar('todos')}
      >
        <span className="etapa-numero">{clientes.length}</span>
        <span className="etapa-nombre">Todos</span>
      </button>

      {ESTADOS.map(({ valor, etiqueta }) => {
        const cantidad = clientes.filter((c) => c.estado === valor).length

        return (
          <button
            key={valor}
            className={`etapa etapa-${valor} ${filtro === valor ? 'activa' : ''}`}
            style={{ flexGrow: Math.max(cantidad, 1) }}
            aria-pressed={filtro === valor}
            onClick={() => onFiltrar(valor)}
          >
            <span className="etapa-numero">{cantidad}</span>
            <span className="etapa-nombre">{etiqueta}</span>
          </button>
        )
      })}
    </section>
  )
}
