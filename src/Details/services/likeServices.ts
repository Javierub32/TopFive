import { supabase } from 'lib/supabase';

const LIKES_TABLE = 'like';

export interface LikeStatus {
  liked: boolean;
  count: number;
}

export const likeServices = {
  async fetchLikeStatus(
    userId: string,
    resourceId: number,
    resourceType: string
  ): Promise<LikeStatus> {
    const [total, own] = await Promise.all([
      supabase
        .from(LIKES_TABLE)
        .select('id', { count: 'exact', head: true })
        .eq('resource_id', resourceId)
        .eq('resource_type', resourceType),
      supabase
        .from(LIKES_TABLE)
        .select('id', { count: 'exact', head: true })
        .eq('resource_id', resourceId)
        .eq('resource_type', resourceType)
        .eq('user_id', userId),
    ]);

    if (total.error) throw total.error;
    if (own.error) throw own.error;

    return { liked: (own.count ?? 0) > 0, count: total.count ?? 0 };
  },

  async addLike(userId: string, resourceId: number, resourceType: string) {
    const { error } = await supabase.from(LIKES_TABLE).insert({
      user_id: userId,
      resource_id: resourceId,
      resource_type: resourceType,
    });

    if (error) throw error;
  },

  async removeLike(userId: string, resourceId: number, resourceType: string) {
    const { error } = await supabase
      .from(LIKES_TABLE)
      .delete()
      .eq('user_id', userId)
      .eq('resource_id', resourceId)
      .eq('resource_type', resourceType);

    if (error) throw error;
  },
};
