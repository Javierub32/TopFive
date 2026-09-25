import { supabase } from 'lib/supabase';

const COMMENTS_TABLE = 'comentario';
const CONTENT_COLUMN = 'content';

export interface Comment {
  id: number;
  user_id: string;
  resource_id: number;
  resource_type: string;
  created_at: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar_url: string | null;
  } | null;
}

export const commentServices = {
  async fetchComments(resourceId: number, resourceType: string, from: number, to: number) {
    const { data, error, count } = await supabase
      .from(COMMENTS_TABLE)
      .select(
        `
			id,
			user_id,
			resource_id,
			resource_type,
			created_at,
			content:${CONTENT_COLUMN},
			author:usuario!user_id (
				id,
				username,
				avatar_url
			)
		`,
        { count: 'exact' }
      )
      .eq('resource_id', resourceId)
      .eq('resource_type', resourceType)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return { items: (data ?? []) as unknown as Comment[], total: count ?? 0 };
  },

  async addComment(userId: string, resourceId: number, resourceType: string, content: string) {
    const { error } = await supabase.from(COMMENTS_TABLE).insert({
      user_id: userId,
      resource_id: resourceId,
      resource_type: resourceType,
      [CONTENT_COLUMN]: content,
    });

    if (error) throw error;
  },
};
