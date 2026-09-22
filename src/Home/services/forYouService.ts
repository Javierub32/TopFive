import { supabase } from 'lib/supabase';
import { Activity } from './activityServices';

export const forYouService = {
  async fetchRandomReviews(
    userId: string,
    seed: number,
    limit: number,
    offset: number
  ): Promise<Activity[]> {
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