import { supabase } from "lib/supabase"

export const notificationServices = {
	async fetchNotifications(userId: string) {
		const { data, error } = await supabase
		.from('relationships')
		.select(`
			id, 
			follower_id, 
			following_id, 
			status,
			following:usuario!follower_id (
				id,
				username,
				avatar_url,
				description
			)
		`)
		.eq('following_id', userId)
		.eq('status', 'pending');
		if (error) throw error;
		
		// Mapear los datos para que tenga la estructura que esperamos
		return data?.map(notification => ({
			id: notification.id,
			follower_id: notification.follower_id,
			following_id: notification.following_id,
			status: notification.status,
			user: notification.following
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
	}
}