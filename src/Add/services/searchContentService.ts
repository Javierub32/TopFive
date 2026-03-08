import { ResourceType } from 'hooks/useResource';
import { supabase } from 'lib/supabase';

export const searchContentService = {
  async fetchContent(termino: string, tipo: ResourceType) {
    try {
      // Llamamos a la Edge Function pasándole solo lo que necesita buscar
      const { data, error } = await supabase.functions.invoke('search-content', {
        body: { term: termino, type: tipo },
      });

      if (error) {
        console.error('Error invocando Edge Function:', error);
        throw new Error('Error al buscar contenido en el servidor');
      }

      if (data?.error) {
          // Captura errores manejados desde el bloque catch del Edge Function
          console.error('Error desde el servidor de búsqueda:', data.error);
          throw new Error(data.error);
      }

      console.log('Datos recibidos de Supabase Edge Function:', data);
      return data;

    } catch (error) {
      console.error('Error en fetchContent:', error);
      throw error;
    }
  },
  async fetchContentDetails(id: string | number, tipo: ResourceType) {
    try {
      // Llamamos a la Edge Function pasándole el id y el tipo
      const { data, error } = await supabase.functions.invoke('search-details', {
        body: { id: id, type: tipo },
      });

      if (error) {
        console.error('Error invocando Edge Function (fetch-details):', error);
        throw new Error('Error al buscar los detalles en el servidor');
      }

      if (data?.error) {
          console.error('Error desde el servidor de detalles:', data.error);
          throw new Error(data.error);
      }

      console.log('Detalles recibidos de Supabase Edge Function:', data);
      return data;

    } catch (error) {
      console.error('Error en fetchDetails:', error);
      throw error;
    }
  }
};