import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from 'context/AuthContext';
import { userService } from '../services/profileService';
import { createAdaptedResourceStats } from '../adapters/statsAdapter';
import { ResourceType, useResource2 } from 'hooks/useResource2';

export type CategoryKey = 'libros' | 'películas' | 'series' | 'canciones' | 'videojuegos';

// Initial structure for category statistics
const INITIAL_CATEGORY_DATA = {
  libro: { title: 'Libros Leídos', total: 0, average: 0.0, chartData: new Array(12).fill(0) },
  pelicula: {
    title: 'Películas Vistas',
    total: 0,
    average: 0.0,
    chartData: new Array(12).fill(0),
  },
  serie: { title: 'Series Vistas', total: 0, average: 0.0, chartData: new Array(12).fill(0) },
  cancion: {
    title: 'Canciones Escuchadas',
    total: 0,
    average: 0.0,
    chartData: new Array(12).fill(0),
  },
  videojuego: {
    title: 'Videojuegos Jugados',
    total: 0,
    average: 0.0,
    chartData: new Array(12).fill(0),
  },
};

interface User {
	id: string;
	username: string;
	avatar_url: string;
	description: string;
	followers_count: number;
	following_count: number;
}

export const useProfile = () => {
  const { signOut, user } = useAuth();
  const { fetchResources } = useResource2()
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);


  const [selectedCategory, setSelectedCategory] = useState<ResourceType>('libro');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [userData, setUserData] = useState<User | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [fullCategoryData, setFullCategoryData] = useState(INITIAL_CATEGORY_DATA);
  const [previousYear, setPreviousYear] = useState<number>(new Date().getFullYear());
  

  // Fetch user profile on mount or when user changes
  useEffect(() => {
    if (user) {
	  setLoading(true);
      userService
        .fetchUserProfile(user.id)
        .then((data) => {
          if (data) {
			setUserData(data as User);
          }
        })
        .catch((err) => console.error('[useProfile] Error al cargar perfil:', err))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  // Fetch stats when category or year changes
  useEffect(() => {    
    // Si cambió el año, resetear todos los datos
    if (selectedYear !== previousYear) {
      setFullCategoryData(INITIAL_CATEGORY_DATA);
      setPreviousYear(selectedYear);
	  fetchResourceInfo();
	  return;
    }
    
    if (fullCategoryData[selectedCategory].total === 0) {
      fetchResourceInfo();
    }
  }, [selectedCategory, selectedYear, previousYear]);

  const fetchResourceInfo = async () => {
	try {
		setStatsLoading(true);
		const resourceData = await fetchResources(selectedCategory, null, null, null, null, null, true);
		
		const stats = createAdaptedResourceStats(resourceData || [], selectedCategory, selectedYear);

		updateStats(stats);
	} catch (error) {
		console.error('[useProfile] Error al cargar estadísticas:', error);
		Alert.alert('Error', 'No se pudieron cargar las estadísticas. Intenta de nuevo más tarde.');
	} finally {
		setStatsLoading(false);
	}
  };

  const updateStats = (newStats: any) => {
    // 1. Creamos una copia superficial de todo el objeto
    const newData = { ...fullCategoryData };

    // 2. Modificamos solo la parte que nos interesa de la copia
    newData[selectedCategory] = {
      ...newData[selectedCategory],
      ...newStats,
    };

    // 3. Guardamos la copia completa
    setFullCategoryData(newData);
  };

  const pickImage = async () => {
    try {
      setLoading(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería');
        return;
      }

       ('[pickImage] Abriendo galería...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0] && user) {
         ('[pickImage] Eliminando avatar anterior...');
        await userService.deletePreviousAvatar(userData?.avatar_url || null);
         ('[pickImage] Subiendo nuevo avatar...');
        const newUrl = await userService.uploadAvatar(user.id, result.assets[0].uri);
        setUserData({ ...userData, avatar_url: newUrl } as User);
        Alert.alert('¡Éxito!', 'Foto de perfil actualizada');
      }
    } catch (error) {
      console.error('[pickImage] Error:', error);
      Alert.alert('Error', 'No se pudo actualizar la foto');
    } finally {
       ('[pickImage] Finalizando');
      setLoading(false);
    }
  };
  return {
    userData,
    selectedCategory,
    selectedYear,
    isPressed,
    loading,
    setSelectedCategory,
    setSelectedYear,
    setIsPressed,
    pickImage,
    signOut,
	statsLoading,
	currentStats: fullCategoryData[selectedCategory],
  };
};
