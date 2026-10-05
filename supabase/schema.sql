-- Tabla de clientes del mini CRM.
-- Pégalo en Supabase -> SQL Editor y pulsa Run.

create table clientes (
  id bigint generated always as identity primary key,
  nombre text not null,
  empresa text,
  email text,
  telefono text,
  estado text not null default 'posible'
    check (estado in ('posible', 'contactado', 'cliente')),
  notas text,
  created_at timestamptz not null default now()
);

-- Seguridad a nivel de fila (RLS).
-- Para esta versión de demostración, sin login, permitimos leer y escribir a cualquiera.
-- En la siguiente versión se añadirá login y cada usuario verá solo sus clientes.
alter table clientes enable row level security;

create policy "Acceso de demostración"
  on clientes for all
  to anon, authenticated
  using (true)
  with check (true);

grant select, insert, update, delete on clientes to anon, authenticated;

-- Datos de ejemplo
insert into clientes (nombre, empresa, email, telefono, estado, notas) values
  ('Marta Ruiz', 'Ruiz Reformas', 'marta@ruizreformas.es', '600 111 222', 'cliente', 'Contrató la web en septiembre.'),
  ('Javier Morales', 'Clínica Dental Sonríe', 'javier@sonrie.es', '611 333 444', 'contactado', 'Interesado en un sistema de citas. Volver a llamar el jueves.'),
  ('Lucía Fernández', 'Academia Alfa', 'lucia@academiaalfa.es', null, 'posible', 'Llegó por el formulario de la web.'),
  ('Antonio Gil', 'Talleres Gil', null, '622 555 666', 'posible', null),
  ('Elena Vázquez', 'Inmobiliaria Giralda', 'elena@giralda.es', '633 777 888', 'contactado', 'Pide presupuesto para un CRM a medida.');
