import { supabase } from '../lib/supabase';
import { useAuth } from 'context/AuthContext';
import {
  BookResource,
  FilmResource,
  GameResource,
  SeriesResource,
  SongResource,
} from 'app/types/Resources';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';

// Definimos los tipos de recursos válidos y sus interfaces de configuración
export type ResourceType = 'pelicula' | 'serie' | 'videojuego' | 'libro' | 'cancion';
export const RESOURCE_TYPES: ResourceType[] = [
  'libro',
  'serie',
  'pelicula',
  'videojuego',
  'cancion',
];

export type StateType = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';

export type ResourceMap = {
  pelicula: FilmResource;
  serie: SeriesResource;
  videojuego: GameResource;
  libro: BookResource;
  cancion: SongResource;
};

// Configuración de tablas para no tener que hacer un switch gigante para todo
export const RESOURCE_CONFIG: Record<ResourceType, { table: string; contentJoin: string }> = {
  pelicula: { table: 'recursopelicula', contentJoin: 'contenidopelicula' },
  serie: { table: 'recursoserie', contentJoin: 'contenidoserie' },
  videojuego: { table: 'recursovideojuego', contentJoin: 'contenidovideojuego' },
  libro: { table: 'recursolibro', contentJoin: 'contenidolibro' },
  cancion: { table: 'recursocancion', contentJoin: 'contenidocancion' },
};

export const DATE_FIELDS: Record<ResourceType, string> = {
  libro: 'fechaFin',
  pelicula: 'fechaVisionado',
  serie: 'fechaFin',
  cancion: 'fechaEscucha',
  videojuego: 'fechaFin',
};

export interface FetchResourcesParams<K extends ResourceType> {
  type: K;
  term?: string | null;
  favorito?: boolean | null;
  estado?: StateType | null;
  cantidad?: number | null;
  ordenarPorFecha?: boolean | null;
  profile?: boolean | null;
  from?: number | null;
  to?: number | null;
  targetUserId?: string | null;
  ordenarPorUltimaActividad?: boolean | null;
  recursoId?: number | null;
  includeCount?: boolean;
}

export interface FetchResourcesResponse<K extends ResourceType> {
  data: ResourceMap[K][] | null;
  count: number | null;
}

