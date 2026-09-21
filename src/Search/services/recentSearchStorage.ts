import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResourceType } from "hooks/useResource";



export interface RecentContentSearch {
  id: string;
  category: ResourceType;
  term: string;
  title?: string;
  cover?: string;
  createdAt: number;
};

export interface RecentUserSearch {
  id: string;
  username: string;
  description?: string;
  avatar_url?: string;
  createdAt: number;
};

const MAX_RECENT = 30;

export const recentSearchStorage = {
  
	async getRecentSearches<T extends RecentContentSearch | RecentUserSearch>(type: ResourceType | "user", userId?: string | null): Promise<T[]> {
		if (!userId) return [];

		const key = `recentSearches_${type}_${userId}`;

		try {
			const raw = await AsyncStorage.getItem(key);

			if (!raw) return [];
			
			const parsed = JSON.parse(raw) as T[];

			return Array.isArray(parsed) ? parsed.sort((a, b) => b.createdAt - a.createdAt).slice(0, MAX_RECENT) : [];

		} catch (error) {
			console.error(`Error al obtener búsquedas recientes para ${type}:`, error);
			return [];
		}
  },

  async addRecentSearch<T extends RecentContentSearch | RecentUserSearch>(type: ResourceType | "user", userId: string | null, item: T): Promise<T[]> {
	if (!userId) return [];
	
	const key = `recentSearches_${type}_${userId}`;

	const previousSearches = await recentSearchStorage.getRecentSearches<T>(type, userId);

	try {
		const updatedSearches = [
			item, 
			...previousSearches.filter((previousItem) => previousItem.id !== item.id)]
			.slice(0, MAX_RECENT);

		await AsyncStorage.setItem(key, JSON.stringify(updatedSearches));

		return updatedSearches;
	} catch (error) {
		console.error(`Error al agregar búsqueda reciente para ${type}:`, error);
		return [];
	}


  },

  async deleteRecentSearch<T extends RecentContentSearch | RecentUserSearch>(type: ResourceType | "user", userId: string | null, item: T): Promise<T[]> {
	if (!userId) return [];
	
	const key = `recentSearches_${type}_${userId}`;

	const previousSearches = await recentSearchStorage.getRecentSearches<T>(type, userId);

	try {
		const updatedSearches = previousSearches.filter((s) => s.id !== item.id);

		await AsyncStorage.setItem(key, JSON.stringify(updatedSearches));

		return updatedSearches;
	} catch (error) {
		console.error(`Error al eliminar búsqueda reciente para ${type}:`, error);
		return [];
	}
  },


	
};
