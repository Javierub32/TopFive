import { supabase } from "lib/supabase";

export const followersServices = {
	async fetchFollowers(userId: string) {
		const { data, error } = await supabase
		.from('relationships')
		.select(`
			follower:usuario!relationships_follower_fkey (
			id,
			username,
			avatar_url,
			description
			)
		`)
		.eq('following_id', userId) // Yo soy el que está siendo seguido
		.eq('status', 'accepted');  // Solo traemos seguidores aceptados

		if (error) {
			console.error('Error al obtener seguidores:', error.message);
			return [];
		}
		console.log('Fetched followers data:', data);
		console.log('Mapped followers:', data.map((item: any) => item.follower));

		return data.map((item: any) => item.follower);
	},

	async fetchFollowing(userId: string) {
		const { data, error } = await supabase
		.from('relationships')
		.select(`
			following:usuario!relationships_following_fkey (
			id,
			username,
			avatar_url,
			description
			)
		`)
		.eq('follower_id', userId) // Yo soy el seguidor
		.eq('status', 'accepted');

		if (error) {
			console.error('Error al obtener seguidos:', error.message);
			return [];
		}

		return data.map((item: any) => item.following);
  }
}