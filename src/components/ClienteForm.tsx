import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Estado, NuevoCliente } from '../types'
import { ESTADOS } from '../types'

interface Props {
  onGuardar: (nuevo: NuevoCliente) => Promise<boolean>
  onCancelar: () => void
}

// Formulario para dar de alta un cliente
export default function ClienteForm({ onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [estado, setEstado] = useState<Estado>('posible')
  const [notas, setNotas] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)

  const enviar = async (e: FormEvent) => {
    e.preventDefault() // evita que el navegador recargue la página

    if (nombre.trim() === '') {
      setAviso('Escribe al menos el nombre del cliente.')
      return
    }

    setGuardando(true)
    const guardado = await onGuardar({
      nombre: nombre.trim(),
      // Los campos vacíos se guardan como null en la base de datos
      empresa: empresa.trim() || null,
      email: email.trim() || null,
      telefono: telefono.trim() || null,
      estado,
      notas: notas.trim() || null,
    })
    if (!guardado) setGuardando(false)
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <h2>Nuevo cliente</h2>

      <div className="campos">
        <label>
          Nombre
          <input
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value)
              setAviso(null)
            }}
            autoFocus
            required
          />
        </label>
        <label>
          Empresa
          <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Teléfono
          <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </label>
        <label>
          Estado
          <select value={estado} onChange={(e) => setEstado(e.target.value as Estado)}>
            {ESTADOS.map(({ valor, etiqueta }) => (
              <option key={valor} value={valor}>
                {etiqueta}
              </option>
            ))}
          </select>
        </label>
        <label className="campo-ancho">
          Notas
          <textarea rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} />
        </label>
      </div>

      {aviso && (
        <p className="aviso-campo" role="alert">
          {aviso}
        </p>
      )}

      <div className="formulario-acciones">
        <button type="submit" className="boton boton-principal" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar cliente'}
        </button>
        <button type="button" className="boton boton-texto" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
