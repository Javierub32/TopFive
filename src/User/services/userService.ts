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
				.select('id, username, description, avatar_url, followers_count, following_count, reviews_count, is_private, frame!fk_usuario_frame_id(codigo)')
				.eq('id', userId)
				.single(),
			supabase
				.from('relationships')
				.select('status, alerts_enabled')
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
			following_status: relationship?.status || null, // 'pending', 'accepted', 'blocked' o null
			alerts_enabled: relationship?.alerts_enabled, //Alertas de reviews
			profile_type: user.is_private ? 'private' : 'public', // Añadimos el tipo de perfil
		};
	},

	async requestFollow(userId: string, targetUserId: string) {
		const {data: targetData} = await supabase
			.from('usuario')
			.select('is_private')
			.eq('id', targetUserId)
			.single();

		const isTargetPrivate = targetData?.is_private;
		const finalStatus = isTargetPrivate ? 'pending' : 'accepted';

		const { data, error } = await supabase
			.from('relationships')
			.insert([{
				follower_id: userId,
				following_id: targetUserId,
				status: finalStatus
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
	},

	async blockUser(userId:string, targetUserId:string){
		//Creamos el estado de bloqueo de usuario
		const {data, error} = await supabase
			.from('relationships')
			.upsert({ 
				follower_id: userId,
				following_id: targetUserId,
				status: 'blocked' 
			})

		if (error) throw error;
		//en el caso de que tengan relacion (seguimiento o pendiente) se elimina
		await supabase
			.from('relationships')
			.delete()
			.eq('follower_id', targetUserId)
			.eq('following_id', userId)
		
		return data;
	},

	async unblockUser(userId:string, targetUserId:string){
		const {data, error} = await supabase
			.from('relationships')
			.delete()
			.eq('follower_id', userId)
			.eq('following_id', targetUserId);

		if (error) throw error;
		return data;
	},

	async getBlockState(userId: string, targetUserId: string){
		const [outgoing, incoming] = await Promise.all([
			supabase
				.from('relationships')
				.select('status')
				.eq('follower_id', userId)
				.eq('following_id', targetUserId)
				.maybeSingle(),
			supabase
				.from('relationships')
				.select('status')
				.eq('follower_id', targetUserId)
				.eq('following_id', userId)
				.maybeSingle()
		]);

		 if (outgoing.data?.status === 'blocked') {
    return 'blocked_by_me';
  }

	if (incoming.data?.status === 'blocked') {
    return 'blocked_me';
	}
		return null;
	},

	async checkEmail(email: string) {
		const { data, error } = await supabase.functions.invoke('check-email-exists', {
			body: { email: email.toLowerCase().trim() },
		});

		if (error) return false;
		return data?.isRegistered === true;
	},

	async toggleAlerts(currentUserId: string, targetUserId: string, alertsEnabled: boolean) {
        const { error } = await supabase
            .from('relationships')
            .update({ alerts_enabled: alertsEnabled })
            .eq('follower_id', currentUserId)
            .eq('following_id', targetUserId);
        
        if (error) throw error;
    }
};