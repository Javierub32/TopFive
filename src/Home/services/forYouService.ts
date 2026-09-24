import { supabase } from 'lib/supabase';
import { Activity } from './activityServices';

export const forYouService = {
  async fetchRandomactivities(
    userId: string,
    seed: number,
    limit: number,
    offset: number
  ): Promise<Activity[]> {
    //Se ha creado una función en Supabase para obtener desordenado y aleatorio las reviews públicas
    const { data, error } = await supabase.rpc('get_random_public_reviews', {
      p_user_id: userId,
      p_seed: seed,
      p_limit: limit,
      p_offset: offset,
    });

    if (error) throw error;
    return data || [];
  },
};