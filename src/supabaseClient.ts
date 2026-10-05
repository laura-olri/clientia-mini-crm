import { createClient } from '@supabase/supabase-js'

// Vite lee estas variables del archivo .env (deben empezar por VITE_)
const url = import.meta.env.VITE_SUPABASE_URL
const clave = import.meta.env.VITE_SUPABASE_KEY

// Si falta alguna, la aplicación muestra un aviso en lugar de fallar
export const faltaConfiguracion = !url || !clave

export const supabase = createClient(
  url || 'http://localhost',
  clave || 'falta-la-clave',
)
