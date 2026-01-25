import { supabase } from 'lib/supabase';

export const userSearchService = {
	async fetchUsers(username: string, currentUserId?: string) {
		const { data, error } = await supabase
		.from('usuario')
		.select('id, username, description, avatar_url')
		.ilike('username', `%${username}%`)
		.neq('id', currentUserId || '');
		
		if (error) throw error;
		return data || [];
	},
};
