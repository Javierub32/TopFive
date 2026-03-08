import { ResourceType } from 'hooks/useResource';
import { supabase } from 'lib/supabase';

export const searchContentService = {
  async fetchResources(termino: string, tipo: ResourceType) {
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
      console.error('Error en fetchResources:', error);
      throw error;
    }
  }
};