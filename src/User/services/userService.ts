import { supabase } from 'lib/supabase';

export const userService = {
	async getUserIdByUsername(username: string): Promise<string | null> {
		const { data, error } = await supabase
			.from('usuario')
			.select('id')
			.eq('username', username)
			.maybeSingle();

		if (error) return null;
		return data?.id || null;
	},

	async fetchUserById(userId: string, currentUserId: string) {
		// Ejecutamos ambas consultas al mismo tiempo
		const [userRes, relRes] = await Promise.all([
			supabase
				.from('usuario')
				.select('id, username, description, avatar_url, followers_count, following_count, reviews_count, frame!fk_usuario_frame_id(codigo)')
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
			frame: (user as any).frame?.codigo || 'none',
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

		try {
			// Obtenemos mi username y el push_token de la persona a la que quiero seguir
			const [myUserRes, targetUserRes] = await Promise.all([
				supabase.from('usuario').select('username').eq('id', userId).single(),
				supabase.from('usuario').select('push_token').eq('id', targetUserId).single()
			]);

			const myUsername = myUserRes.data?.username || 'Alguien';
			const pushToken = targetUserRes.data?.push_token;

			// Si la persona tiene un token guardado, le disparamos la notificación
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
						title: 'Nueva solicitud de seguimiento',
						body: `${myUsername} ha solicitado seguirte.`,
						data: { type: 'new_follow_request', followerId: userId },
					}),
				});
			}
		} catch (err) {
			console.error("Error enviando notificación push de solicitud:", err);
		}

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
	},

	async checkEmail(email: string) {
		const { data, error } = await supabase.functions.invoke('check-email-exists', {
			body: { email: email.toLowerCase().trim() },
		});

		if (error) return false;
		return data?.isRegistered === true;
	}
};