import { useEffect, useState } from "react";
import { activityService } from "../services/activityServices";
import { useAuth } from "context/AuthContext";

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
	autor_principal: string | null;
	usuarioId: string;
	username: string;
	avatar_url: string | null;

}

export const useActivity = () => {
	const [loading, setLoading] = useState(false);
	const [activities, setActivities] = useState<Activity[]>([]);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const { user } = useAuth();

	const pageSize = 5;

	const fetchActivities = async () => {
		if (loading || !hasMore) return;
		setLoading(true);
		try {
			const from = page * pageSize;
			const to = from + pageSize - 1;
			console.log(`Cargando actividades desde ${from} hasta ${to}...`);
			const activities = await activityService.getUltimosRecursosActivos(from, to, user?.id || '');
			console.log(`Actividades cargadas: ${activities.length}`);
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

	return {
		activities,
		refreshing,
		loading,
		fetchActivities,
		refreshActivities,
	};


}