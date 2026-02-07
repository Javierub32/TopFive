import { supabase } from 'lib/supabase';

export type CollectionType = 'LIBRO' | 'VIDEOJUEGO' | 'PELICULA' | 'SERIE' | 'ALBUM' | 'CANCION';

export interface ListInfo {
  id: string;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  color: string | null;
  tipo: CollectionType;
  totalElementos: number;
  previewImagenes: string[];
}

export const listServices = {
  async createList(
    userId: string,
    nombre: string,
    descripcion: string | null,
    icono: string | null,
    color: string | null,
    tipo: CollectionType
  ) {
    const { data, error } = await supabase
      .from('recursocoleccion')
      .insert({
        usuarioid: userId,
        nombrecoleccion: nombre,
        descripcion: descripcion,
        icono: icono,
        color: color,
        tipo_contenido: tipo,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateList(
    userId: string,
    listId: string,
    nombre: string,
    descripcion: string | null,
    icono: string | null,
    color: string | null
  ) {
    const { data, error } = await supabase
      .from('recursocoleccion')
      .update({
        nombrecoleccion: nombre,
        descripcion: descripcion,
        icono: icono,
        color: color,
      })
      .eq('id', listId)
      .eq('usuarioid', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteList(userId: string, listId: string) {
    const { error } = await supabase
      .from('recursocoleccion')
      .delete()
      .eq('id', listId)
      .eq('usuarioid', userId);

    if (error) throw error;
    return true;
  },

  async addItemToList(listId: string, itemId: string | number, itemType: CollectionType) {
    let tableName = '';
    let resourceColumn = '';

    switch (itemType) {
      case 'LIBRO':
        tableName = 'itemcoleccion_libro';
        resourceColumn = 'recursolibroid';
        break;
      case 'PELICULA':
        tableName = 'itemcoleccion_pelicula';
        resourceColumn = 'recursopeliculaid';
        break;
      case 'SERIE':
        tableName = 'itemcoleccion_serie';
        resourceColumn = 'recursoserieid';
        break;
      case 'VIDEOJUEGO':
        tableName = 'itemcoleccion_videojuego';
        resourceColumn = 'recursovideojuegoid';
        break;
      case 'ALBUM':
        tableName = 'itemcoleccion_album';
        resourceColumn = 'recursoalbumid';
        break;
      case 'CANCION':
        tableName = 'itemcoleccion_cancion';
        resourceColumn = 'recursocancionid';
        break;
      default:
        throw new Error(`Tipo de contenido no soportado: ${itemType}`);
    }

    const existingCheck = await supabase
      .from(tableName)
      .select('id')
      .eq('coleccionid', listId)
      .eq(resourceColumn, itemId)
      .single();

    if (existingCheck.data) {
      return 'El ítem ya está en la lista.';
    }

    const { error } = await supabase
      .from(tableName)
      .insert({
        coleccionid: listId,
        [resourceColumn]: itemId,
      })
      .single();

    if (error) {
      // Manejo de errores comunes
      if (error.code === '23503') {
        // Foreign Key Violation
        throw new Error(
          'No se pudo agregar: Verifica que el tipo del item coincida con el tipo de la lista.'
        );
      }
      if (error.code === '42501') {
        // RLS Violation
        throw new Error('No tienes permiso para agregar items a esta lista.');
      }
      throw error;
    }

    return 'Recurso añadido a la lista exitosamente.';
  },

  async removeItemFromList(listId: string, resourceId: string | number, itemType: CollectionType) {
    let tableName = '';
    let resourceColumn = '';

    // Mapeo para saber qué tabla y columna usar
    switch (itemType) {
      case 'LIBRO':
        tableName = 'itemcoleccion_libro';
        resourceColumn = 'recursolibroid';
        break;
      case 'PELICULA':
        tableName = 'itemcoleccion_pelicula';
        resourceColumn = 'recursopeliculaid';
        break;
      case 'SERIE':
        tableName = 'itemcoleccion_serie';
        resourceColumn = 'recursoserieid';
        break;
      case 'VIDEOJUEGO':
        tableName = 'itemcoleccion_videojuego';
        resourceColumn = 'recursovideojuegoid';
        break;
      case 'ALBUM':
        tableName = 'itemcoleccion_album';
        resourceColumn = 'recursoalbumid';
        break;
      case 'CANCION':
        tableName = 'itemcoleccion_cancion';
        resourceColumn = 'recursocancionid';
        break;
      default:
        throw new Error(`Tipo de contenido inválido: ${itemType}`);
    }

    const { error, count } = await supabase
      .from(tableName)
      .delete()
      .match({
        coleccionid: listId,
        [resourceColumn]: resourceId,
      });

    if (error) throw error;

    // Verificar si se borró algo (por si falla la RLS)
    if (count === 0) throw new Error('No se encontró el ítem o no tienes permisos');

    return true;
  },

  async fetchListInfo(userId: string, listType: CollectionType) {
    let itemTable = '';
    let resourceTable = '';
    let contentTable = '';

    switch (listType) {
      case 'LIBRO':
        itemTable = 'itemcoleccion_libro';
        resourceTable = 'recursolibro';
        contentTable = 'contenidolibro';
        break;
      case 'PELICULA':
        itemTable = 'itemcoleccion_pelicula';
        resourceTable = 'recursopelicula';
        contentTable = 'contenidopelicula';
        break;
      case 'SERIE':
        itemTable = 'itemcoleccion_serie';
        resourceTable = 'recursoserie';
        contentTable = 'contenidoserie';
        break;
      case 'VIDEOJUEGO':
        itemTable = 'itemcoleccion_videojuego';
        resourceTable = 'recursovideojuego';
        contentTable = 'contenidovideojuego';
        break;
      case 'ALBUM':
        itemTable = 'itemcoleccion_album';
        resourceTable = 'recursoalbum';
        contentTable = 'contenidoalbum';
        break;
      case 'CANCION':
        itemTable = 'itemcoleccion_cancion';
        resourceTable = 'recursocancion';
        contentTable = 'contenidocancion';
        break;
      default:
        // Si el tipo no es válido, lanzamos un error o devolvemos un array vacío.
        console.error('Tipo de contenido no soportado:', listType);
        return [];
    }

    // Obtenemos la info base de las listas del usuario.
    const { data: listsData, error: listsError } = await supabase
      .from('recursocoleccion')
      .select('id, nombrecoleccion, descripcion, icono, color, tipo_contenido')
      .eq('usuarioid', userId)
      .eq('tipo_contenido', listType);

    if (listsError) {
      console.error('Error al obtener las listas del usuario por tipo:', listsError);
      throw listsError;
    }

    // Si el usuario no tiene listas, devolvemos un array vacío.
    if (!listsData || listsData.length === 0) {
      return [];
    }

    // Creamos un array de promesas para obtener los items de cada lista en paralelo.
    const itemDetailsPromises = listsData.map((list) => {
      return supabase
        .from(itemTable)
        .select(
          `
        recurso: ${resourceTable}!inner (
          contenido: ${contentTable}!inner ( imagenUrl )
        )
      `,
          { count: 'exact', head: false }
        )
        .eq('coleccionid', list.id)
        .order('fechaagregado', { ascending: false })
        .limit(5);
    });

    // Ejecutamos todas las promesas de items simultáneamente.
    const allItemsResponses = await Promise.all(itemDetailsPromises);

    // Mapeamos los resultados para combinar la info de la lista con la de sus items.
    const result: ListInfo[] = listsData.map((list, index) => {
      const itemsResponse = allItemsResponses[index];

      if (itemsResponse.error) {
        console.error(`Error al obtener items para la lista ${list.id}:`, itemsResponse.error);
      }

      const previewImages = (itemsResponse.data || [])
        .map((item: any) => item.recurso?.contenido?.imagenUrl)
        .filter((url): url is string => !!url);

      return {
        id: list.id,
        nombre: list.nombrecoleccion,
        descripcion: list.descripcion,
        icono: list.icono,
        color: list.color,
        tipo: list.tipo_contenido as CollectionType,
        totalElementos: itemsResponse.count || 0,
        previewImagenes: previewImages,
      };
    });

    return result;
  },

  async fetchListDetails(listId: string, listType: CollectionType, from: number = 0, to: number = 9) {
    let itemTable = '';
    let resourceTable = '';
    let contentTable = '';
    // Esta variable es la clave para que funcione handleItemPress
    // Las pantallas de detalle buscan: item.contenidopelicula, item.contenidolibro, etc.
    let contentKey = '';

    switch (listType) {
      case 'LIBRO':
        itemTable = 'itemcoleccion_libro';
        resourceTable = 'recursolibro';
        contentTable = 'contenidolibro';
        contentKey = 'contenidolibro';
        break;
      case 'PELICULA':
        itemTable = 'itemcoleccion_pelicula';
        resourceTable = 'recursopelicula';
        contentTable = 'contenidopelicula';
        contentKey = 'contenidopelicula';
        break;
      case 'SERIE':
        itemTable = 'itemcoleccion_serie';
        resourceTable = 'recursoserie';
        contentTable = 'contenidoserie';
        contentKey = 'contenidoserie';
        break;
      case 'VIDEOJUEGO':
        itemTable = 'itemcoleccion_videojuego';
        resourceTable = 'recursovideojuego';
        contentTable = 'contenidovideojuego';
        contentKey = 'contenidovideojuego';
        break;
      case 'ALBUM':
        itemTable = 'itemcoleccion_album';
        resourceTable = 'recursoalbum';
        contentTable = 'contenidoalbum';
        contentKey = 'contenidoalbum';
        break;
      case 'CANCION':
        itemTable = 'itemcoleccion_cancion';
        resourceTable = 'recursocancion';
        contentTable = 'contenidocancion';
        contentKey = 'contenidocancion';
        break;
      default:
        throw new Error('Tipo de lista no soportado');
    }

    // Pedimos TODO (*) del contenido para que no falte descripción, género, etc.
    const { data, error } = await supabase
      .from(itemTable)
      .select(
        `
			id,
			fechaagregado,
			recurso: ${resourceTable} (
				*,
				contenido: ${contentTable} (*)
			)
			`
      )
      .eq('coleccionid', listId)
      .order('fechaagregado', { ascending: false })
	  .range(from, to);

    if (error) {
      console.error('Error al obtener los detalles de la lista:', error);
      throw error;
    }

    // Transformamos la respuesta para que sea idéntica a un Recurso estándar
    const formattedItems = (data || []).map((item: any) => {
      const recurso = item.recurso || {};

      // Separamos la propiedad 'contenido' (que es el alias genérico de la query)
      // del resto de datos del recurso (calificación, estado, fechas...)
      const { contenido, ...restoDelRecurso } = recurso;

      return {
        // 1. Ponemos los datos del recurso (id, usuarioId, estado, reseña...)
        ...restoDelRecurso,

        // 2. Metemos el contenido DENTRO de la clave específica (ej: contenidopelicula)
        // Esto es lo que permite que las pantallas de detalle funcionen sin cambios.
        [contentKey]: contenido,

        // 3. (Opcional) Guardamos el ID de la relación con la lista por si acaso
        listItemId: item.id,
      };
    });

    return formattedItems;
  },
};
