import { supabase } from 'lib/supabase';

export const userService = {
	async getUserIdByUsername(username: string): Promise<string | null> {
		const { data, error } = await supabase
			.from('usuario')
			.select('id')
			.eq('username', username)
			.single();
		
		if (error) return null;
		return data?.id || null;
	},

	async fetchUserById(userId: string, currentUserId: string) {
		// Ejecutamos ambas consultas al mismo tiempo
		const [userRes, relRes] = await Promise.all([
			supabase
			.from('usuario')
			.select('id, username, description, avatar_url, followers_count, following_count')
			.eq('id', userId)
			.single(),
			supabase
			.from('relationships')
			.select('status')
			.eq('follower_id', currentUserId)
			.eq('following_id', userId)
			.maybeSingle() // Usamos maybeSingle para que no de error si no hay relación
		]);

		if (userRes.error) throw userRes.error;

		const user = userRes.data;
		const relationship = relRes.data;

		return {
			...user,
			is_requested: !!relationship, // true si existe, false si es null
			following_status: relationship?.status || null // 'pending', 'accepted' o null
		};
	},

	async requestFollow(userId: string, targetUserId: string) {
		const { data, error } = await supabase
		.from('relationships')
		.insert([{ 
			follower_id: userId, 
			following_id: targetUserId,
			status: 'pending'
		}]);
		if (error) throw error;
		return data;
	},

	async unfollow(userId: string, targetUserId: string) {
		const { data, error } = await supabase
		.from('relationships')
		.delete()
		.eq('follower_id', userId)
		.eq('following_id', targetUserId);
		if (error) throw error;
		return data;
	}
};