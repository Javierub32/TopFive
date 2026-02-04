import { supabase } from 'lib/supabase';

export type CollectionType = 'LIBRO' | 'VIDEOJUEGO' | 'PELICULA' | 'SERIE' | 'ALBUM' | 'CANCION';

export const listServices = {
  async createList( userId: string, nombre: string, resena: string, calificacion: number, favorito: boolean, tipo: CollectionType ) {
    const { data, error } = await supabase
      .from('recursocoleccion')
      .insert({
        usuarioid: userId,
        nombrecoleccion: nombre,
        resena: resena,
        calificacion: calificacion,
        favorito: favorito,
        tipo_contenido: tipo, 
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateList( userId: string, listId: string, nombre: string, resena: string, calificacion: number, favorito: boolean ) {
    const { data, error } = await supabase
      .from('recursocoleccion')
      .update({
        nombrecoleccion: nombre,
        resena: resena,
        calificacion: calificacion,
        favorito: favorito,
      })
      .eq('id', listId)
      .eq('usuarioid', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteList( userId: string, listId: string) {
    const { error } = await supabase
      .from('recursocoleccion')
      .delete()
      .eq('id', listId)
      .eq('usuarioid', userId);

    if (error) throw error;
    return true;
  },

  async addItemToList( listId: string, itemId: string | number, itemType: CollectionType ) {
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

    const { data, error } = await supabase
      .from(tableName)
      .insert({
        coleccionid: listId,
        [resourceColumn]: itemId,
      })
      .select()
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

    return data;
  },

  async removeItemFromList( listId: string, resourceId: string | number, itemType: CollectionType) {
    let tableName = '';
    let resourceColumn = '';

    // Mapeo para saber qué tabla y columna usar
    switch (itemType) {
      case 'LIBRO':      tableName = 'itemcoleccion_libro';      resourceColumn = 'recursolibroid'; break;
      case 'PELICULA':   tableName = 'itemcoleccion_pelicula';   resourceColumn = 'recursopeliculaid'; break;
      case 'SERIE':      tableName = 'itemcoleccion_serie';      resourceColumn = 'recursoserieid'; break;
      case 'VIDEOJUEGO': tableName = 'itemcoleccion_videojuego'; resourceColumn = 'recursovideojuegoid'; break;
      case 'ALBUM':      tableName = 'itemcoleccion_album';      resourceColumn = 'recursoalbumid'; break;
      case 'CANCION':    tableName = 'itemcoleccion_cancion';    resourceColumn = 'recursocancionid'; break;
      default: throw new Error(`Tipo de contenido inválido: ${itemType}`);
    }

    const { error, count } = await supabase
      .from(tableName)
      .delete()
      .match({ 
        coleccionid: listId, 
        [resourceColumn]: resourceId 
      });

    if (error) throw error;
    
    // Verificar si se borró algo (por si falla la RLS)
    if (count === 0) throw new Error("No se encontró el ítem o no tienes permisos");

    return true;
  },

  async fetchListInfo( listId: string, listType: CollectionType) {
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
        throw new Error("Tipo de lista no soportado");
    }

    // Ejecutamos las consultas en paralelo para mayor velocidad
    const [listResponse, itemsResponse] = await Promise.all([
      supabase
        .from('recursocoleccion')
        .select('nombrecoleccion, resena, calificacion, favorito, tipo_contenido')
        .eq('id', listId)
        .single(),
      supabase
        .from(itemTable)
        .select(`
          id,
          fechaagregado,
          recurso: ${resourceTable}!inner (
            contenido: ${contentTable}!inner ( imagenUrl )
          )
        `, { count: 'exact', head: false }) // 'exact' nos da el total real aunque limitemos a 5
        .eq('coleccionid', listId)
        .order('fechaagregado', { ascending: false }) 
        .limit(5)
    ]);

    if (listResponse.error) throw listResponse.error;
    if (itemsResponse.error) throw itemsResponse.error;

    // Procesamos la estructura para devolver solo lo necesario
    const previewImages = (itemsResponse.data || [])
      .map((item: any) => item.recurso?.contenido?.imagenUrl)
      .filter((url: string) => url);


    return {
      id: listId,
      nombre: listResponse.data.nombrecoleccion,
      resena: listResponse.data.resena,
      calificacion: listResponse.data.calificacion,
      favorito: listResponse.data.favorito,
      tipo: listResponse.data.tipo_contenido,

      totalElementos: itemsResponse.count || 0,
      previewImagenes: previewImages // Array de strings con las URLs
    };
  },

  async fetchListDetails( listId: string, listType: CollectionType) {
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
        throw new Error("Tipo de lista no soportado");
    }

    const [listResponse, itemsResponse] = await Promise.all([
	  // Datos de la Lista
      supabase
        .from('recursocoleccion')
        .select('*')
        .eq('id', listId)
        .single(),
      // Datos de los Items + Recurso + Contenido
      supabase
        .from(itemTable)
        .select(`
          id,
          fechaagregado,
          recurso: ${resourceTable} (
            *,
            contenido: ${contentTable} (
              titulo,
              imagenUrl,
              fechaLanzamiento
            )
          )
        `)
        .eq('coleccionid', listId)
        .order('fechaagregado', { ascending: false })
    ]);

    if (listResponse.error) throw listResponse.error;
    if (itemsResponse.error) throw itemsResponse.error;

    // Formateamos los items
    const formattedItems = (itemsResponse.data || []).map((item: any) => {
      const recurso = item.recurso || {};
      const contenido = recurso.contenido || {};
      const { contenido: _, ...restoDelRecurso } = recurso;
      return {
        // Datos de la relación en la lista
        listItemId: item.id,
        fechaAgregado: item.fechaagregado,
		// Datos del Contenido
        titulo: contenido.titulo,
        imagenUrl: contenido.imagenUrl,
        fechaLanzamiento: contenido.fechaLanzamiento || contenido.fechalanzamiento,
        // Datos del Recurso (Todo lo demás: calificacion, reseña, estado, fechas de lectura, etc.)
        ...restoDelRecurso 
      };
    });

    return {
      listInfo: listResponse.data,
      items: formattedItems
    };
  }

};
