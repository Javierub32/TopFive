import { supabase } from 'lib/supabase';
import { RESOURCE_CONFIG, ResourceType } from 'hooks/useResource';

const RESOURCE_NOTIFICATIONS_TABLE = 'notificacionrecurso';

const RESOURCE_TYPE_ALIASES: Record<string, ResourceType[]> = {
  libro: ['libro'],
  book: ['libro'],
  videojuego: ['videojuego'],
  game: ['videojuego'],
  musica: ['cancion'],
  cancion: ['cancion'],
  song: ['cancion'],
  pelicula: ['pelicula'],
  film: ['pelicula'],
  movie: ['pelicula'],
  serie: ['serie'],
  series: ['serie'],
  audiovisual: ['pelicula', 'serie'],
};

export const notificationServices = {
  async fetchNotifications(userId: string, from: number, to: number) {
    const { data, error } = await supabase
      .from('relationships')
      /* Usamos follower para saber quién me intenta seguir o quién me sigue*/
      .select(
        `
			id, 
			follower_id, 
			following_id, 
			status,
			created_at,
			follower:usuario!follower_id (
				id,
				username,
				avatar_url,
				description
			)
		`
      )
      .eq('following_id', userId)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (
      data?.map((notification) => ({
        id: notification.id,
        follower_id: notification.follower_id,
        following_id: notification.following_id,
        status: notification.status,
        created_at: notification.created_at,
        user: notification.follower,
      })) || []
    );
  },

  async fetchResourceNotifications(userId: string, from: number, to: number) {
    const { data, error } = await supabase
      .from(RESOURCE_NOTIFICATIONS_TABLE)
      .select('id, created_at, read, resource_id, resource_type, is_comment')
      .eq('user_id', userId)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const rows = data ?? [];
    if (rows.length === 0) return { items: [], rawCount: 0 };

    const candidatesOf = (resourceType: unknown) =>
      RESOURCE_TYPE_ALIASES[String(resourceType ?? '').toLowerCase()] ?? [];

    const idsByType = new Map<ResourceType, Set<number>>();
    for (const row of rows) {
      for (const type of candidatesOf(row.resource_type)) {
        const ids = idsByType.get(type) ?? new Set<number>();
        ids.add(Number(row.resource_id));
        idsByType.set(type, ids);
      }
    }

    const resolved = new Map<string, { type: ResourceType; resource: any }>();

    await Promise.all(
      Array.from(idsByType).map(async ([type, ids]) => {
        const config = RESOURCE_CONFIG[type];
        const { data: resources, error: resourceError } = await supabase
          .from(config.table)
          .select(
            `*, ${config.contentJoin} ( id, idApi, titulo, imagenUrl, fechaLanzamiento )` as any
          )
          .in('id', Array.from(ids));

        if (resourceError) throw resourceError;

        for (const resource of (resources ?? []) as any[]) {
          const contenido = resource[config.contentJoin];
          delete resource[config.contentJoin];

          resolved.set(`${type}:${resource.id}`, {
            type,
            /* Mismo formato que devuelve useResource.fetchResources, para poder navegar al detalle. */
            resource: {
              ...resource,
              contenido: contenido ? { ...contenido, apiId: contenido.idApi } : null,
            },
          });
        }
      })
    );

    const items = rows.flatMap((row) => {
      const match = candidatesOf(row.resource_type)
        .map((type) => resolved.get(`${type}:${Number(row.resource_id)}`))
        .find(Boolean);

      /* Si el recurso ya no existe (o no es visible) no hay nada que mostrar. */
      if (!match) return [];

      return [
        {
          id: row.id as number,
          date: row.created_at as string,
          read: !!row.read,
          isComment: !!row.is_comment,
          resourceId: Number(row.resource_id),
          resourceType: match.type,
          title: match.resource.contenido?.titulo ?? '',
          imageUrl: match.resource.contenido?.imagenUrl ?? null,
          resource: match.resource,
        },
      ];
    });

    /* rawCount son las filas leídas de la tabla (no las visibles), para saber si queda otra página. */
    return { items, rawCount: rows.length };
  },

  async acceptNotification(followerId: string, followingId: string) {
    const { data, error } = await supabase
      .from('relationships')
      .update({ status: 'accepted' })
      .eq('following_id', followingId)
      .eq('follower_id', followerId);

    if (error) throw error;

    return data;
  },

  async declineNotification(followerId: string, followingId: string) {
    const { error } = await supabase
      .from('relationships')
      .delete()
      .eq('following_id', followingId)
      .eq('follower_id', followerId);

    if (error) throw error;
  },

  /**
   * Marca como leídas todas las notificaciones de recurso del usuario. Idempotente: el
   * filtro por `read` hace que una segunda llamada no toque ninguna fila.
   */
  async markResourceNotificationsRead(userId: string) {
    const { error } = await supabase
      .from(RESOURCE_NOTIFICATIONS_TABLE)
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  },

  /**
   * Lo que cuenta el badge: peticiones de seguimiento pendientes + notificaciones de
   * recurso sin leer. Las sociales no tienen `read`; su equivalente es el estado 'pending'.
   */
  async countUnreadNotifications(userId: string) {
    const [follows, resources] = await Promise.all([
      supabase
        .from('relationships')
        .select('id', { count: 'exact', head: true })
        .eq('following_id', userId)
        .eq('status', 'pending'),
      supabase
        .from(RESOURCE_NOTIFICATIONS_TABLE)
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false),
    ]);

    if (follows.error) throw follows.error;
    if (resources.error) throw resources.error;

    return (follows.count ?? 0) + (resources.count ?? 0);
  },
};
