import { useAuth } from "context/AuthContext";
import { useEffect, useState } from "react";
import { TopFiveItem, topFiveService } from "../services/topFiveServices";
import { ResourceType } from "hooks/useResource";


export const useTopFive = (userId: string) => {
	const { user } = useAuth();
	const [topFiveItems, setTopFiveItems] = useState<TopFiveItem[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchTopFive();
	}, [userId]);

	const fetchTopFive = async () => {
		if (!userId) return;
		try {
			setLoading(true);
			const topFiveData = await topFiveService.fetchTopFive(userId);
			setTopFiveItems(topFiveData);
		} catch (error) {
			console.error('Error al obtener Top Five:', error);
		} finally {
			setLoading(false);
		}
	};

	const insertToTopFive = async (posicion: number, tipoRecurso: ResourceType, recursoId: string) => {
		if (!userId) return;
		if (userId !== user?.id) return;
		try {
			await topFiveService.insertToTopFive(userId, posicion, tipoRecurso, recursoId);
		} catch (error) {
			console.error('Error al insertar en Top Five:', error);
		}
	};



	return {
		topFiveItems,
		loading,
		fetchTopFive,
		insertToTopFive
	};
};