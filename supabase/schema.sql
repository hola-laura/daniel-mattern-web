-- Base de datos de la web de Daniel Mattern.
-- Lectura pública del contenido publicado. Edición solo para personas de la tabla editores.

create table editores (
  usuario_id uuid primary key references auth.users (id) on delete cascade,
  creado_en timestamptz not null default now()
);

create table cordilleras (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  grupo text not null check (grupo in ('España', 'El mundo')),
  zona text not null default '',
  cumbre text not null default '',
  altitud integer not null default 0 check (altitud >= 0),
  foto text not null default '',
  orden integer not null default 0
);

create table rutas (
  id uuid primary key default gen_random_uuid(),
  cordillera_id uuid references cordilleras (id) on delete set null,
  titulo text not null,
  publicada boolean not null default true,
  tipo text not null check (tipo in ('Senderismo', 'Trekking', 'Escalada', 'Raquetas', 'Cursos')),
  zona text not null default '',
  nivel text not null check (nivel in ('Iniciación', 'Medio', 'Exigente', 'Técnico')),
  grado text not null default '',
  distancia_km numeric(6, 1) not null default 0 check (distancia_km >= 0),
  desnivel_m integer not null default 0 check (desnivel_m >= 0),
  duracion text not null default '',
  precio numeric(8, 2) not null default 0 check (precio >= 0),
  plazas_max integer not null default 1 check (plazas_max >= 1),
  descripcion text not null default '',
  encuentro text not null default '',
  incluye text[] not null default '{}',
  material text[] not null default '{}',
  fotos text[] not null default '{}',
  altitudes integer[] not null default '{}',
  orden integer not null default 0,
  actualizada_en timestamptz not null default now()
);

create table salidas (
  id uuid primary key default gen_random_uuid(),
  ruta_id uuid not null references rutas (id) on delete cascade,
  inicio date not null,
  fin date,
  plazas_libres integer not null default 0 check (plazas_libres >= 0),
  check (fin is null or fin >= inicio)
);
create index salidas_ruta_idx on salidas (ruta_id);
create index salidas_inicio_idx on salidas (inicio);

-- Portada, servicios, reservas y demás bloques, con la misma forma que content/*.json.
create table contenido (
  clave text primary key,
  datos jsonb not null,
  actualizado_en timestamptz not null default now()
);

create function es_editor() returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from editores where usuario_id = auth.uid()) $$;

alter table editores enable row level security;
alter table cordilleras enable row level security;
alter table rutas enable row level security;
alter table salidas enable row level security;
alter table contenido enable row level security;

create policy "cada editor se ve a sí mismo" on editores for select using (usuario_id = auth.uid());

create policy "lectura pública" on cordilleras for select using (true);
create policy "edición" on cordilleras for all using (es_editor()) with check (es_editor());

create policy "lectura pública de lo publicado" on rutas for select using (publicada or es_editor());
create policy "edición" on rutas for all using (es_editor()) with check (es_editor());

create policy "lectura pública de lo publicado" on salidas for select
  using (exists (select 1 from rutas r where r.id = ruta_id and (r.publicada or es_editor())));
create policy "edición" on salidas for all using (es_editor()) with check (es_editor());

create policy "lectura pública" on contenido for select using (true);
create policy "edición" on contenido for all using (es_editor()) with check (es_editor());
