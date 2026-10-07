-- Notificaciones de actividad (me gusta y comentarios) sobre recursos propios.
--
-- Modelo agregado: una sola fila por (user_id, resource_id, resource_type, is_comment),
-- que se refresca en cada nueva actividad en vez de insertar una fila por evento. Por eso
-- created_at significa "última actividad" y `read` vuelve a false al actualizarse.
--
-- OJO: en este repo no hay pipeline de migraciones; esto se aplica a mano en el SQL editor
-- de Supabase. El fichero existe para que la lógica quede versionada y revisable, no
-- porque se ejecute automáticamente.


-- 1. Clave de agregación -----------------------------------------------------------------
-- Sin este índice el ON CONFLICT no tiene a qué agarrarse. is_comment forma parte de la
-- clave para que un mismo recurso pueda tener a la vez una fila de me gusta y otra de
-- comentarios.
--
-- Si la tabla ya tuviera duplicados, esta sentencia falla: hay que limpiarlos antes.
create unique index if not exists notificacionrecurso_unico
  on notificacionrecurso (user_id, resource_id, resource_type, is_comment);

-- Índice de lectura: la lista filtra por user_id y ordena por created_at desc. El índice
-- único de arriba cubre el filtro (empieza por user_id) pero no el orden.
create index if not exists notificacionrecurso_user_fecha
  on notificacionrecurso (user_id, created_at desc);


-- 2. Dueño de un recurso -----------------------------------------------------------------
-- resource_type es el `tiporecurso` del recurso (LIBRO | AUDIOVISUAL | VIDEOJUEGO | MUSICA),
-- que no distingue película de serie, así que AUDIOVISUAL obliga a mirar en las dos tablas.
create or replace function public.resource_owner(
  p_resource_id bigint,
  p_resource_type text
)
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_owner uuid;
begin
  case upper(p_resource_type)
    when 'LIBRO' then
      select "usuarioId" into v_owner from recursolibro where id = p_resource_id;

    when 'VIDEOJUEGO' then
      select "usuarioId" into v_owner from recursovideojuego where id = p_resource_id;

    when 'MUSICA' then
      select "usuarioId" into v_owner from recursocancion where id = p_resource_id;

    when 'AUDIOVISUAL' then
      select "usuarioId" into v_owner from recursopelicula where id = p_resource_id;
      if v_owner is null then
        select "usuarioId" into v_owner from recursoserie where id = p_resource_id;
      end if;

    else
      v_owner := null;
  end case;

  return v_owner;
end;
$$;


-- 3. Alta / refresco de la notificación --------------------------------------------------
-- Función común a `like` y a `comentario`: el flag is_comment llega como argumento del
-- trigger, que es lo único que diferencia los dos casos.
create or replace function public.notify_resource_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
  v_is_comment boolean := coalesce(tg_argv[0], 'false')::boolean;
begin
  v_owner := public.resource_owner(new.resource_id, new.resource_type);

  -- Recurso inexistente o resource_type desconocido: no hay a quién notificar.
  if v_owner is null then
    return new;
  end if;

  -- No te notificas a ti mismo por dar me gusta a tu propia reseña.
  if v_owner = new.user_id then
    return new;
  end if;

  insert into notificacionrecurso (
    user_id, resource_id, resource_type, is_comment, created_at, "read"
  )
  values (
    v_owner, new.resource_id, new.resource_type, v_is_comment, now(), false
  )
  on conflict (user_id, resource_id, resource_type, is_comment)
  do update set
    created_at = now(),
    -- Imprescindible: si la fila ya estaba leída, sin esto no volvería a avisar nunca.
    "read" = false;

  return new;

exception
  when others then
    -- El trigger va en la misma transacción que el insert, así que un fallo aquí tumbaría
    -- el me gusta o el comentario. Una notificación perdida es mucho más barata que eso.
    raise warning 'notify_resource_activity falló para % %: %',
      new.resource_type, new.resource_id, sqlerrm;
    return new;
end;
$$;


-- 4. Triggers ----------------------------------------------------------------------------
-- `like` es palabra reservada, de ahí las comillas.
drop trigger if exists like_notifica_recurso on "like";
create trigger like_notifica_recurso
  after insert on "like"
  for each row
  execute function public.notify_resource_activity('false');

drop trigger if exists comentario_notifica_recurso on comentario;
create trigger comentario_notifica_recurso
  after insert on comentario
  for each row
  execute function public.notify_resource_activity('true');


-- 5. RLS ---------------------------------------------------------------------------------
-- La tabla no tenía ninguna política, lo que según el estado de RLS significa o que no se
-- permite nada (lista vacía y update a 0 filas, sin error) o que se permite todo
-- (cualquiera con la anon key leyendo las notificaciones de los demás). Esto cierra las dos.
--
-- El cliente NO necesita permiso de INSERT: la función del trigger es security definer y
-- escribe con los privilegios de su dueño, así que RLS no se le aplica. Activar RLS aquí no
-- rompe la creación de notificaciones.
--
-- Comprobar en qué estado está antes de ejecutar:
--   select relrowsecurity from pg_class where relname = 'notificacionrecurso';

alter table notificacionrecurso enable row level security;

-- Leer solo las tuyas.
drop policy if exists notificacionrecurso_select_propias on notificacionrecurso;
create policy notificacionrecurso_select_propias
  on notificacionrecurso for select
  to authenticated
  using (user_id = auth.uid());

-- Marcar como leídas solo las tuyas. Sin esta política,
-- markResourceNotificationsRead no falla pero no modifica nada y el badge no baja nunca.
drop policy if exists notificacionrecurso_update_propias on notificacionrecurso;
create policy notificacionrecurso_update_propias
  on notificacionrecurso for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Deliberadamente NO hay política de insert ni de delete: nada en la app crea ni borra
-- notificaciones, solo el trigger.
