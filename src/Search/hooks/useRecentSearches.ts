import { ResourceType } from "hooks/useResource";
import { RecentContentSearch, recentSearchStorage, RecentUserSearch } from "../services/recentSearchStorage";
import { useEffect, useState } from "react";


export const useRecentSearches = <T extends RecentContentSearch | RecentUserSearch> (type: ResourceType | "user", userId?: string | null) => {
	const [recentSearches, setRecentSearches] = useState<T[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let mounted = true;

		setLoading(true);

		async function fetchRecentSearches() {
			try {
				const items = await recentSearchStorage.getRecentSearches<T>(type, userId || null);
				if (mounted) {
					setRecentSearches(items);
				}
			} catch (error) {
				console.error("Error fetching recent searches:", error);
			} finally {
				if (mounted) {
					setLoading(false);
				}
			}
		}

		fetchRecentSearches();
		
		return () => {
			mounted = false;
		};

	}, [type, userId]);

	const addRecentSearch = async (item: T) => {
		if (!userId) return;

		const updatedSearches = await recentSearchStorage.addRecentSearch<T>(type, userId || null, item);
		setRecentSearches(updatedSearches);
	}

	const deleteRecentSearch = async (item: T) => {
		if (!userId) return;

		const updatedSearches = await recentSearchStorage.deleteRecentSearch<T>(type, userId || null, item);
		setRecentSearches(updatedSearches);
	}

	return {
		recentSearches,
		loading,
		addRecentSearch,
		deleteRecentSearch,
	}
}