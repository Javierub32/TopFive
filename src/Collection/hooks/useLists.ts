import { useState } from "react";
import { CollectionType, listServices } from "../services/listServices";
import { useAuth } from "context/AuthContext";
import { useCollection } from "./useCollection";

const categoryMap: Record<string, string> = {
	'Películas': 'PELICULA',
	'Series': 'PELICULA',
	'Videojuegos': 'VIDEOJUEGO',
	'Libros': 'LIBRO',
	'Canciones': 'CANCION',
};


export const useLists = () => {
	const { user } = useAuth();
	const { categoriaActual } = useCollection();
	const [loading, setLoading] = useState(false);
	
	const createList = async (nombre: string, resena: string, calificacion: number, favorito: boolean, tipo: string) => {
		try {
			setLoading(true);
			await listServices.createList(user.id, nombre, resena, calificacion, favorito, categoryMap[categoriaActual] as CollectionType);
		}
		catch (error) {
			console.error("Error creating list:", error);
		}
		finally {
			setLoading(false);
		}
	}

	const updateList = async (listId: string, nombre: string, resena: string, calificacion: number, favorito: boolean) => {
		try {
			setLoading(true);
			await listServices.updateList(user.id, listId, nombre, resena, calificacion, favorito);
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
		}
		catch (error) {
			console.error("Error deleting list:", error);
		}
		finally {
			setLoading(false);
		}
	}


};