// src/Collection/hooks/useListsDetails.ts
import { useEffect, useState } from "react";
import { CollectionType, listServices } from "../services/listServices";

const categoryMap: Record<string, string> = {
	'Películas': 'PELICULA',
	'Series': 'SERIE',
	'Videojuegos': 'VIDEOJUEGO',
	'Libros': 'LIBRO',
	'Canciones': 'CANCION',
};

const PAGE_SIZE = 9; // Cantidad de elementos a cargar por página

export const useListsDetails = (categoriaActual: string, listId: string) => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<any[]>([]);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	const fetchListDetails = async (currentPage: number) => {
		// Evitar fetch si ya está cargando (a menos que sea la primera carga)
		if (loading && currentPage !== 0) return; 
		
		setLoading(true);
		try {
			const from = currentPage * PAGE_SIZE;
			const to = from + PAGE_SIZE - 1;

			const newItems = await listServices.fetchListDetails(
				listId, 
				categoryMap[categoriaActual] as CollectionType,
				from,
				to
			);

			if (currentPage === 0) {
				setData(newItems);
			} else {
				setData((prev) => [...prev, ...newItems]);
			}

			// Si devolvió menos elementos que el tamaño de página, llegamos al final
			if (newItems.length < PAGE_SIZE) {
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

    // Carga inicial
	useEffect(() => {
		setPage(0);
		setHasMore(true);
		fetchListDetails(0);
	}, [listId, categoriaActual]);

    // Función para cargar la siguiente página
	const handleLoadMore = () => {
		if (!loading && hasMore) {
			const nextPage = page + 1;
			setPage(nextPage);
			fetchListDetails(nextPage);
		}
	};

	return {
		loading,
		data,
		handleLoadMore, // Exportamos la función
        hasMore
	};
};