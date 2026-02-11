import { useEffect, useState } from "react";
import { userService } from "../services/userService";
import { useAuth } from "context/AuthContext";
import { ResourceType, useResource } from "hooks/useResource";
import { createAdaptedResourceStats } from "@/Profile/adapters/statsAdapter";
import { Alert } from "react-native";

export interface User {
	id: string;
	username: string;
	avatar_url: string;
	description: string;
	followers_count: number;
	following_count: number;
	is_requested: boolean;
	following_status: 'pending' | 'accepted' | null;
}

// Estructura inicial de estadísticas
const INITIAL_CATEGORY_DATA = {
    libro: { title: 'Libros Leídos', total: 0, average: 0.0, chartData: new Array(12).fill(0) },
    pelicula: { title: 'Películas Vistas', total: 0, average: 0.0, chartData: new Array(12).fill(0) },
    serie: { title: 'Series Vistas', total: 0, average: 0.0, chartData: new Array(12).fill(0) },
    cancion: { title: 'Canciones Escuchadas', total: 0, average: 0.0, chartData: new Array(12).fill(0) },
    videojuego: { title: 'Videojuegos Jugados', total: 0, average: 0.0, chartData: new Array(12).fill(0) },
};

export const useUser = (username: string) => {
	const {user} = useAuth();
    const { fetchResources } = useResource();

	const [userData, setUserData] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<ResourceType>('libro');
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [previousYear, setPreviousYear] = useState<number>(new Date().getFullYear());
    const [fullCategoryData, setFullCategoryData] = useState(INITIAL_CATEGORY_DATA);
    const [statsLoading, setStatsLoading] = useState(false);

	useEffect(() => {
		const fetchUserData = async () => {
			setLoading(true);
			try {
				const userId = await userService.getUserIdByUsername(username);
				if (!userId) throw new Error("User not found");
				const data = await userService.fetchUserById(userId, user?.id);
				if (data?.id === user?.id) data.following_status = 'accepted';
				setUserData(data);
			} catch (error) {
				console.error("Error fetching user data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchUserData();
	}, [username, user?.id]);

    // Fetch stats when user data is ready, or category/year changes
    useEffect(() => {
        if (!userData?.id) return;

        // Si cambió el año, resetear
        if (selectedYear !== previousYear) {
            setFullCategoryData(INITIAL_CATEGORY_DATA);
            setPreviousYear(selectedYear);
            fetchResourceInfo(userData.id);
            return;
        }

        // Si no tenemos datos cacheados para esta categoría, buscar
        if (fullCategoryData[selectedCategory].total === 0) {
            fetchResourceInfo(userData.id);
        }
    }, [selectedCategory, selectedYear, previousYear, userData?.id]);

    const fetchResourceInfo = async (targetUserId: string) => {
        try {
            setStatsLoading(true);
            const resourceData = await fetchResources( selectedCategory, null, null, null, null, null, true, null, null, targetUserId );
            
            const stats = createAdaptedResourceStats(resourceData || [], selectedCategory, selectedYear);
            updateStats(stats);
        } catch (error) {
            console.error('[useUser] Error al cargar estadísticas:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    const updateStats = (newStats: any) => {
        const newData = { ...fullCategoryData };
        newData[selectedCategory] = {
            ...newData[selectedCategory],
            ...newStats,
        };
        setFullCategoryData(newData);
    };


	const handleFollow = async () => {
		if (!user) return;
		try {
			const userId = await userService.getUserIdByUsername(username);
			if (!userId) throw new Error("User not found");
			await userService.requestFollow(user.id, userId);
			setUserData((prevData: any) => ({
				...prevData,
				is_requested: true,
				following_status: 'pending'
			}));
		} catch (error) {
			console.error("Error requesting follow:", error);
		}
	};

	const cancelRequest = async () => {
		if (!user) return;
		try {
			const userId = await userService.getUserIdByUsername(username);
			if (!userId) throw new Error("User not found");
			await userService.unfollow(user.id, userId);
			setUserData((prevData: any) => ({
				...prevData,
				is_requested: false,
				following_status: null
			}));
		} catch (error) {
			console.error("Error cancelling follow request:", error);
		}
	};

	return { 
        userData, 
        loading, 
        handleFollow, 
        cancelRequest,
        selectedCategory,
        setSelectedCategory,
        selectedYear,
        setSelectedYear,
        statsLoading,
        currentStats: fullCategoryData[selectedCategory],
    };
}