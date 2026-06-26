import { useEffect, useState } from "react";
import { activityService } from "../services/activityServices";
import { useAuth } from "context/AuthContext";
import { router } from "expo-router";
import { ResourceType, useResource } from "hooks/useResource";

export interface Activity {
	recurso_id: string;
	tipo_contenido: string;
	fechacreacion: string;
	fecha_actividad: string;
	calificacion: number | null;
	comentario: string | null;
	estado: string;
	titulo: string;
	imagen_url: string | null;
	usuarioId: string;
	username: string;
	avatar_url: string | null;
	idapi?: string | number;
}



export const useActivity = () => {
	const [loading, setLoading] = useState(false);
	const [activities, setActivities] = useState<Activity[]>([]);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const { user } = useAuth();
	const { fetchResources } = useResource();

	const pageSize = 5;

	const fetchActivities = async () => {
		if (loading || !hasMore) return;
		setLoading(true);
		try {
			const from = page * pageSize;
			const to = from + pageSize - 1;
			const activities = await activityService.getUltimosRecursosActivos(from, to, user?.id || '');
			setActivities((prev) => [...prev, ...activities]);
			setPage((prev) => prev + 1);
			if (activities.length < pageSize) {
				setHasMore(false);
			}
		}
		catch (error) {
			console.error('Error al cargar actividades:', error);
		}
		finally {
			setLoading(false);
		}
	}

	const refreshActivities = async () => {
		if (refreshing) return;
		setRefreshing(true);
		setPage(0);
		setHasMore(true);
		try {
			const activities = await activityService.getUltimosRecursosActivos(0, pageSize - 1, user?.id || '');
			setActivities(activities || []);
			setPage(1);
			if (activities.length < pageSize) {
				setHasMore(false);
			}
		}
		catch (error) {
			console.error('Error al refrescar actividades:', error);
		}
		finally {
			setRefreshing(false);
		}		
	}

	useEffect(() => {
		fetchActivities();
	}, []);

	const handleItemPress = async (activity: Activity) => {
		try {
			const resourceType = activity.tipo_contenido.toLowerCase() as ResourceType;
			const resourceTypeMap: Record<ResourceType, string> = {
				pelicula: 'film',
				serie: 'series',
				videojuego: 'game',
				libro: 'book',
				cancion: 'song',
			};

			const type = resourceTypeMap[resourceType];
			if (!type) return;

			const item = await fetchResources({
				type: resourceType,
				recursoId: activity.recurso_id ? parseInt(activity.recurso_id, 10) : null,
				targetUserId: activity.usuarioId,
			});

			router.push({
				pathname: `/details/${type}/${type}Resource`,
				params: { item: JSON.stringify(item ? item[0] : null), from: 'home' },
			});
		} catch (error) {
			console.error('Error navigating to activity details:', error);
		}
	};

	return {
		activities,
		refreshing,
		loading,
		fetchActivities,
		refreshActivities,
		handleItemPress,
	};


}