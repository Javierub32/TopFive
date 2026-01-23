import { supabase } from 'lib/supabase';

export const userService = {
	async fetchUserById(userId: string) {
		const { data, error } = await supabase
			.from('usuario')
			.select('id, username, description, avatar_url, followers_count, following_count')
			.eq('id', userId)
			.single();
		if (error) throw error;
		return data;
	},
};