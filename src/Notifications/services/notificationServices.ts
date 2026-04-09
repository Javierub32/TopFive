import { supabase } from "lib/supabase"

export const notificationServices = {
	async fetchNotifications(userId: string, from: number , to: number ) {
		const { data, error } = await supabase
		.from('relationships')
		/* Usamos follower para saber quién me intenta seguir o quién me sigue*/
		.select(`
			id, 
			follower_id, 
			following_id, 
			status,
			follower:usuario!follower_id (
				id,
				username,
				avatar_url,
				description
			)
		`)
		.eq('following_id', userId)
		.range(from, to)
		.order('created_at', { ascending: false });
		
		if (error) throw error;
		
		return data?.map(notification => ({
			id: notification.id,
			follower_id: notification.follower_id,
			following_id: notification.following_id,
			status: notification.status,
			user: notification.follower
		})) || [];
	},

	async acceptNotification(followerId: string, followingId: string) {
		const { data, error } = await supabase
			.from('relationships')
			.update({ status: 'accepted' })
			.eq('following_id', followingId)
			.eq('follower_id', followerId);
		
		if (error) throw error;
		return data;
	},

	async declineNotification(followerId: string, followingId: string) {
		const { error } = await supabase
			.from('relationships')
			.delete()
			.eq('following_id', followingId)
			.eq('follower_id', followerId);
		
		if (error) throw error;
	},

	async countPendingNotifications(userId: string) {
		const { count, error } = await supabase
			.from('relationships')
			.select('*', { count: 'exact' })
			.eq('following_id', userId)
			.eq('status', 'pending');
		
		if (error) throw error;
		return count || 0;
	}
}