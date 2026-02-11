// src/Collection/hooks/useListsDetails.ts
import { useEffect, useState } from "react";
import { CollectionType, listServices } from "../services/listServices";
import { ResourceType } from "hooks/useResource";
import { Alert } from "react-native";

const categoryMap: Record<ResourceType, CollectionType> = {
	'pelicula': 'PELICULA',
	'serie': 'SERIE',
	'videojuego': 'VIDEOJUEGO',
	'libro': 'LIBRO',
	'cancion': 'CANCION',
};

const PAGE_SIZE = 9; // Cantidad de elementos a cargar por página

export const useListsDetails = (categoriaActual: ResourceType, listId: string) => {
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

	const resetListDetails = () => {
		setData([]);
		setPage(0);
		setHasMore(true);
		fetchListDetails(0);
	}

	const deleteItemFromList = async (itemId: string, type: CollectionType ) => {
		try {
			setLoading(true);
			await listServices.removeItemFromList(listId, itemId, type);
	}
		catch (error) {
			console.error("Error deleting item from list:", error);
		}
		finally {
			setLoading(false);
		}
	}

	const handleDeleteItem = async (itemId: string, type: CollectionType) => {
		Alert.alert('Eliminar de la lista', '¿Estás seguro de que quieres eliminar este ítem de la lista?', [
			{ text: 'Cancelar', style: 'cancel' },
			{ 
				text: 'Confirmar', 
				onPress: async () => {
					await deleteItemFromList(itemId, type);
					await resetListDetails();
				}
			}
		]);
	}

	return {
		loading,
		data,
		handleLoadMore,
        hasMore,
		handleDeleteItem,
	};
};