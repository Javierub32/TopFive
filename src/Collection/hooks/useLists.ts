import { useEffect, useState } from "react";
import { CollectionType, ListInfo, listServices } from "../services/listServices";
import { useAuth } from "context/AuthContext";
import { Alert } from "react-native";
import { router } from "expo-router";
import { ResourceType } from "hooks/useResource";
import { useNotification } from "context/NotificationContext";

const categoryMap: Record<ResourceType, CollectionType> = {
	'pelicula': 'PELICULA',
	'serie': 'SERIE',
	'videojuego': 'VIDEOJUEGO',
	'libro': 'LIBRO',
	'cancion': 'CANCION',
};


export const useLists = (categoriaActual: ResourceType) => {
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [lists, setLists] = useState<ListInfo[]>([]);
	const [data, setData] = useState<any[]>([]);
	const { showNotification } = useNotification();
	useEffect(() => {
		setLists([]);
		fetchListInfo();
	}, [categoriaActual]);
	
	const createList = async (nombre: string, descripcion: string | null, icono: string | null, color: string | null, tipo: string) => {
		try {
			setLoading(true);
			await listServices.createList(user.id, nombre, descripcion, icono, color, categoryMap[categoriaActual] as CollectionType);
			router.push({ pathname: '/Lists'});
			setTimeout(() => {
				showNotification({
					title: 'Lista creada',
					description: `La lista "${nombre}" ha sido creada exitosamente.`,
					isChoice: false
				});
			}, 100);
			/*Alert.alert("Lista creada", `La lista "${nombre}" ha sido creada exitosamente.`,
				[{ text: "OK", 
					onPress: () => router.push({ pathname: '/Lists', params: { initialResource: categoriaActual as ResourceType } }) }]
			 );*/

		}
		catch (error) {
			console.error("Error creating list:", error);
			showNotification({
				title: 'Error',
				description: 'No se pudo crear la lista. Por favor, inténtalo de nuevo.',
				isChoice: false
			});
			//Alert.alert("Error", "No se pudo crear la lista. Por favor, inténtalo de nuevo.");
		}
		finally {
			setLoading(false);
		}
	}

	const updateList = async (listId: string, nombre: string, descripcion: string | null, icono: string | null, color: string | null) => {
		try {
			setLoading(true);
			await listServices.updateList(user.id, listId, nombre, descripcion, icono, color);
			fetchListInfo();
		}
		catch (error) {
			console.error("Error updating list:", error);
		}
		finally {
			setLoading(false);
		}
	}

	const deleteList = async (listId: string) => {
		try {
			setLoading(true);
			await listServices.deleteList(user.id, listId);
			fetchListInfo();
		}
		catch (error) {
			console.error("Error deleting list:", error);
		}
		finally {
			setLoading(false);
		}
	}

	const fetchListInfo = async () => {
		try {
			setLoading(true);
			const fetchedLists = await listServices.fetchListInfo(user.id, categoryMap[categoriaActual] as CollectionType);
			setLists(fetchedLists);
		}
		catch (error) {
			console.error("Error fetching lists:", error);
		}
		finally {
			setLoading(false);
		}
	}



	return {
		loading,
		lists,
		createList,
		updateList,
		deleteList,
		fetchListInfo,
		data,
	};
};