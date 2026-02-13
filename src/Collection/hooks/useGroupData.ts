import { ResourceMap, ResourceType, StateType, useResource } from 'hooks/useResource';
import { useState, useEffect } from 'react';

type GroupState = 'enCurso' | 'pendientes' | 'completados';

export const useGroupData = (category: ResourceType, state: StateType) => {
  const { fetchResources } = useResource();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  const PAGE_SIZE = 9;

	const fetchItems = async (currentPage: number) => {
		// Evitar fetch si ya está cargando (a menos que sea la primera carga)
		if (loading && currentPage !== 0) return; 
		
		setLoading(true);
		try {
			const from = currentPage * PAGE_SIZE;
			const to = from + PAGE_SIZE - 1;

			const newItems = await fetchResources(category, null, null, state, PAGE_SIZE, null, null, from, to);

			if (currentPage === 0) {
				setData(newItems || []);
			} else {
				setData((prev) => [...prev, ...newItems || []]);
			}

			// Si devolvió menos elementos que el tamaño de página, llegamos al final
			if (newItems && newItems.length < PAGE_SIZE) {
				setHasMore(false);
			} else {
				setHasMore(true);
			}
		}
		catch (error) {
			console.error("Error fetching list details:", error);
		}
		finally {
			setLoading(false);
		}
	}

  	useEffect(() => {
		setPage(0);
		setHasMore(true);
		fetchItems(0);
	}, [category, state]);

    // Función para cargar la siguiente página
	const handleLoadMore = () => {
		if (!loading && hasMore) {
			const nextPage = page + 1;
			setPage(nextPage);
			fetchItems(nextPage);
		}
	};

	const resetListDetails = () => {
		setData([]);
		setPage(0);
		setHasMore(true);
		fetchItems(0);
	}

  return {
    loading,
    data,
	handleLoadMore,
	resetListDetails,
  };
};
