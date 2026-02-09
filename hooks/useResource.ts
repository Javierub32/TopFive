import { supabase } from '../lib/supabase';
import { useAuth } from 'context/AuthContext';
import { BookResource, FilmResource, GameResource, SeriesResource, SongResource } from 'app/types/Resources';

// Definimos los tipos de recursos válidos y sus interfaces de configuración
export type ResourceType = 'pelicula' | 'serie' | 'videojuego' | 'libro' | 'cancion';
export const RESOURCE_TYPES: ResourceType[] = ['libro', 'pelicula', 'serie', 'videojuego', 'cancion'];

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

export const useResource = () => {
  const { user } = useAuth();

  // Función genérica para todos los recursos
  const fetchResources = async <K extends ResourceType>(
    type: K,
    term?: string | null,
    favorito?: boolean | null,
    estado?: StateType | null,
    cantidad?: number | null,
    ordenarPorFecha?: boolean | null,
    profile?: boolean | null,
    from?: number | null,
    to?: number | null
  ): Promise<ResourceMap[K][] | null> => {
    try {
      if (!user) throw new Error('User not authenticated');

      const config = RESOURCE_CONFIG[type];
      const isSearch = term !== undefined && term !== null && term !== '';
      const joinModifier = isSearch ? '!inner' : '';

      // Query base por defecto
      let query = supabase
        .from(config.table)
        .select(`
            *, 
            ${config.contentJoin}${joinModifier} (
                titulo,
                imagenUrl,
                fechaLanzamiento
            )
        ` as any)
        .eq('usuarioId', user.id);


      // Sobrescribimos la query para traer solo el campo de fecha necesario para las estadísticas generales
      if (profile) {
        let dateField = DATE_FIELDS[type];

        query = supabase
          .from(config.table)
          .select(dateField as any)
          .eq('usuarioId', user.id);
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

      if (ordenarPorFecha === true) {
        query = query.order('fechacreacion', { ascending: false });
      } else if (ordenarPorFecha === false) {
        query = query.order('fechacreacion', { ascending: true });
      }

      if (cantidad !== undefined && cantidad !== null) {
        query = query.limit(cantidad);
      }

      const { data, error } = await query;

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
        
        console.log(`${type} recuperados y normalizados:`, normalizedData);
        return normalizedData as unknown as ResourceMap[K][];
    }

    // Si es modo profile o no hay data, devolvemos tal cual
    return data as unknown as ResourceMap[K][];

    } catch (error) {
      console.error(`Error al obtener ${type}:`, error);
      return null;
    }
  };

  // Mantenemos la lógica de borrarRecurso
  const borrarRecurso = async (
    recursoId: any,
    tipoRecurso: ResourceType
  ) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const config = RESOURCE_CONFIG[tipoRecurso];
      
      const { data, error } = await supabase
        .from(config.table)
        .delete()
        .eq('usuarioId', user.id)
        .eq('id', recursoId);

      if (error) throw error;
      console.log(`Recurso ${tipoRecurso} borrado:`, data);
      return data;
    } catch (error) {
      console.error(`Error al borrar recurso ${tipoRecurso}:`, error);
      return null;
    }
  };

  const calcularTotal = async (
    tipoRecurso: ResourceType,
    estado: 'COMPLETADO' | 'EN_CURSO' | 'PENDIENTE'
  ) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const config = RESOURCE_CONFIG[tipoRecurso];

      const { count, error } = await supabase
        .from(config.table)
        .select('id', { count: 'exact', head: true })
        .eq('usuarioId', user.id)
        .eq('estado', estado);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error(`Error total ${tipoRecurso}:`, error);
      return 0;
    }
  };

  return {
    fetchResources,
    borrarRecurso,
    calcularTotal,
  };
};