import { supabase } from 'lib/supabase';

export const userSearchService = {
	async fetchUsers(
		username: string,
		currentUserId?: string,
		from?: number,
		to?: number,
		blockedUserIds: string[] = []
	) {
		let query = supabase
			.from('usuario')
			.select('id, username, description, avatar_url')
			.ilike('username', `%${username}%`)
			.order('username', { ascending: true })
			.order('id', { ascending: true })

		if (currentUserId) query = query.neq('id', currentUserId);
		if (blockedUserIds.length > 0) {
			query = query.not('id', 'in', `(${blockedUserIds.join(',')})`);
		}

		const { data, error } = await query.range(from || 0, to || 10);

		if (error) throw error;
		return data || [];
	},
};
