import { supabase } from 'lib/supabase';

const LIKES_TABLE = 'like';

export interface LikeStatus {
  liked: boolean;
  count: number;
}

export interface LikeUser {
  id: string;
  username: string;
  avatar_url: string | null;
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

  async fetchUsersWhoLiked(resourceId: number, resourceType: string): Promise<LikeUser[]> {
    const { data, error } = await supabase
      .from(LIKES_TABLE)
      .select(
        `
      user_id,
      user:usuario!like_user_id_fkey (
        id,
        username,
        avatar_url
      )
    `
      )
      .eq('resource_id', resourceId)
      .eq('resource_type', resourceType)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data ?? []).flatMap((item: any) => {
      if (!item.user) return [];

      return [
        {
          id: item.user_id,
          username: item.user.username,
          avatar_url: item.user.avatar_url ?? null,
        },
      ];
    });
  },
};
