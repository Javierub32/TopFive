import { supabase } from 'lib/supabase';

export const userSearchService = {
	async fetchUsers(username: string) {
		const { data, error } = await supabase
		.from('usuario')
		.select('id, username, description, avatar_url')
		.ilike('username', `%${username}%`);
		
		if (error) throw error;
		return data;
	},

	async fetchUserById(userId: string) {
		const { data, error } = await supabase
		.from('usuario')
		.select('id, username, description, avatar_url, followers_count, following_count')
		.eq('id', userId)
		.single();
		if (error) throw error;
		return data;
	},

	async requestFollow(userId: string, targetUserId: string) {
		const { data, error } = await supabase
		.from('relationships')
		.insert([{ 
			follower_id: userId, 
			followed_id: targetUserId,
			status: 'pending'
		}]);
		if (error) throw error;
		return data;
	},

	async unfollow(userId: string, targetUserId: string) {
		const { data, error } = await supabase
		.from('follows')
		.delete()
		.eq('follower_id', userId)
		.eq('followed_id', targetUserId);
		if (error) throw error;
		return data;
	}
};
