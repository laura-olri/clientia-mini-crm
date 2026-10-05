// Tipos de datos de la aplicación (equivalen a la tabla "clientes" de Supabase)

export type Estado = 'posible' | 'contactado' | 'cliente'

export interface Cliente {
  id: number
  nombre: string
  empresa: string | null
  email: string | null
  telefono: string | null
  estado: Estado
  notas: string | null
  created_at: string
}

// Un cliente nuevo todavía no tiene id ni fecha: los pone la base de datos
export type NuevoCliente = Omit<Cliente, 'id' | 'created_at'>

// Lista de estados en el orden del embudo de ventas
export const ESTADOS: { valor: Estado; etiqueta: string }[] = [
  { valor: 'posible', etiqueta: 'Posible cliente' },
  { valor: 'contactado', etiqueta: 'Contactado' },
  { valor: 'cliente', etiqueta: 'Cliente' },
]
