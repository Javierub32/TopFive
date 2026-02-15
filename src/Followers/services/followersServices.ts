import { userService } from "@/User/services/userService";
import { supabase } from "lib/supabase";

export const followersServices = {
	async fetchFollowers(username: string) {
		const userId = await userService.getUserIdByUsername(username);
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

		return data.map((item: any) => item.follower);
	},

	async fetchFollowing(username: string) {
		const userId = await userService.getUserIdByUsername(username);
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
  },

  async removeFollower(ownId: string, deleteId: string) {
	await supabase
	.from('relationships')
	.delete()
	.eq('following_id', ownId)
	.eq('follower_id', deleteId)
	.eq('status', 'accepted');
  },

    async removeFollowing(ownId: string, deleteId: string) {
	await supabase
	.from('relationships')
	.delete()
	.eq('following_id', deleteId)
	.eq('follower_id', ownId)
	.eq('status', 'accepted');
  },
	
	

}