export const useResource = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Función genérica para todos los recursos
  const fetchResources = async <K extends ResourceType>({
    type,
    term,
    favorito,
    estado,
    cantidad,
    ordenarPorFecha,
    profile,
    from,
    to,
    targetUserId,
    ordenarPorUltimaActividad,
    recursoId,
    includeCount = false,
  }: FetchResourcesParams<K>): Promise<FetchResourcesResponse<K>> => {
    try {
      if (!user) throw new Error('User not authenticated');

      const userIdToQuery = targetUserId || user.id;

      const config = RESOURCE_CONFIG[type];
      const isSearch = term !== undefined && term !== null && term !== '';
      const joinModifier = isSearch ? '!inner' : '';
      const selectOptions = includeCount ? { count: 'exact' as const } : undefined;

      // Query base por defecto
      let query = supabase
        .from(config.table)
        .select(
          `
            *, 
            ${config.contentJoin}${joinModifier} (
                titulo,
                imagenUrl,
                fechaLanzamiento
            )
        ` as any,
          selectOptions
        )
        .eq('usuarioId', userIdToQuery);

      if (recursoId !== undefined && recursoId !== null) {
        query = query.eq('id', recursoId);
      }

      // Sobrescribimos la query para traer solo el campo de fecha necesario para las estadísticas generales
      if (profile) {
        let dateField = DATE_FIELDS[type];

        query = supabase
          .from(config.table)
          .select(dateField as any, selectOptions)
          .eq('usuarioId', userIdToQuery);
      }

      if (from != undefined && to != null) {
        query = query.range(from, to);
      }

      // Filtros adicionales
      if (favorito === true) {
        query = query.eq('favorito', true);
      }

      if (estado !== undefined && estado !== null) {
        query = query.eq('estado', estado);
      }

      if (isSearch) {
        query = query.ilike(`${config.contentJoin}.titulo`, `%${term}%`);
      }

      if (ordenarPorUltimaActividad === true) {
        query = query.order(DATE_FIELDS[type], { ascending: false, nullsFirst: false });
      } else if (ordenarPorFecha === true) {
        query = query.order('fechacreacion', { ascending: false });
      } else if (ordenarPorFecha === false) {
        query = query.order('fechacreacion', { ascending: true });
      }

      if (cantidad !== undefined && cantidad !== null) {
        query = query.limit(cantidad);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      // Normalizamos los datos para tenerlos en el mismo formato
      if (data && !profile) {
        const normalizedData = data.map((item: any) => {
          if (item[config.contentJoin]) {
            item.contenido = item[config.contentJoin];
            delete item[config.contentJoin];
          }
          return item;
        });
        return { data: normalizedData, count } as unknown as FetchResourcesResponse<K>;
      }

      // Si es modo profile o no hay data, devolvemos tal cual
      return { data, count } as unknown as FetchResourcesResponse<K>;
    } catch (error) {
      console.error(`Error al obtener ${type}:`, error);
      return { data: null, count: null } as FetchResourcesResponse<K>;
    }
  };

  // Mantenemos la lógica de borrarRecurso
  const borrarRecurso = async (recursoId: any, tipoRecurso: ResourceType, estado: string) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const config = RESOURCE_CONFIG[tipoRecurso];

      const { data, error } = await supabase
        .from(config.table)
        .delete()
        .eq('usuarioId', user.id)
        .eq('id', recursoId);

      if (error) throw error;
      if (estado === 'COMPLETADO') {
        await supabase.rpc('decrement_review_count', { user_id: user.id });
      }
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.collectionOverview(user.id, tipoRecurso),
        }),
        queryClient.invalidateQueries({
          queryKey: ['collection', 'group', user.id, tipoRecurso],
        }),
        queryClient.invalidateQueries({ queryKey: ['resources', user.id, tipoRecurso] }),
        queryClient.invalidateQueries({ queryKey: ['lists'] }),
        queryClient.invalidateQueries({ queryKey: queryKeys.profile(user.id) }),
        queryClient.invalidateQueries({ queryKey: ['profile', 'stats', user.id] }),
        queryClient.invalidateQueries({ queryKey: queryKeys.topFive(user.id) }),
        queryClient.invalidateQueries({ queryKey: ['topFive', 'selector', user.id] }),
      ]);
      return data;
    } catch (error) {
      console.error(`Error al borrar recurso ${tipoRecurso}:`, error);
      return null;
    }
  };

  const fetchMonthlyStats = async (
    tipoRecurso: ResourceType,
    year: number,
    targetUserId?: string
  ): Promise<number[]> => {
    try {
      if (!user) throw new Error('User not authenticated');

      const userIdToQuery = targetUserId || user.id;
      const config = RESOURCE_CONFIG[tipoRecurso];
      const dateField = DATE_FIELDS[tipoRecurso];

      const { data, error } = await supabase.rpc('get_monthly_resource_stats', {
        p_user_id: userIdToQuery,
        p_table_name: config.table,
        p_date_field: dateField,
        p_year: year,
      });

      if (error) throw error;

      const chartData = new Array(12).fill(0);

      // Mapeamos los resultados a nuestro array de 12 meses. Ej. [0, 5, 2, 0, 10, 0, 0, 0, 0, 0, 0, 0]
      if (data) {
        data.forEach((row: { month: number; count: number }) => {
          chartData[row.month - 1] = Number(row.count);
        });
      }

      return chartData;
    } catch (error) {
      console.error(`Error al obtener stats de ${tipoRecurso}:`, error);
      return new Array(12).fill(0); // Devuelve datos vacíos para no romper la UI
    }
  };

  const checkIfResourceExists = async (apiId: string | number | null, type: ResourceType) => {
    if (!apiId) return null;
    try {
      if (!user) throw new Error('User not authenticated');

      const config = RESOURCE_CONFIG[type];
      const { data, error } = await supabase
        .from(config.table)
        .select(
          `
          *,
          ${config.contentJoin}!inner(*)
          `
        )
        .eq('usuarioId', user.id)
        .eq(`${config.contentJoin}.idApi`, apiId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const dataObj = data as Record<string, any>;
      const normalizedData = { ...dataObj };
      if (normalizedData[config.contentJoin]) {
        normalizedData.contenido = normalizedData[config.contentJoin];
        delete normalizedData[config.contentJoin];
      }

      return normalizedData;
    } catch (error) {
      console.error(`Error al comprobar si existe el recurso ${type}: `, error);
      return null;
    }
  };

  return {
    fetchResources,
    borrarRecurso,
    checkIfResourceExists,
    fetchMonthlyStats,
  };
};
