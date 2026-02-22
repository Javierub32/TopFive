import { ResourceType } from 'hooks/useResource';
import { supabase } from 'lib/supabase';

export const searchContentService = {
  async fetchResources(termino: string, tipo: ResourceType) {
    const { data, error } = await supabase.functions.invoke('search-content', {
      body: { term: termino, type: tipo },
    });

    if (error) {
      console.error('Error invocando Edge Function:', error);
      throw new Error('Error al buscar contenido');
    }

    return data;
  }
};