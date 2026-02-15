import { supabase } from 'lib/supabase';

export const userSearchService = {
	async fetchUsers(username: string, currentUserId?: string, from?: number, to?: number) {
		const { data, error } = await supabase
		.from('usuario')
		.select('id, username, description, avatar_url')
		.ilike('username', `%${username}%`)
		.neq('id', currentUserId || '')
		.range(from || 0, to || 10);
		
		if (error) throw error;
		return data || [];
	},
};
