# Clientia, mini CRM de clientes

Aplicación web para hacer el seguimiento de los clientes de una pequeña empresa, desde el primer contacto hasta que se convierten en clientes.

**Demo:** [enlace a Vercel cuando esté publicada]

## Funcionalidades

- Alta de clientes con nombre, empresa, email, teléfono, estado y notas.
- Embudo de ventas con tres etapas (posible cliente, contactado y cliente). Cada tramo crece según el número de clientes y, al pulsarlo, filtra la lista.
- Cambio de estado de un cliente directamente desde la lista.
- Búsqueda por nombre, empresa o email.
- Eliminación de clientes con confirmación previa.
- Diseño adaptado a móvil.

## Tecnologías

- **React 19** con **TypeScript**, para la interfaz.
- **Vite**, como herramienta de desarrollo y empaquetado.
- **Supabase** (PostgreSQL), como base de datos y API.

## Cómo ejecutarlo

1. Crea un proyecto en [Supabase](https://supabase.com) y ejecuta el archivo `supabase/schema.sql` en el SQL Editor. Crea la tabla `clientes` con datos de ejemplo.
2. Copia `.env.example` como `.env` y rellena la URL y la clave pública de tu proyecto.
3. Instala las dependencias y arranca la aplicación:

```bash
npm install
npm run dev
```

## Estructura

```
src/
  App.tsx              Componente principal: estado y operaciones con Supabase
  supabaseClient.ts    Conexión con Supabase
  types.ts             Tipos de datos (Cliente, Estado)
  components/
    Embudo.tsx         Barra del embudo de ventas con filtro por etapa
    ClienteForm.tsx    Formulario de alta
    ClienteFila.tsx    Fila de la lista de clientes
supabase/
  schema.sql           Tabla, políticas de seguridad y datos de ejemplo
```

## Próximos pasos

- Login con Supabase Auth, para que cada usuario vea solo sus clientes mediante políticas RLS. Ahora mismo la política de seguridad es abierta, solo para la demostración.
- Edición completa de los datos de un cliente.
- Historial de interacciones (llamadas, reuniones, correos) por cliente.
- Versión móvil con React Native y Expo.

## Autora

[Laura Olmedo], técnica superior en Desarrollo de Aplicaciones Multiplataforma. Desarrollado con apoyo de asistentes de IA (Claude).
