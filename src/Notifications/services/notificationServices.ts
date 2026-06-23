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

		try {
			const [myUserRes, followerRes] = await Promise.all([
				supabase.from('usuario').select('username').eq('id', followingId).single(),
				supabase.from('usuario').select('push_token').eq('id', followerId).single()
			]);

			const myUsername = myUserRes.data?.username || 'Alguien';
			const pushToken = followerRes.data?.push_token;

			// Si el usuario tiene token de notificaciones, enviamos el Push a través de Expo
			if (pushToken) {
				fetch('https://exp.host/--/api/v2/push/send', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Accept-encoding': 'gzip, deflate',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						to: pushToken,
						sound: 'default',
						title: '¡Solicitud aceptada!',
						body: `${myUsername} ha aceptado tu solicitud de seguimiento.`,
						data: { type: 'follow_accepted', userId: followingId },
					}),
				});
			}
		} catch (err) {
			console.error("Error enviando notificación push:", err);
		}

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