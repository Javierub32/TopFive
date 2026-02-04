import { supabase } from "lib/supabase";

export const listServices = {
	async fetchListsByUserId(userId: string) {
		const { data, error } = await supabase
		.from('recursocoleccion')
		.select('*')
		.eq('usuario_id', userId);
		
		if (error) throw error;
		
		return data || [];
	},

	async createList(userId: string, nombre: string, resena: string, calificacion: number, favorito: boolean, tipo: string) {
	},

	async updateList(userId: string, listId: string, nombre: string, resena: string, calificacion: number, favorito: boolean) {

	},

	async deleteList(userId: string, listId: string) {

	},

	async addItemToList(userId: string, listId: string, itemId: string, itemType: string) {
	}


}