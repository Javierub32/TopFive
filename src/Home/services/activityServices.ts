import { supabase } from 'lib/supabase';

export interface Activity {
  recurso_id: string;
  tipo_contenido: string;
  fechacreacion: string;
  fecha_actividad: string;
  calificacion: number | null;
  comentario: string | null;
  estado: string;
  titulo: string;
  imagen_url: string | null;
  usuarioId: string;
  username: string;
  avatar_url: string | null;
  idapi?: string | number;
}

export const activityService = {
  async getUltimosRecursosActivos(
    from: number = 0,
    to: number = 5,
    currentUserId: string
  ): Promise<Activity[]> {
    const { data: followedUsers } = await supabase
      .from('relationships')
      .select('following_id')
      .eq('follower_id', currentUserId)
      .eq('status', 'accepted');

    // Si no tienes amigos, retornamos una lista vacía
    if (!followedUsers || followedUsers.length === 0) return [];

    // Extraemos solo los IDs en un array: ['uuid1', 'uuid2', ...]
    const friendIds = followedUsers.map((rel) => rel.following_id);

    const { data, error } = await supabase
      .from('vista_actividad_reciente')
      .select(
        `
		recurso_id,
		tipo_contenido,
		fechacreacion,
		fecha_actividad,
		calificacion,
		comentario,
		estado,
		titulo,
		imagen_url,
    	username,
    	avatar_url,
		usuarioId,
		idapi
		`
      )
      .in('usuarioId', friendIds) // Solo actividades de amigos
      .eq('estado', 'COMPLETADO') // Solo actividades de recursos finalizados
      .not('fecha_actividad', 'is', null)
      .order('fecha_actividad', { ascending: false })
      .order('fechacreacion', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return data || [];
  },
};
